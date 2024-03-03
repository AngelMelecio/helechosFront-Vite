import { useState, useEffect } from "react"
import Textarea from "../../../components/Textarea"
import RutaSelect from "../../../components/RutaSelect"
import OptsScan from "../../../components/Inputs/OptsScan"
import AbsScroll from "../../../components/AbsScroll"
import FieldsBox from "../../../components/FieldsBox"
import Inpt from "../../../components/Inputs/Inpt"
import OptsInpt from "../../../components/Inputs/OptsInpt"

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

    <AbsScroll vertical>
      <div className="absolute w-full p-4">
        {/* Etiquetas */}
        <div className="flex w-full">
          <FieldsBox title="Datos de la etiqueta">
            <OptsScan
              options={etiquetasOpts}
              formik={formik}
              label="Etiqueta"
              name="etiqueta"
              unique="idProduccion"
              placeholder="Seleccione una etiqueta"
            />
            {detalle &&
              <div className="grid grid-cols-[75%_auto] gap-6">
                <Inpt
                  label="Nombre del modelo"
                  name="nombreModelo"
                  formik={formik}
                  value={detalle?.fichaTecnica?.nombre}
                  readOnly
                />
                <Inpt
                  label="Cant. del paquete"
                  name="cantidadPaquete"
                  formik={formik}
                  value={detalle?.cantidades ? detalle?.cantidades[0].paquete : ""}
                  readOnly
                />
              </div>
            }
          </FieldsBox>
        </div>
        {
          detalle && <>
            <div className="flex w-full">
              <FieldsBox title="Datos de producción">
                <Inpt
                  label="Cantidad"
                  name="cantidad"
                  formik={formik}
                  type="number"
                  placeholder="Ingrese cantidad"
                />
                <Textarea
                  label="Motivos"
                  formik={formik}
                  onChange={(e) => formik.setFieldValue("motivos", e.target.value)}
                  name="motivos"
                  type="text"
                  placeholder="Ingrese los motivos"
                  rows="5"
                  errores={formik.errors.motivos}
                />
                <div className="flex flex-row w-full pt-8 pb-4">
                  <label className="pr-2 text-sm font-medium text-teal-800/80 " htmlFor="">Es reposición</label>
                  <input
                    value={formik.values.esReposicion}
                    onChange={(e) => formik.setFieldValue("esReposicion", e.target.checked)}
                    className="w-5 h-5 switch"
                    type="checkbox" />
                </div>
              </FieldsBox>
            </div>

            {/* Es reposicion */}
            {
              formik?.values.esReposicion && <div className="flex w-full">
                <FieldsBox title="Datos de reposición">
                  <div className="flex-col w-full pt-2 pb-8">
                    <label className="pb-0.5 text-sm font-medium text-teal-800/80" htmlFor="">Ruta de producción</label>
                    <RutaSelect
                      formik={formik}
                      name="destino"
                      estacionFinal={(detalle?.cantidades[0].etiquetas[0].estacionActual)}
                      rutaBase={detalle?.rutaProduccion}
                    />
                  </div>
                  <div className="flex w-full ">
                    <OptsScan
                      formik={formik}
                      options={empleadosFallasOpts}
                      label="Empleado Falla"
                      name="empleadoFalla"
                      unique="idEmpleado"
                    />
                  </div>
                  {/* Maquina Falla y Turno*/}
                  <div className="flex w-full gap-6">
                    <OptsInpt
                      space
                      label="Maquina Falla"
                      name="maquina"
                      formik={formik}
                      options={maquinasOptions}
                      placeholder="Seleccione una máquina"

                    />
                    <OptsInpt
                      space
                      label="Turno"
                      name="turno"
                      options={turnoOptions}
                      formik={formik}
                      placeholder="Seleccione un turno"
                    />
                  </div>
                </FieldsBox>
              </div>
            }
          </>
        }
      </div>
    </AbsScroll>
  )
}

export default FormReposicion