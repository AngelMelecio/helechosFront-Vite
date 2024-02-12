import { useState, useEffect, useRef } from "react"
import CustomSelect from "../../../components/CustomSelect"
import Input from "../../../components/Input"
import Textarea from "../../../components/Textarea"
import ScanSelect from "../../../components/ScanSelect"
import RutaSelect from "../../../components/RutaSelect"

const FormReposicion = ({
  formik,
  etiquetasOpts,
  turnoOptions,
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
    <div className="flex flex-col h-full ">

      {/* Formulario */}
      <div className="relative h-full overflow-y-scroll">
        <div className="absolute w-full p-4">

          {/* Etiquetas */}
          <div className="flex w-full px-4">
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

              <div className="flex flex-col px-4 pt-5 pb-4 ">
                {
                  [
                    { label: "Modelo", value: detalle?.fichaTecnica?.nombre },
                    { label: "Talla", value: detalle?.cantidades ? detalle.cantidades[0].talla : "" },
                    { label: "Cantidad del paquete", value: detalle?.cantidades ? detalle?.cantidades[0].paquete : "" },
                    { label: "Etiqueta", value: detalle?.cantidades ? detalle?.cantidades[0].etiquetas[0].numEtiqueta : "" }

                  ].map((item, index) => <div key={`D_${index}`} className="flex items-center h-8 border-b">
                    <div className="text-gray-700 text-md ">{item.label}: &nbsp; </div>
                    <div className="font-bold text-teal-700 text-md ">{item.value}</div>
                  </div>)
                }
              </div>
              {/* Es reposicion */}
              <div className="flex flex-row w-full px-4 py-3">
                <label className="pr-2 text-sm font-medium text-teal-700 " htmlFor="">Es reposición</label>
                <input
                  value={formik.values.esReposicion}
                  onChange={(e) => formik.setFieldValue("esReposicion", e.target.checked)}
                  className="w-5 h-5"
                  type="checkbox" />
              </div>

              {/* Cantidad */}
              <div className="flex w-full px-2">
                <Input
                  label="Cantidad"
                  name="cantidad"
                  value={formik.values.cantidad}
                  max={detalle?.cantidades ? detalle?.cantidades[0].paquete : 0}
                  min={1}
                  onChange={(e) => formik.setFieldValue("cantidad", Number(e.target.value))}
                  type="number"
                  placeholder="Ingrese cantidad"
                  errores={formik.errors.cantidad}
                />
              </div>

              {/* Ruta de produccion */}
              {
                formik?.values.esReposicion && <>

                  <div className="flex-col w-full px-2 py-4">
                    <label className="pb-2 pl-1 text-sm font-medium text-teal-700" htmlFor="">Ruta de producción</label>
                    <RutaSelect
                      formik={formik}
                      name="destino"
                      estacionFinal={(detalle?.cantidades[0].etiquetas[0].estacionActual)}
                      rutaBase={detalle?.rutaProduccion}
                    />
                  </div>
                </>
              }

              {/* Motivos */}
              <div className="flex w-full px-2">
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

              {
                formik?.values.esReposicion && <>
                  {/* Empleado Falla */}
                  <div className="flex w-full px-4">
                    <ScanSelect
                      options={empleadosFallasOpts}
                      formik={formik}
                      label="Empleado Falla"
                      name="empleadoFalla"
                      unique="idEmpleado"
                    />
                  </div>
                  {/* Maquina Falla y Turno*/}
                  <div className="flex w-full px-2">
                    <CustomSelect
                      label="Maquina Falla"
                      options={maquinasOptions}
                      value={formik.values.maquina}
                      onChange={(e) => formik.setFieldValue("maquina", e.value)}
                      errores={formik.errors.maquina}
                    />
                    <CustomSelect
                      label="Turno"
                      options={turnoOptions}
                      value={formik.values.turno}
                      onChange={(e) => formik.setFieldValue("turno", e.value)}
                      errores={formik.errors.turno}
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