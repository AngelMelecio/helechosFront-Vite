import { useEffect, useState } from "react"
import { ICONS } from "../../constants/icons"
import { useEmpleados } from "../Empleados/hooks/useEmpleados"
import CustomSelect from "../../components/CustomSelect"

const optionsDepartamento = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Tejido', label: 'Tejido' },
  { value: 'Corte', label: 'Corte' },
  { value: 'Plancha', label: 'Plancha' },
  { value: 'Empaque', label: 'Empaque' },
  { value: 'Transporte', label: 'Transporte' },
]

const PaginaProduccion = () => {

  const { allEmpleados, refreshEmpleados, loading: gettingEmpleados } = useEmpleados()
  const [optionsEmpleado, setOptionsEmpleado] = useState([])

  const [departamento, setDepartamento] = useState(optionsDepartamento[0])
  const [empleado, setEmpleado] = useState(null)

  useEffect(async () => {
    await refreshEmpleados()
  }, [])

  useEffect(() => {
    console.log(departamento)
    setOptionsEmpleado(allEmpleados
      .filter(e => e.departamento === departamento)
      .map(e => ({ value: e.idEmpleado, label: e.nombre }))
    )
    setEmpleado(null)
  }, [departamento])

  /* 
    useEffect(() => {
      //console.log(empleado)
    }, [empleado])
   */

  return (
    <div className="flex w-full h-full relative pl-18 bg-slate-100">
      <div id="tbl-page" className="flex flex-col h-full w-full absolute p-4 overflow-hidden">
        <div className="flex flex-col h-full">
          <h1 className="font-bold text-2xl pb-4 pl-3 text-teal-700">Captura de Producción</h1>
          <div className="h-full flex flex-col overflow-hidden bg-slate-100">
            <div className="w-full h-1/2 ">
              <div className="flex w-full h-full">
                {/* Datos del Empleado  */}
                <div className="w-1/3 relative pr-1.5 pb-1.5">
                  <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                    {/*  Card Header */}
                    <div className="w-full h-12 p-2 flex items-center justify-between">
                      <p className="text-teal-700 text-lg font-semibold px-2">Datos del Empleado</p>
                      <button type="button" className="normal-button h-8 w-8 rounded-md total-center">
                        <ICONS.Qr size="22px" />
                      </button>
                    </div>
                    {
                      empleado === null ?
                        <>
                          {/* Selector de Empleado */}
                          <div className="relative w-full h-full flex flex-col">
                            <div className="absolute w-full h-full">
                              <div className="flex w-full">
                                <CustomSelect
                                  label="Departamento"
                                  options={optionsDepartamento}
                                  value={departamento}
                                  onChange={e => setDepartamento(e.value)}
                                />
                              </div>
                              <div className="flex w-full">
                                <CustomSelect
                                  label="Trabajador"
                                  options={optionsEmpleado}
                                  value={empleado}
                                  onChange={e => setEmpleado(allEmpleados.find(empl => empl.idEmpleado === e.value))}
                                />
                              </div>
                            </div>
                          </div>
                        </> :
                        <>
                          {/* Empleado Seleccionado */}
                          <div className="flex-col w-full h-full overflow-y-scroll">
                            <div className="flex">
                              <div className="flex-col flex-1">
                                <div className="w-full flex justify-start">
                                  <button
                                    className="trash-button h-8 w-8 rounded-md"
                                    onClick={e => setEmpleado(null)}
                                  >
                                    X
                                  </button>
                                </div>
                              </div>
                              <div className="foto">
                                <img className="foto" src={empleado.fotografia} alt="" />
                              </div>
                            </div>
                          </div>
                        </>

                    }

                  </div>
                </div>
                {/*  Datos de la Etiqueta Actual  */}
                <div className="flex-grow relative pl-1.5 pb-1.5">
                  <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                    {/*  Card Header */}
                    <div className="w-full h-12 p-2 flex items-center justify-between">
                      <p className={(empleado === null ? "text-gray-400" : "text-teal-700") + " text-lg font-semibold px-2"}>Etiqueta Actual</p>
                      <button disabled={empleado === null} type="button" className="normal-button h-8 w-8 rounded-md total-center">
                        <ICONS.Qr size="22px" />
                      </button>
                    </div>
                    <div className="w-full h-full relative">
                      <div className="w-full h-full absolute flex-col overflow-y-scroll">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  Datos de la Captura  */}
            <div className="w-full h-1/2 relative pt-1.5">
              <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                {/* Card Header */}
                <div className="w-full h-12 p-2 flex items-center  justify-between">
                  <p className={(empleado === null ? "text-gray-400" : "text-teal-700") + " text-lg font-semibold px-2"}>Datos de la Captura</p>
                  <button disabled={empleado === null} type="button" className="normal-button h-8 rounded-md px-6">Capturar</button>
                </div>
                <div className="w-full h-full relative">
                  <div className="w-full h-full absolute flex-col overflow-y-scroll">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PaginaProduccion