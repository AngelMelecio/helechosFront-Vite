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
import { set } from "lodash"
import { API_URL } from "../../constants/HOSTS";
import ScanModal from "./components/ScanModal"
import { useAuth } from "../../context/AuthContext"

const optsTurno = [
  { value: 'Mañana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
]

const etiquetaColumns = [
  { label: 'Modelo', atr: 'modelo' },
  { label: 'No. Etiqieta', atr: 'numEtiqueta' },
  { label: 'Color', atr: 'color' },
  { label: 'Talla', atr: 'talla' },
  { label: 'Cantidad', atr: 'cantidad' },
]

const PaginaProduccion = () => {

  const { postProduccion, loading } = useProduccion()
  const { notify } = useAuth()
  const modalContainerRef = useRef()
  const pageRef = useRef()
  const scanEmpleadoInputRef = useRef()
  const scanProduccionInputRef = useRef()

  const [scaningEmpleado, setScaningEmpleado] = useState(false)
  const [scaningProduccion, setScaningProduccion] = useState(false)

  const [showMaquina, setShowMaquina] = useState(true)

  const { getEmpleadoMaquinas } = useEmpleados()
  const [empleado, setEmpleado] = useState(null)

  const { allMaquinas, refreshMaquinas, loading: gettingMaquinas } = useMaquinas()
  const [optsMaquinas, setOptsMaquinas] = useState([])
  const [maquina, setMaquina] = useState(0)

  const [turno, setTurno] = useState(null)

  // Lista de Etiquetas Escaneadas
  const [etiquetasList, setEtiquetasList] = useState([])

  // Response
  const [response, setResponse] = useState(null)
  const [responseModalVisible, setResponseModalVisible] = useState(false)

  useEffect(() => {
    //refreshEmpleados()
    refreshMaquinas()
  }, [])

  // Settear opciones de máquinas y turno cuando el empleado cambia
  useEffect(async () => {
    if (!empleado) return
    //Validar que necesita capturar maquina
    if (empleado.departamento !== "Empaque" && empleado.departamento !== "Calidad") {
      let maquinas = await getEmpleadoMaquinas(empleado.idEmpleado);
      let mqnasIds = maquinas.map(m => m.idMaquina);
      setOptsMaquinas(
        [
          ...allMaquinas.filter(m => mqnasIds.includes(m.idMaquina)), // Maquinas del empleado
          ...allMaquinas.filter(m => !mqnasIds.includes(m.idMaquina)).filter(m => m.departamento === empleado.departamento) // Maquinas no asignadas pero del mismo departamento
        ].map(m => ({ value: m.idMaquina, label: ((m.linea !== '0') ? 'L' + m.linea + ' - ' : '') + 'M' + m.numero }))
      );
      setMaquina(null);
      setShowMaquina(true)
    } else {
      setShowMaquina(false);
      setMaquina(null)
      setOptsMaquinas([]);
    }

    //Turno
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

  const handleScanEtiqueta = (result) => {
    try {
      if (result) {
        let objScan
        try {
          objScan = JSON.parse(result)
        } catch (e) {
          throw new Error('Etiqueta invalida')
        }
        if (!objScan.idProduccion)
          throw new Error('Etiqueta invalida')
        if (etiquetasList.some(e => e.idProduccion === objScan.idProduccion))
          throw new Error('Etiqueta duplicada')

        setEtiquetasList(prev => [...prev, { ...objScan }])
      }
    } catch (e) {
      notify(e + "", true)
    }
  }

  const handleScanEmpleado = (result) => {
    try {
      if (result) {
        const objScan = JSON.parse(result)
        if (objScan.idEmpleado) {
          setEmpleado(objScan)
          scanEmpleadoInputRef.current?.blur()
        }
      }
    } catch (e) {
      notify('Gafete invalido', true)
    }
  }

  const validate = () => {
    if (maquina === null) throw new Error('Selecciona una máquina')
  }

  const handleCapturar = async () => {
    try {
      validate()
      setEtiquetasList([])

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
    } catch (e) {
      notify(e + "", true)
    }
  }

  return (
    <>
      <div className="flex w-full h-full relative pl-18 bg-slate-100">
        <div id="tbl-page" ref={pageRef} className="flex flex-col h-full w-full absolute p-4 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-row w-full items-center justify-between pr-1 pb-4">
              <h1 className="font-bold text-2xl  pl-3 text-teal-700">Captura de Producción</h1>
              <button
                onClick={handleCapturar}
                disabled={loading || empleado === null || etiquetasList.length === 0 || turno === null}
                type="button"
                className="normal-button h-10 rounded-md flex total-center">
                {
                  loading ?
                    <p className="px-6">
                      Capturando...
                    </p> :
                    <>
                      <p className="px-6">
                        Capturar
                      </p>
                      <ICONS.Right className="mr-1" size="22px" />
                    </>
                }
              </button>
            </div>

            <div className="h-full flex flex-col overflow-hidden bg-slate-100">
              <div className="w-full h-full">
                <div className="flex w-full h-full">
                  {/* Datos del Empleado  */}
                  <div className="w-2/4 relative pr-1.5 pb-1.5 rounded-lg">
                    <div className="  flex flex-col w-full h-full relative bg-white rounded-lg shadow-md">
                      {/*  Card Header */}
                      <div className="w-full p-2 flex items-center justify-between">
                        {
                          // Escanear Gafete
                          empleado === null ?
                            <>
                              <button
                                type="button"
                                disabled={empleado !== null || scaningEmpleado}
                                className={(scaningEmpleado ? "pointer-events-none" : "") + " flex normal-button h-10 px-2 rounded-md total-center font-bold"}
                                onClick={e => { setScaningEmpleado(true); scanEmpleadoInputRef.current?.focus() }}>
                                <div className={"relative " + (scaningEmpleado ? "scan-icon" : "")}>
                                  <ICONS.Qr size="28px" />
                                </div>
                                <p className="px-2">{scaningEmpleado ? "Escaneando Gafete..." : "Escanear Gafete"}</p>
                              </button>
                              {/* Invisible Input */}
                              <input
                                ref={scanEmpleadoInputRef}
                                className="visible opacity-0 h-0 w-0"
                                type="text"
                                autoFocus={true}
                                onBlur={e => setScaningEmpleado(false)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    handleScanEmpleado(e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </> :
                            // Cambiar Gafete
                            <>
                              <button
                                onClick={e => {
                                  setEmpleado(null);
                                  setEtiquetasList([])
                                }}
                                className="h-10 px-2 flex neutral-button rounded-md ">
                                <ICONS.Left size="21px" />
                                <p className="font-bold  px-2">
                                  Cambiar Gafete
                                </p>
                              </button>
                            </>
                        }
                      </div>
                      {
                        empleado === null ?
                          <>
                            {/* Selector de Empleado */}

                            <div className=" w-full h-full px-2 rounded-b-md total-center bg-gray-100">
                              <p className="italic font-semibold text-gray-600">
                                Aún no has escaneado tu gafete...
                              </p>
                            </div>

                          </> :
                          <>
                            {/* Empleado Seleccionado */}
                            <div className="flex-col w-full h-full overflow-y-scroll">

                              {/* Datos del Empleado */}
                              <div className="flex flex-col">
                                <div className="flex py-2">
                                  <div className="pl-6 pr-4">
                                    <div className="foto relative">
                                      <img className="foto" src={API_URL + empleado.fotografia} alt="" />
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
                                <div className="flex flex-col px-4 w-full my-4 bottom-7">
                                  <div className="flex flex-row justify-between">
                                    <div className="flex w-full">
                                      {showMaquina &&
                                        <CustomSelect
                                          className="z-[10]"
                                          label="Maquina"
                                          options={optsMaquinas}
                                          value={maquina}
                                          onChange={e => setMaquina(e.value)}
                                        />
                                      }
                                    </div>
                                  </div>
                                  <div className="flex flex-row w-full">
                                    <div className="flex w-full">
                                      <CustomSelect
                                        className="z-[9]"
                                        label="Turno"
                                        options={optsTurno}
                                        value={turno}
                                        onChange={e => setTurno(e.value)}
                                      />
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </>
                      }
                    </div>
                  </div>
                  {/*  Datos de la Captura  */}
                  <div className="w-full h-full relative pr-1.5 pb-1.5">
                    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                      {/* Card Header */}
                      <div className="w-full p-2 flex items-center  ">
                        <button
                          type="button"
                          disabled={empleado === null || scaningProduccion}
                          className={(scaningProduccion ? "pointer-events-none" : "") + " flex normal-button h-10 px-2 rounded-md total-center font-bold"}
                          onClick={e => { setScaningProduccion(true); scanProduccionInputRef.current?.focus() }}>
                          <div className={"relative " + (scaningProduccion ? "scan-icon" : "")}>
                            <ICONS.Qr size="28px" />
                          </div>
                          <p className="px-2">{scaningProduccion ? "Escanenado Producción..." : "Escanear Produccion"}</p>
                        </button>
                        {/* Invisible Input */}
                        <input
                          ref={scanProduccionInputRef}
                          className="visible opacity-0 h-0 w-0"
                          type="text"
                          autoFocus={true}
                          onBlur={e => setScaningProduccion(false)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleScanEtiqueta(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />

                      </div>
                      <div className="w-full h-full relative">
                        <div className="w-full h-full absolute flex-col overflow-y-scroll">
                          <div className="flex pt-2 px-4">
                            <table className="customTable">
                              <thead>
                                <tr className="h-8">
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
                                        className="hover:bg-rose-400 hover:text-white duration-200 h-7 w-7 total-center rounded-md"><ICONS.Trash size="16px" /></button>
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
        </div>
      </div>
      {/*  Contenedor de Modales */}
      <div className='modal absolute z-50 h-full w-full' ref={modalContainerRef}>
        {
          responseModalVisible &&
          <ResponseModal
            onClose={() => handleCloseModal(setResponseModalVisible)}
            response={response}
          />
        }
        {/*
          scanEmpleadoModalVisible &&
          <ScanModal
            title="Escanea tu gafete..."
            onClose={() => handleCloseModal(setScanEmpleadoModalVisible)}
            onScan={handleScanEmpleado}
          />*/
        }
        {/*
          scanEtiquetaModalVisible &&
          <ScanModal
            title="Escanea tu producción..."
            onClose={() => handleCloseModal(setScanEtiquetaModalVisible)}
            onScan={handleScanEtiqueta}
          />*/
        }
      </div>
    </>
  )
}
export default PaginaProduccion