import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import Input from "./Input"
import SelectorMateriales from "./Materiales/SelectorMateriales"
import { useApp } from "../context/AppContext"
import { sleep } from "../constants/sleep"
import DynamicInput from "./DynamicInput"
import CustomSelect from "./CustomSelect"

const puntoObj = { valor: '', posicion: '' }

const FrmModelos = ({
  onCloseModal,
  fichaTecnica,
  isEdit,
  setIsEdit,
}) => {

  const {
    saveModelo,
    getModelos,
    getClientes,
    allClientes,
    getMaquinas,
    allMaquinas
  } = useApp()

  const [saving, setSaving] = useState(false)
  const [fichaTecnicaObj, setFichaTecnicaObj] = useState(fichaTecnica)

  const [clientesOptions, setClientesOptions] = useState([])
  const [maquinasTejidoOptions, setMaquinasTejidoOptions] = useState([])
  const [maquinasPlanchaOptions, setMaquinasPlanchaOptions] = useState([])


  const validate = values => {
    const errors = {};

    if (!values.nombre) {
      errors.nombre = 'Ingresa un nombre para el modelo';
    }
    if (!values.nombrePrograma) {
      errors.nombrePrograma = 'Ingresa el nombre del programa';
    }
    if (!values.idCliente) {
      errors.idCliente = 'Selecciona un cliente';
    } else if (values.idCliente === "Seleccione") {
      errors.idCliente = 'Selecciona un cliente';
    }
    if (!values.talla) {
      errors.talla = 'Ingresa la talla';
    }
    if (!values.idMaquinaTejido) {
      errors.idMaquinaTejido = 'Selecciona una maquina ';
    } else if (values.idMaquinaTejido === "Seleccione") {
      errors.idMaquinaTejido = 'Selecciona una maquina';
    }
    if (!values.tipoMaquinaTejido) {
      errors.tipoMaquinaTejido = 'Ingresa el tipo de la maquina';
    }
    if (!values.galga) {
      errors.galga = 'Ingresa la galga';
    }
    if (!values.idMaquinaPlancha) {
      errors.idMaquinaPlancha = 'Selecciona una maquina ';
    } else if (values.idMaquinaPlancha === "Seleccione") {
      errors.idMaquinaPlancha = 'Selecciona una maquina';
    }



    return errors;
  };

  const formik = useFormik({
    initialValues: fichaTecnica, 
    validate,
    onSubmit: values => {
      handleSaveModelo()
    },
  });

  async function loadOptions() {
    await getClientes()
    await getMaquinas()
  }

  useEffect(() => {
    loadOptions()
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
        newMaquinasTejidoOptions.push({ value: m.idMaquina.toString(), label: 'Línea: '+m.linea + ' Número: ' + m.numero + ' Marca: ' + m.marca })
      else if (m.departamento === 'Plancha')
        newMaquinasPlanchaOptions.push({ value: m.idMaquina.toString(), label: m.numero + ' ' + m.linea + ' ' + m.marca })
    })

    setClientesOptions(newClientesOptions)
    setMaquinasTejidoOptions(newMaquinasTejidoOptions)
    setMaquinasPlanchaOptions(newMaquinasPlanchaOptions)

  }, [allClientes, allMaquinas])

  useEffect(() => {
    setFichaTecnicaObj(prev => (
      {
        ...formik?.values,
        fotografia: prev.fotografia,
        archivoFichaTecnica: prev.archivoFichaTecnica,
        archivoPrograma: prev.archivoPrograma,
        materiales: [...prev.materiales],
        numeroPuntos: [...prev.numeroPuntos],
        economisadores: [...prev.economisadores]
      }
    ))
  }, [formik?.values]) 

  const handleSaveModelo = async () => {
    console.log(fichaTecnicaObj)
    setSaving(true)
    await saveModelo(fichaTecnicaObj, isEdit)
    await getModelos()
    onCloseModal()
    setSaving(false)
  }

  const handleSelectFile = (e) => {
    setFichaTecnicaObj(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
  }

  const onPassMateriales = (availableMateriales) => {
    let newMateriales = []
    availableMateriales.forEach(m => {
      if (m.count > 0) {
        for (let i = 0; i < m.count; i++) {
          newMateriales.push({
            peso: "",
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
    setFichaTecnicaObj(prev => ({ ...prev, materiales: [...prev.materiales, ...newMateriales] }))
  }

  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
  }

  const handleSetRow = (event, indx, arrayName) => {
    let newArray = [...fichaTecnicaObj[arrayName]]
    newArray[indx][event.target.name] = event.target.value
    setFichaTecnicaObj(prev => ({ ...prev, [arrayName]: newArray }))
  }

  const handleRowFocus = (indx, arrayName) => {
    if (indx === fichaTecnicaObj[arrayName].length - 1) {
      let Obj = {}
      Object.keys(fichaTecnicaObj[arrayName][0]).forEach(key => Obj[key] = '')
      setFichaTecnicaObj(prev => ({ ...prev, [arrayName]: [...prev[arrayName], { ...Obj }] }))
    }
  }

  const handleDeleteRow = (indx, arrayName) => {
    if (fichaTecnicaObj[arrayName].length === 1) {
      return
    }
    let newArray = [...fichaTecnicaObj[arrayName]]
    newArray.splice(indx, 1)
    setFichaTecnicaObj(prev => ({ ...prev, [arrayName]: newArray }))
  }

  return (
    <div className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col'>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10 ">
              {isEdit
                ? <ICONS.Edit className='mt-1 mr-2' size='24px' style={{ color: '#115e59' }} />
                : <ICONS.Plus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
              }
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Modelo' : 'Nuevo Modelo'}
              </p>
              <div className="flex flex-row absolute right-0">
                <input
                  disabled={saving}
                  className='py-1 w-auto px-5 text-white normal-button rounded-lg'
                  type="submit"
                  value={isEdit ? "GUARDAR" : "AGREGAR"}
                  form="frmModelos"
                />
              </div>
              <button
                className='total-center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                onClick={onCloseModal}
              >
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
            </div>
          </div>
          <div id="modal-body" className="flex w-full h-full ">
            <form
              id='frmModelos'
              className='flex flex-col h-full w-full relative overflow-y-scroll'
              onSubmit={formik.handleSubmit}>
              <div className="absolute w-full flex flex-col  px-4">
                <div className='flex flex-row w-full h-full p-2 items-center justify-around'>
                  <div className="flex relative w-full items-center justify-center foto text-center">
                    { /* Imagen del Modelo */}
                    {(toUrl(fichaTecnicaObj?.fotografia) !== null) && <img
                      className='object-cover foto'
                      src={toUrl(fichaTecnicaObj?.fotografia)}
                      alt='' />}
                    <input id='file' type="file" name='fotografia' accept='image/*' onChange={handleSelectFile} className='inputfile' />
                    <label
                      className='absolute -bottom-2 -right-1 p-2 normal-button rounded-full'
                      htmlFor='file' >
                      <ICONS.Upload style={{ color: 'white' }} size='18px' />
                    </label>
                  </div>
                  <div className="flex flex-col relative text-center">
                    { /* Ficha tecnica */}
                    <p className="text-start font-medium text-teal-800">Ficha Técnica</p>
                    <div className="flex">
                      <div className="flex w-28 bg-gray-200 rounded-l-lg">
                        {(toUrl(fichaTecnicaObj?.archivoFichaTecnica) !== null) &&
                          <a
                            className="w-full normal-button rounded-l-lg total-center"
                            target="_blank"
                            href={toUrl(fichaTecnicaObj?.archivoFichaTecnica)}>
                            <ICONS.PDF size="20px" />
                          </a>}
                        <input id='FichaFile' type="file" name='archivoFichaTecnica' onChange={handleSelectFile} className='inputfile' />
                      </div>
                      <label
                        className='p-2 normal-button  rounded-r-lg'
                        htmlFor='FichaFile' >
                        <ICONS.Upload style={{ color: 'white' }} size='18px' />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col relative text-center">
                    { /* Archivo del Programa */}
                    <p className="text-start font-medium text-teal-800">Archivo del Programa</p>
                    <div className="flex">
                      <div className="flex w-28 bg-gray-200 rounded-l-lg">
                        {(toUrl(fichaTecnicaObj?.archivoPrograma) !== null) &&
                          <a
                            className="w-full normal-button rounded-l-lg total-center"
                            target="_blank"
                            href={toUrl(fichaTecnicaObj?.archivoPrograma)}>
                            <ICONS.File size="20px" />
                          </a>}
                        <input id='ProgramaFile' type="file" name='archivoPrograma' onChange={handleSelectFile} className='inputfile' />
                      </div>
                      <label
                        className='p-2 normal-button  rounded-r-lg'
                        htmlFor='ProgramaFile' >
                        <ICONS.Upload style={{ color: 'white' }} size='18px' />
                      </label>
                    </div>
                  </div>

                </div>
                <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                  <div className="absolute w-full total-center -top-3">
                    <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                      DATOS DEL MODELO
                    </div>
                  </div>
                  <div className='flex flex-row w-full'>
                    <Input
                      label='Nombre del modelo' type='text' name='nombre' value={formik.values.nombre}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null}
                    />
                    <Input
                      label='Nombre del programa' type='text' name='nombrePrograma' value={formik.values.nombrePrograma}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.nombrePrograma && formik.touched.nombrePrograma ? formik.errors.nombrePrograma : null}
                    />
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-row w-full">

                      <CustomSelect
                        name='idCliente'
                        className='input z-[100]'
                        onChange={value => formik.setFieldValue('idCliente', value.value)}
                        value={formik.values.idCliente}
                        onBlur={formik.handleBlur}
                        options={clientesOptions}
                        label='Cliente'
                        errores={formik.errors.idCliente && formik.touched.idCliente ? formik.errors.idCliente : null}
                      />
                      <Input
                        label='Talla' type='text' name='talla' value={formik.values.talla}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.talla && formik.touched.talla ? formik.errors.talla : null}
                      />
                    </div>
                    <div className="flex flex-row w-full">

                      <Input
                        label='Peso poliester' type='text' name='pesoPoliester' value={formik.values.pesoPoliester}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.pesoPoliester && formik.touched.pesoPoliester ? formik.errors.pesoPoliester : null}
                      />
                      <Input
                        label='Peso melting' type='text' name='pesoMelt' value={formik.values.pesoMelt}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.pesoMelt && formik.touched.pesoMelt ? formik.errors.pesoMelt : null}
                      />
                      <Input
                        label='Peso lurex' type='text' name='pesoLurex' value={formik.values.pesoLurex}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.pesoLurex && formik.touched.pesoLurex ? formik.errors.pesoLurex : null}
                      />
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
                        name='idMaquinaTejido'
                        className='input z-[90]'
                        onChange={value => formik.setFieldValue('idMaquinaTejido', value.value)}
                        value={formik.values.idMaquinaTejido}
                        onBlur={formik.handleBlur}
                        options={maquinasTejidoOptions}
                        label='Máquina Tejido'
                        errores={formik.errors.idMaquinaTejido && formik.touched.idMaquinaTejido ? formik.errors.idMaquinaTejido : null}
                      />
                      <Input
                        label='Tipo Maquina Tejido' type='text' name='tipoMaquinaTejido' value={formik.values.tipoMaquinaTejido}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.tipoMaquinaTejido && formik.touched.tipoMaquinaTejido ? formik.errors.tipoMaquinaTejido : null}
                      />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        label='Galga' type='text' name='galga' value={formik.values.galga}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.galga && formik.touched.galga ? formik.errors.galga : null}
                      />
                      <Input
                        label='Velocidad' type='text' name='velocidadTejido' value={formik.values.velocidadTejido}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.velocidadTejido && formik.touched.velocidadTejido ? formik.errors.velocidadTejido : null}
                      />
                      <Input
                        label='Tiempo de bajada' type='text' name='tiempoBajada' value={formik.values.tiempoBajada}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.tiempoBajada && formik.touched.tiempoBajada ? formik.errors.tiempoBajada : null}
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
                        name='idMaquinaPlancha'
                        className='input z-[80]'
                        onChange={value => formik.setFieldValue('idMaquinaPlancha', value.value)}
                        value={formik?.values?.idMaquinaPlancha}
                        onBlur={formik.handleBlur}
                        options={maquinasPlanchaOptions}
                        label='Máquina de Plancha'
                        errores={formik.errors.idMaquinaPlancha && formik.touched.idMaquinaPlancha ? formik.errors.idMaquinaPlancha : null}
                      />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        label='Velocidad' type='text' name='velocidadPlancha' value={formik.values.velocidadPlancha}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.velocidadPlancha && formik.touched.velocidadPlancha ? formik.errors.velocidadPlancha : null}
                      />
                      <Input
                        label='Temperatura' type='text' name='temperaturaPlancha' value={formik.values.temperaturaPlancha}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.temperaturaPlancha && formik.touched.temperaturaPlancha ? formik.errors.temperaturaPlancha : null}
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
                  <div className="flex flex-row w-full">
                    <SelectorMateriales
                      fichaTecnicaObj={fichaTecnicaObj}
                      setFichaTecnicaObj={setFichaTecnicaObj}
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
                        <DynamicInput
                          arrayName='numeroPuntos'
                          columns={[
                            { name: 'Numero', atr: 'valor' },
                            { name: 'Puntos', atr: 'posicion' }
                          ]}
                          elements={fichaTecnicaObj.numeroPuntos}
                          setElements={handleSetRow}
                          handleFocus={handleRowFocus}
                          handleDeleteRow={handleDeleteRow}
                        />
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
                        <DynamicInput
                          arrayName='economisadores'
                          columns={[
                            { name: 'Valor', atr: 'valor' },
                            { name: 'Pos', atr: 'posicion' }
                          ]}
                          elements={fichaTecnicaObj.economisadores}
                          setElements={handleSetRow}
                          handleFocus={handleRowFocus}
                          handleDeleteRow={handleDeleteRow}
                        />
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
                        <DynamicInput
                          arrayName='jalones'
                          columns={[
                            { name: 'Valor', atr: 'valor' },
                            { name: 'Pos', atr: 'posicion' }
                          ]}
                          elements={fichaTecnicaObj.jalones}
                          setElements={handleSetRow}
                          handleFocus={handleRowFocus}
                          handleDeleteRow={handleDeleteRow}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FrmModelos