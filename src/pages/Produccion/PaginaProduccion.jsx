import { useEffect, useState } from "react"
import { ICONS } from "../../constants/icons"
import { useEmpleados } from "../Empleados/hooks/useEmpleados"
import { useMaquinas } from "../Maquinas/hooks/useMaquinas"
import CustomSelect from "../../components/CustomSelect"
import { useRef } from "react"
import { QrReader } from "react-qr-reader"
import { sleep } from "../../constants/functions"
import { useProduccion } from './hooks/useProduccion'
import ResponseModal from "./components/ResponseModal"

const optsTurno = [
  { value: 'Mañana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
]

const optionsDepartamento = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Tejido', label: 'Tejido' },
  { value: 'Corte', label: 'Corte' },
  { value: 'Plancha', label: 'Plancha' },
  { value: 'Empaque', label: 'Empaque' },
  { value: 'Transporte', label: 'Transporte' },
]

const etiquetaColumns = [{ label: 'Modelo', atr: 'modelo' },
{ label: 'No. Etiqieta', atr: 'numEtiqueta' },
{ label: 'Color', atr: 'color' },
{ label: 'Talla', atr: 'talla' },
{ label: 'Cantidad', atr: 'cantidad' },
]

const PaginaProduccion = () => {

  const { postProduccion, loading } = useProduccion()

  const modalContainerRef = useRef()
  const [scannModalVisible, setScannModalVisible] = useState(false)

  const [departamento, setDepartamento] = useState(optionsDepartamento[0])

  const { allEmpleados, refreshEmpleados, loading: gettingEmpleados, getEmpleadoMaquinas } = useEmpleados()
  const [optionsEmpleado, setOptionsEmpleado] = useState([])
  const [empleado, setEmpleado] = useState(null)

  const { allMaquinas, refreshMaquinas, loading: gettingMaquinas } = useMaquinas()
  const [optsMaquinas, setOptsMaquinas] = useState([])
  const [maquina, setMaquina] = useState(null)

  const [turno, setTurno] = useState(null)

  // Etiqueta Escaneada Actual
  const [etiqueta, setEtiqueta] = useState(null)

  // Lista de Etiquetas Escaneadas
  const [etiquetasList, setEtiquetasList] = useState([])

  // Response
  const [response, setResponse] = useState(null)
  const [responseModalVisible, setResponseModalVisible] = useState(false)

  useEffect(() => {
    refreshEmpleados()
    refreshMaquinas()
  }, [])

  useEffect(() => {
    setOptionsEmpleado(allEmpleados
      .filter(e => e.departamento === departamento)
      .map(e => ({ value: e.idEmpleado, label: e.nombre }))
    )
    setEmpleado(null)
  }, [departamento])

  useEffect(async () => {
    if(!empleado) return
    let maquinas = await getEmpleadoMaquinas(empleado.idEmpleado)
    let mqnasIds = maquinas.map(m => m.idMaquina)
    setOptsMaquinas(
      [
        ...allMaquinas.filter(m => mqnasIds.includes(m.idMaquina)), // Maquinas del empleado
        ...allMaquinas.filter(m => !mqnasIds.includes(m.idMaquina)) // Maquinas no asignadas
      ].map(m => ({ value: m.idMaquina, label: "L-" + m.linea + " M-" + m.numero }))
    )

    let p1 = new Date().setHours(6, 0, 0)
    let p2 = new Date().setHours(14, 30, 0)

    setTurno(
      (Date.now() >= p1 &&
        Date.now() < p2) ? 'Mañana' : 'Tarde')

  }, [empleado])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    modalContainerRef.current.classList.remove('visible')
    await sleep(150)
    setState(false)
  }

  const handleScan = (result, error) => {
    if (result) {
      setEtiqueta(JSON.parse(result.text))
      handleCloseModal(setScannModalVisible)
    }
  }

  const handleCapturar = async () => {
    setEtiquetasList([])
    setEmpleado(null)

    let {
      empleado: empleadoResponse,
      fecha,
      registros,
      departamento
    } = await postProduccion(etiquetasList.map(etq => ({
      "empleado": empleado.idEmpleado,
      "maquina": maquina,
      "produccion": etq.idProduccion,
      "turno": turno,
      "departamento": empleado.departamento
    })))

    setResponse({
      empleado: empleadoResponse,
      fecha: new Date(fecha).toLocaleString(),
      registros,
      departamento
    })

    handleOpenModal(setResponseModalVisible)
  }

  return (
    <>
      <div className="flex w-full h-full relative pl-18 bg-slate-100">
        <div id="tbl-page" className="flex flex-col h-full w-full absolute p-4 overflow-hidden">
          <div className="flex flex-col h-full">
            <h1 className="font-bold text-2xl pb-4 pl-3 text-teal-700">Captura de Producción</h1>
            <div className="h-full flex flex-col overflow-hidden bg-slate-100">
              <div className="w-full h-1/2 ">
                <div className="flex w-full h-full">
                  {/* Datos del Empleado  */}
                  <div className="w-1/3 relative pr-1.5 pb-1.5">
                    <div className="flex flex-col w-full h-full relative bg-white rounded-lg shadow-md">
                      {/*  Card Header */}
                      <div className="w-full p-2 mb-2 flex items-center justify-between">
                        <p className="text-teal-700 text-lg font-semibold px-2">Datos del Empleado</p>
                        <button
                          type="button"
                          className="normal-button h-8 w-8 rounded-md total-center">
                          <ICONS.Qr size="22px" />
                        </button>
                      </div>
                      {
                        empleado === null ?
                          <>
                            {/* Selector de Empleado */}
                            <div className="relative w-full h-full flex flex-col">
                              <div className="absolute w-full h-full px-2">
                                <div className="flex w-full">
                                  <CustomSelect
                                    className="z-[11]"
                                    label="Departamento"
                                    options={optionsDepartamento}
                                    value={departamento}
                                    onChange={e => setDepartamento(e.value)}
                                  />
                                </div>
                                <div className="flex w-full">
                                  <CustomSelect
                                    className="z-10"
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

                              {/* Datos del Empleado */}
                              <div className="flex py-2">
                                <div className="pl-6 pr-4">
                                  <div className="foto relative">
                                    <img className="foto" src={empleado.fotografia} alt="" />
                                    <button
                                      type="button"
                                      onClick={e => {
                                        setEmpleado(null);
                                        setEtiqueta(null);
                                        setEtiquetasList([])
                                      }}
                                      className="absolute h-8 w-8 neutral-button rounded-full -top-1.5 -left-1.5 ">
                                      <ICONS.Cancel size="20px" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex flex-col border-t border-b flex-1 p-2 mr-1">
                                  <p className="text-lg italic font-semibold text-gray-800">
                                    {empleado.nombre + " "}
                                    {empleado.apellidos}
                                  </p>
                                  <p className="text-base italic text-gray-800">{empleado.departamento}</p>
                                </div>
                              </div>
                              <div className="flex px-2 w-full absolute bottom-7">
                                <CustomSelect
                                  className="z-10"
                                  label="Maquina"
                                  options={optsMaquinas}
                                  value={maquina}
                                  onChange={e => setMaquina(e.value)}
                                />
                                <CustomSelect
                                  className="z-10"
                                  label="Turno"
                                  options={optsTurno}
                                  value={turno}
                                  onChange={e => setTurno(e.value)}
                                />
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
                        {
                          /* Boton Escanear Etiqueta  */
                          etiqueta === null ?
                            <button
                              onClick={e => handleOpenModal(setScannModalVisible)}
                              disabled={empleado === null}
                              type="button"
                              className="normal-button h-8 w-8 rounded-md total-center">
                              <ICONS.Qr size="22px" />
                            </button> :
                            /* Botones Confirmar o Cancelar Etiqueta  */
                            <div className="flex">
                              <button
                                onClick={e => setEtiqueta(null)}
                                className="neutral-button h-8 w-8 rounded-md total-center mr-2">
                                <ICONS.Cancel size="18px" />
                              </button>
                              <button
                                onClick={e => { setEtiquetasList(prev => [...prev, { ...etiqueta }]); setEtiqueta(null) }}
                                className="normal-button h-8 w-8 rounded-md total-center">
                                <ICONS.Check size="20px" />
                              </button>
                            </div>
                        }
                      </div>
                      {/*  Etiqueta Actual */}
                      <div className="w-full h-full relative">
                        {etiqueta !== null ?
                          <div className="w-full h-full absolute flex-col overflow-y-scroll">
                            <div className="flex pt-2 px-4">
                              <table className="w-full border-t-2 border-b-2 py-2 px-4">
                                <tbody>
                                  {
                                    etiquetaColumns.map((column, index) =>
                                      <tr key={"ER" + index} className={(index ? "border-t" : "") + " h-8"}>
                                        <td className="text-sm font-semibold text-teal-700 px-4"> {column.label}:</td>
                                        <td className="text-lg text-gray-800 w-full"> {etiqueta[column.atr]} </td>
                                      </tr>
                                    )
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div> : /* No hay Eqtiqueta */
                          <div className="total-center bg-gray-100 h-full">
                            <p className="italic font-semibold text-gray-600">
                              Escaneé una etiqueta ...
                            </p>
                          </div>
                        }
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
                    <button
                      onClick={handleCapturar}
                      disabled={loading || empleado === null || etiquetasList.length === 0}
                      type="button"
                      className="normal-button h-8 rounded-md px-6">Capturar</button>
                  </div>
                  <div className="w-full h-full relative">
                    <div className="w-full h-full absolute flex-col overflow-y-scroll">
                      <div className="flex pt-2 px-4">
                        <table className="customTable">
                          <thead>
                            <tr>
                              {etiquetaColumns.map((column, i) => <th key={"he" + i}>{column.label}</th>)}
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {
                              etiquetasList.map((etiqueta, i) => <tr key={"et" + i}>
                                {etiquetaColumns.map((column, j) => <td key={"ec" + j}>{etiqueta[column.atr]}</td>)}
                                <td className="total-center">
                                  <button
                                    onClick={e => setEtiquetasList(prev => prev.filter((etiqueta, index) => index !== i))}
                                    type="button"
                                    className="trash-button h-7 w-7 total-center rounded-md"><ICONS.Trash size="16px" /></button>
                                </td>
                              </tr>)
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  Contenedor del Modal */}
      <div className='modal absolute z-50 h-full w-full' ref={modalContainerRef}>
        {scannModalVisible &&
          <div className="flex grayTrans w-full h-full total-center">
            <div className="relative" style={{ width: '200px', height: '200px' }}>
              <QrReader
                scanDelay={300}
                className="w-full h-full absolute"
                onResult={handleScan}
              />
              <button
                type="button"
                onClick={e => handleCloseModal(setScannModalVisible)}
                className="absolute h-8 w-8 neutral-button rounded-full -top-1.5 -left-1.5 ">
                <ICONS.Cancel size="20px" />
              </button>
            </div>
          </div>
        }
        {
          responseModalVisible &&
          <ResponseModal
            onClose={() => handleCloseModal(setResponseModalVisible)}
            response={response}
          />
        }
      </div>
    </>
  )
}
export default PaginaProduccion