import { useState, useEffect, useRef } from "react"
import CustomSelect from "../../../components/CustomSelect"
import Input from "../../../components/Input"
import Textarea from "../../../components/Textarea"
import { ICONS } from "../../../constants/icons"
import { sleep } from "../../../constants/functions"
import { useAuth } from "../../../context/AuthContext"
import { FormikProvider } from "formik"
import { set } from "lodash"
import ScanSelect from "../../../components/ScanSelect"
import RutaSelect from "../../../components/RutaSelect"

const FormReposicion = ({
  formik,
  etiquetasOpts,
  empleadosReponedoresOpts,
  empleadosFallasOpts,
  maquinasOptions,
  allDetalles,

}) => {

  const [detalle, setDetalle] = useState(null)

  useEffect(() => {
    setDetalle(() => {
      const etiquetaId = formik?.values.etiqueta;
      let found = null;

      for (let i = 0; i < allDetalles.length; i++) {
        let dtll = allDetalles[i]
        for (let j = 0; j < dtll.cantidades.length; j++) {
          let cnt = dtll.cantidades[j]
          for (const etq of cnt.etiquetas) {
            if (etq.idProduccion === etiquetaId) {
              found = {
                ...dtll,
                cantidades: [{
                  ...cnt,
                  etiquetas: [etq]
                }
                ]
              }
              break;
            }
          }
        }
      }
      return found
    });
  }, [formik?.values.etiqueta])

  return (
    <div
      className="flex flex-col h-full ">

      {/* Formulario */}
      <div className="relative h-full overflow-y-scroll">
        <div className="absolute w-full p-4">
          {/* Etiquetas */}
          <div className="flex w-full px-2">
            <ScanSelect
              options={etiquetasOpts}
              formik={formik}
              label="Etiqueta"
              name="etiqueta"
              unique="idProduccion"
            />
          </div>
          {
            detalle && <>
              <div className="flex flex-col px-4 py-6 ">
                {
                  [
                    { label: "Modelo", value: detalle?.fichaTecnica?.nombre },
                    { label: "Talla", value: detalle?.cantidades ? detalle.cantidades[0].talla : "" },
                    { label: "Cantidad del paquete", value: detalle?.cantidades ? detalle?.cantidades[0].paquete : "" },
                  ].map((item, index) => <div key={`D_${index}`} className="flex items-center h-8 border-b">
                    <div className="text-sm text-gray-700 ">{item.label}: &nbsp; </div>
                    <div className="text-lg font-bold text-teal-700 ">{item.value}</div>
                  </div>)
                }
              </div>
              {/* Cantidad */}
              <div className="flex w-full">
                <Input
                  label="Cantidad"
                  name="cantidad"
                  value={formik.values.cantidad}
                  onChange={(e) => formik.setFieldValue("cantidad", Number(e.target.value))}
                  type="number"
                  placeholder="Ingrese cantidad"
                  errores={formik.errors.cantidad}
                />
              </div>
              {/* Ruta de produccion */}
              <div className="flex-col w-full px-2 py-4">
                <label className="pb-2 pl-1 text-sm font-medium text-teal-700" htmlFor="">Ruta de producción</label>
                <RutaSelect
                  formik={formik}
                  name="destino"
                  estacionFinal={detalle?.cantidades[0].etiquetas[0].estacionActual}
                  rutaBase={detalle?.rutaProduccion}
                />
              </div>
              {/* Motivos */}
              <div className="flex w-full">
                <Textarea
                  resize="none"
                  label="Motivos"
                  value={formik.values.motivos}
                  onChange={(e) => formik.setFieldValue("motivos", e.target.value)}
                  name="motivos"
                  type="text"
                  placeholder="Ingrese los motivos"
                  rows="5"
                  errores={formik.errors.motivos}
                />
              </div>
              {/* Es reposicion */}
              <div className="flex items-center w-full px-2 py-4">
                <label className="pr-2 text-sm font-medium text-teal-700" htmlFor="">Es reposición</label>
                <input
                  value={formik.values.esReposicion}
                  onChange={(e) => formik.setFieldValue("esReposicion", e.target.checked)}
                  className="w-5 h-5"
                  type="checkbox" />
              </div>
              {
                formik?.values.esReposicion && <>
                  {/* Empleado Falla */}
                  <div className="flex w-full px-2">
                    <ScanSelect
                      options={empleadosFallasOpts}
                      formik={formik}
                      label="Empleado Falla"
                      name="empleadoFalla"
                      unique="idEmpleado"
                    />
                  </div>
                  {/* Maquina Falla */}
                  <div className="flex w-full">
                    <CustomSelect
                      label="Maquina Falla"
                      options={maquinasOptions}
                      value={formik.values.maquina}
                      onChange={(e) => formik.setFieldValue("maquina", e.value)}
                      errores={formik.errors.maquina}
                    />
                  </div>

                </>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default FormReposicion