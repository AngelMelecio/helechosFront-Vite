import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import Input from "./Input"
import SelectorMateriales from "./Materiales/SelectorMateriales"
import { useApp } from "../context/AppContext"
import { sleep } from "../constants/functions"
import DynamicInput from "./DynamicInput"
import CustomSelect from "./CustomSelect"
import SelectorClientes from './Materiales/SelectorClientes'
import { useRef } from "react"
import FichasModal from "./FichasModal"
import ModelosFormik from "./Modelos/ModelosFormik"
import PesosList from "./Modelos/PesosList"



const puntoObj = { valor: '', posicion: '' }

const FrmModelos = ({
  onCloseModal,
  Modelo,
  isEdit,
  setIsEdit,
  initFichaObj
}) => {

  const {
    saveModelo,
    getModelos,
    getFichas,
    saveFicha,
    deleteFicha,
    getClientes,
    allClientes,
    getMaquinas,
    allMaquinas,
    getFichaMateriales,
    saveFichaMateriales,
  } = useApp()

  const saveFichaModalContainerRef = useRef()

  const [saving, setSaving] = useState(false)
  const [theresChanges, setTheresChanges] = useState(false)
  const [pendingCreation, setPendingCreation] = useState(false)

  const [selectedFichaIndx, setSelectedFichaIndx] = useState(null)
  const [fichasModeloList, setFichasModeloList] = useState([])

  const [clientesOptions, setClientesOptions] = useState([])
  const [maquinasTejidoOptions, setMaquinasTejidoOptions] = useState([])
  const [maquinasPlanchaOptions, setMaquinasPlanchaOptions] = useState([])

  const [saveFichaModalVisible, setSaveFichaModalVisible] = useState(false)
  const [deleteFichaModalVisible, setDeleteFichaModalVisible] = useState(false)
  const [temporalIndx, setTemporalIndx] = useState(null)
  const [deleteSelection, setDeleteSelection] = useState(null)

  const handleSaveFicha = async () => {
    let values = {
      ...fichaFormik.values,
      modelo: Modelo.idModelo,
      jalones: JSON.stringify(fichaFormik.values.jalones),
      economisadores: JSON.stringify(fichaFormik.values.economisadores),
      numeroPuntos: JSON.stringify(fichaFormik.values.numeroPuntos)
    }
    if (!values.idFichaTecnica) values.fechaCreacion = new Date().toISOString().slice(0, 10)

    let newMateriales = fichaFormik.values.materiales.map(m => ({
      idMaterial: m.idMaterial,
      guiaHilos: m.guiaHilos,
      hebras: m.hebras,
      peso: Number(m.peso),
    }))
    //console.log( values )
    await saveFicha(values, newMateriales, values.idFichaTecnica ? true : false)
    loadFichas()
    setTheresChanges(false)
  }

  const validate = values => {
    const errors = {};

    if (!values.talla) {
      errors.talla = 'Ingresa la talla';
    }
    if (!values.maquinaTejido) {
      errors.maquinaTejido = 'Selecciona una maquina ';
    } else if (values.maquinaTejido === "Seleccione") {
      errors.maquinaTejido = 'Selecciona una maquina';
    }
    if (!values.tipoMaquinaTejido) {
      errors.tipoMaquinaTejido = 'Ingresa el tipo de la maquina';
    }
    if (!values.galga) {
      errors.galga = 'Ingresa la galga';
    }
    if (!values.maquinaPlancha) {
      errors.maquinaPlancha = 'Selecciona una maquina ';
    } else if (values.maquinaPlancha === "Seleccione") {
      errors.maquinaPlancha = 'Selecciona una maquina';
    }
    return errors;
  };

  const fichaFormik = useFormik({
    initialValues: initFichaObj,
    validate,
    onSubmit: values => {
      handleSaveFicha()
    },
  });

  const handleGetFichaMateriales = async (idFicha) => {
    let materiales = await getFichaMateriales(idFicha)
    fichaFormik.setFieldValue('materiales', materiales)
  }

  async function loadOptions() {
    await getClientes()
    await getMaquinas()
  }

  async function loadFichas() {
    if (!Modelo.idModelo) return
    let fichas = await getFichas(Modelo.idModelo)
    if (fichas)
      setFichasModeloList(fichas)
  }

  useEffect(() => {
    loadFichas()
    loadOptions()
    setTheresChanges(false)
  }, [])

  useEffect(() => {
    let newClientesOptions = [{ value: 'Seleccione', label: 'Seleccione' }]
    let newMaquinasTejidoOptions = [{ value: 'Seleccione', label: 'Seleccione' }]
    let newMaquinasPlanchaOptions = [{ value: 'Seleccione', label: 'Seleccione' }]

    allClientes.forEach(c => {
      newClientesOptions.push({ value: c.idCliente.toString(), label: c.nombre })
    })

    allMaquinas.forEach(m => {
      if (m.departamento === 'Tejido')
        newMaquinasTejidoOptions.push({ value: m.idMaquina.toString(), label: 'Línea: ' + m.linea + ' Número: ' + m.numero + ' Marca: ' + m.marca })
      else if (m.departamento === 'Plancha')
        newMaquinasPlanchaOptions.push({ value: m.idMaquina.toString(), label: 'Línea: ' + m.linea + ' Número: ' + m.numero + ' Marca: ' + m.marca })
    })

    setClientesOptions(newClientesOptions)
    setMaquinasTejidoOptions(newMaquinasTejidoOptions)
    setMaquinasPlanchaOptions(newMaquinasPlanchaOptions)

  }, [allClientes, allMaquinas])

  const handleSelectFile = (e) => {
    fichaFormik.setValues(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
    setTheresChanges(true)
  }

  const onPassMateriales = (availableMateriales) => {
    let newMateriales = []
    availableMateriales.forEach(m => {
      if (m.count > 0) {
        for (let i = 0; i < m.count; i++) {
          newMateriales.push({
            peso: 0,
            tipo: m.tipo,
            color: m.color,
            codigoColor: m.codigoColor,
            tenida: m.tenida,
            hebras: "",
            calibre: m.calibre,
            guiaHilos: "",
            nombreProveedor: m.nombreProveedor,
            idMaterial: m.idMaterial
          })
        }
      }
    })
    fichaFormik.setValues(prev => ({ ...prev, materiales: [...prev.materiales, ...newMateriales] }))
    setTheresChanges(true)
  }

  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
  }

  const handleSetRow = (event, indx, arrayName) => {
    let newArray = [...fichaFormik.values[arrayName]]
    newArray[indx][event.target.name] = event.target.value
    fichaFormik.setValues(prev => ({ ...prev, [arrayName]: newArray }))
    setTheresChanges(true)
  }

  const handleRowFocus = (indx, arrayName) => {
    if (indx === fichaFormik.values[arrayName].length - 1) {
      let Obj = {}
      Object.keys(fichaFormik.values[arrayName][0]).forEach(key => Obj[key] = '')
      fichaFormik.setValues(prev => ({ ...prev, [arrayName]: [...prev[arrayName], { ...Obj }] }))
    }
  }

  const handleDeleteRow = (indx, arrayName) => {
    if (fichaFormik.values[arrayName].length === 1) {
      return
    }
    let newArray = [...fichaFormik.values[arrayName]]
    newArray.splice(indx, 1)
    fichaFormik.setValues(prev => ({ ...prev, [arrayName]: newArray }))
    setTheresChanges(true)
  }

  const handleSelectFicha = (indx) => {
    if (indx === selectedFichaIndx) return
    if (theresChanges) {
      setTemporalIndx(indx)
      handleOpenModal(setSaveFichaModalVisible)
      return
    }
    selectFicha(indx)
    handleGetFichaMateriales(fichasModeloList[indx].idFichaTecnica)
  }

  const selectFicha = (indx) => {
    setSelectedFichaIndx(indx)
    fichaFormik.setValues(fichasModeloList[indx])
  }

  const handleAddFicha = () => {
    if (theresChanges) {
      setPendingCreation(true)
      handleOpenModal(setSaveFichaModalVisible)
      return
    }
    AddFicha()
  }

  const AddFicha = () => {
    fichaFormik.setValues(initFichaObj)
    setSelectedFichaIndx(fichasModeloList?.length)
    if (fichasModeloList.length === 0) {
      setFichasModeloList([initFichaObj])
    }
    else
      setFichasModeloList(prev => ([
        ...prev,
        { ...initFichaObj }
      ]))
    setPendingCreation(false)
  }

  const handleDeleteFicha = async (indx) => {
    if (fichasModeloList[indx].idFichaTecnica) {
      await deleteFicha(fichasModeloList[indx].idFichaTecnica)
      loadFichas()
    }
    else {
      let newFichas = [...fichasModeloList]
      newFichas.splice(indx, 1)
      setFichasModeloList(newFichas)
    }
    setSelectedFichaIndx(null)
    setTheresChanges(false)
  }

  const handleCopyFicha = (indx) => {
    fichaFormik.setValues({ ...fichasModeloList[indx], idFichaTecnica: undefined })
    handleGetFichaMateriales(fichasModeloList[indx].idFichaTecnica)
    setSelectedFichaIndx(fichasModeloList.length)
    let copy = { ...fichasModeloList[indx] }

    copy.idFichaTecnica = undefined
    copy.nombre += ' Copia'

    setFichasModeloList(prev => [
      ...prev,
      copy
    ])
  }

  const handleFichaChange = (e) => {
    fichaFormik.setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setTheresChanges(true)
  }

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    saveFichaModalContainerRef.current.classList.add('visible')
  }

  const handleCloseModal = async (setState) => {
    saveFichaModalContainerRef.current.classList.remove('visible')
    await sleep(150)
    setState(false)
  }

  return (
    <div className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-full bg-white shadow-xl'>
        <div className='w-full flex h-full flex-col'>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10 ">
              <button
                className='total-center neutral-button p-1 text-white  absolute left-0 rounded-lg  '
                onClick={onCloseModal}>
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
              <div className="total-center font-semibold text-2xl text-teal-800">
                Nuevo Modelo
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <ModelosFormik
              Modelo={Modelo}
              isEdit={isEdit}
              clientesOptions={clientesOptions}
              onCloseModal={onCloseModal}
            />
            <div id="modal-body" className="flex w-full h-full ">
              <div className="flex flex-col w-72 h-full " >
                <div className="flex w-full px-2 py-4 items-center border-b-2 relative">
                  <p className="font-medium text-teal-800 text-lg pl-5">Fichas</p>
                  <button
                    disabled={!Modelo.idModelo}
                    onClick={handleAddFicha}
                    className="normal-button total-center h-6 w-6 rounded-md absolute right-2" type="button">
                    <ICONS.Plus size="13px" />
                  </button>
                </div>
                <div className="flex flex-col w-full h-full relative  ">
                  <div className="absolute flex flex-col overflow-y-scroll w-full h-full">
                    {
                      // Fichas Tecnicas
                      fichasModeloList?.map((ficha, indx) =>
                        <div
                          key={'Fich' + indx}
                          type="button"
                          onClick={() => handleSelectFicha(indx)}
                          className={`${indx === selectedFichaIndx ? "bg-gray-200 " : "hover:bg-gray-100 duration-200 "} 
                            flex w-full p-3 items-center relative border-b-2 cursor-pointer` }>

                          <p className="pl-5 font-medium">{ficha.nombre !== '' ? ficha.nombre : 'Nueva Ficha'}</p>
                          { indx === selectedFichaIndx && <>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleOpenModal(setDeleteFichaModalVisible);
                                setDeleteSelection(indx)
                              }}
                              type="button"
                              className="  w-6 h-6 trash-button rounded-md total-center absolute right-8"> <ICONS.Trash /> </button>
                            <button
                              disabled={!ficha.idFichaTecnica || theresChanges}
                              onClick={e => {
                                e.stopPropagation();
                                handleCopyFicha(indx)
                              }}
                              type="button"
                              className="  w-6 h-6 normal-button rounded-md total-center absolute right-1"> <ICONS.Copy /> </button>
                          </>}
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>

              {selectedFichaIndx !== null ?
                <form
                  id='frmFichas' onSubmit={fichaFormik.handleSubmit}
                  className='flex flex-col h-full w-full relative overflow-y-scroll'>
                  <div className="absolute w-full flex flex-col p-4">
                    <div className='flex flex-row w-full h-full px-2 items-center justify-end'>
                      <input
                        disabled={!theresChanges}
                        className='py-1 px-5 text-white normal-button self-end rounded-lg'
                        type="submit"
                        value={"GUARDAR FICHA"}
                        form="frmFichas"
                      />
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          INFORMACIÓN DE LA FICHA
                        </div>
                      </div>
                      <div className="w-full total-center">
                        <div className="flex relative w-full items-center justify-center foto text-center">
                          { /* Imagen del Modelo */}
                          {(toUrl(fichaFormik.values?.fotografia) !== null) && <img
                            className='object-cover foto'
                            src={toUrl(fichaFormik.values?.fotografia)}
                            alt='' />}
                          <input id='file' type="file" name='fotografia' accept='image/*'
                            onChange={handleSelectFile} className='inputfile' />
                          <label
                            className='absolute -bottom-2 -right-1 p-2 normal-button rounded-full'
                            htmlFor='file' >
                            <ICONS.Upload style={{ color: 'white' }} size='18px' />
                          </label>
                        </div>
                      </div>
                      <div className='flex flex-row w-full'>
                        <Input
                          label='Nombre de la Ficha' type='text' name='nombre' value={fichaFormik.values.nombre}
                          onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                          errores={fichaFormik.errors.nombre && fichaFormik.touched.nombre ? fichaFormik.errors.nombre : null}
                        />
                      </div>
                      <div className="flex flex-row w-full">
                        <Input
                          label='Talla' type='text' name='talla' value={fichaFormik.values.talla}
                          onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                          errores={fichaFormik.errors.talla && fichaFormik.touched.talla ? fichaFormik.errors.talla : null}
                        />

                        <div className="flex flex-col w-full justify-end mx-2 relative text-center">
                          { /* Archivo del Programa */}
                          <p className="text-start font-medium text-teal-800">Archivo del Programa</p>
                          <div className="flex">
                            <div className="flex w-full bg-gray-200 rounded-l-lg">
                              {(toUrl(fichaFormik.values?.archivoPrograma) !== null) &&
                                <a
                                  className="w-full normal-button rounded-l-lg total-center"
                                  target="_blank"
                                  href={toUrl(fichaFormik.values?.archivoPrograma)}>
                                  <p className="px-3">{fichaFormik.values?.archivoPrograma?.name}</p>
                                  <ICONS.File size="20px" />
                                </a>}
                              <input
                                id='ProgramaFile'
                                type="file"
                                name='archivoPrograma' onChange={handleSelectFile} className='inputfile' />
                            </div>
                            <label
                              className='p-2 normal-button w-9 rounded-r-lg'
                              htmlFor='ProgramaFile' >
                              <ICONS.Upload style={{ color: 'white' }} size='18px' />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS DEL TEJIDO
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="flex flex-row w-full">
                          <CustomSelect
                            name='maquinaTejido'
                            className='input z-[90]'
                            onChange={value => { fichaFormik.setFieldValue('maquinaTejido', value.value); setTheresChanges(true) }}
                            value={fichaFormik.values.maquinaTejido}
                            onBlur={fichaFormik.handleBlur}
                            options={maquinasTejidoOptions}
                            label='Máquina Tejido'
                            errores={fichaFormik.errors.maquinaTejido && fichaFormik.touched.maquinaTejido ? fichaFormik.errors.maquinaTejido : null}
                          />
                          <Input
                            label='Tipo Maquina Tejido' type='text' name='tipoMaquinaTejido' value={fichaFormik.values.tipoMaquinaTejido}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.tipoMaquinaTejido && fichaFormik.touched.tipoMaquinaTejido ? fichaFormik.errors.tipoMaquinaTejido : null}
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <Input
                            label='Galga' type='text' name='galga' value={fichaFormik.values.galga}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.galga && fichaFormik.touched.galga ? fichaFormik.errors.galga : null}
                          />
                          <Input
                            label='Velocidad' type='text' name='velocidadTejido' value={fichaFormik.values.velocidadTejido}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.velocidadTejido && fichaFormik.touched.velocidadTejido ? fichaFormik.errors.velocidadTejido : null}
                          />
                          <Input
                            label='Tiempo de bajada' type='text' name='tiempoBajada' value={fichaFormik.values.tiempoBajada}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.tiempoBajada && fichaFormik.touched.tiempoBajada ? fichaFormik.errors.tiempoBajada : null}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS DE PLANCHA
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <div className="flex flex-row w-full">
                          <CustomSelect
                            name='maquinaPlancha'
                            className='input z-[80]'
                            onChange={value => { fichaFormik.setFieldValue('maquinaPlancha', value.value); setTheresChanges(true) }}
                            value={fichaFormik?.values?.maquinaPlancha}
                            onBlur={fichaFormik.handleBlur}
                            options={maquinasPlanchaOptions}
                            label='Máquina de Plancha'
                            errores={fichaFormik.errors.maquinaPlancha && fichaFormik.touched.maquinaPlancha ? fichaFormik.errors.maquinaPlancha : null}
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <Input
                            label='Velocidad' type='text' name='velocidadPlancha' value={fichaFormik.values.velocidadPlancha}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.velocidadPlancha && fichaFormik.touched.velocidadPlancha ? fichaFormik.errors.velocidadPlancha : null}
                          />
                          <Input
                            label='Temperatura' type='text' name='temperaturaPlancha' value={fichaFormik.values.temperaturaPlancha}
                            onChange={handleFichaChange} onBlur={fichaFormik.handleBlur}
                            errores={fichaFormik.errors.temperaturaPlancha && fichaFormik.touched.temperaturaPlancha ? fichaFormik.errors.temperaturaPlancha : null}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS DE LOS HILOS
                        </div>
                      </div>
                      <PesosList
                        materiales={fichaFormik?.values?.materiales}
                      />
                      <div className="flex flex-row w-full">
                        <SelectorMateriales
                          fichaTecnicaObj={fichaFormik}
                          onPassMateriales={onPassMateriales}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            NUMERO PUNTOS
                          </div>
                        </div>
                        <div className="flex flex-row h-80  justify-around">
                          <div className="overflow-y-scroll">
                            {<DynamicInput
                              arrayName='numeroPuntos'
                              columns={[
                                { name: 'Numero', atr: 'valor' },
                                { name: 'Puntos', atr: 'posicion' }
                              ]}
                              elements={fichaFormik?.values?.numeroPuntos}
                              setElements={handleSetRow}
                              handleFocus={handleRowFocus}
                              handleDeleteRow={handleDeleteRow}
                            />}
                          </div>
                        </div>
                      </div>
                      <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            ECONOMISADORES
                          </div>
                        </div>
                        <div className="flex flex-row h-80  justify-around">
                          <div className="overflow-y-scroll">
                            {<DynamicInput
                              arrayName='economisadores'
                              columns={[
                                { name: 'Valor', atr: 'valor' },
                                { name: 'Pos', atr: 'posicion' }
                              ]}
                              elements={fichaFormik?.values?.economisadores}
                              setElements={handleSetRow}
                              handleFocus={handleRowFocus}
                              handleDeleteRow={handleDeleteRow}
                            />}
                          </div>
                        </div>
                      </div>
                      <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            JALONES
                          </div>
                        </div>
                        <div className="flex flex-row h-80  justify-around">
                          <div className="overflow-y-scroll">
                            {<DynamicInput
                              arrayName='jalones'
                              columns={[
                                { name: 'Valor', atr: 'valor' },
                                { name: 'Pos', atr: 'posicion' }
                              ]}
                              elements={fichaFormik?.values?.jalones}
                              setElements={handleSetRow}
                              handleFocus={handleRowFocus}
                              handleDeleteRow={handleDeleteRow}
                            />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                : <div className="w-full total-center bg-gray-200">
                  <p className="italic font-semibold text-gray-600">
                    Selecciona o crea una ficha ...
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={saveFichaModalContainerRef}>
        {saveFichaModalVisible &&
          <FichasModal
            onCancel={() => {
              handleCloseModal(setSaveFichaModalVisible)
              handleSaveFicha()
              if (pendingCreation) {
                AddFicha(); return;
              }
              selectFicha(temporalIndx)
            }}
            onDelete={() => {
              handleCloseModal(setSaveFichaModalVisible)
              setTheresChanges(false)
              if (pendingCreation) {
                AddFicha(); return;
              }
              selectFicha(temporalIndx)
            }}
            cancelText="Guardar"
            deleteText="Descartar"
            message="Hay cambios sin guardar"
          />
        }
        {deleteFichaModalVisible &&
          <FichasModal
            onCancel={() => handleCloseModal(setDeleteFichaModalVisible)}
            onDelete={() => {
              handleDeleteFicha(deleteSelection);
              handleCloseModal(setDeleteFichaModalVisible)
            }}
            cancelText="Cancelar"
            deleteText="Eliminar"
            message="Se eliminará la ficha de forma permanente"
          />

        }
      </div>

    </div>
  )
}
export default FrmModelos