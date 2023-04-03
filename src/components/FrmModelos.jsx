import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import Input from "./Input"
import SelectorMateriales from "./Materiales/SelectorMateriales"
import { useApp } from "../context/AppContext"
import { sleep } from "../constants/sleep"
import DynamicInput from "./DynamicInput"

const puntoObj = { valor: '', posicion: '' }

const FrmModelos = ({
  onCloseModal,
  fichaTecnica,
  isEdit,
  setIsEdit,
}) => {

  console.log(fichaTecnica)

  const { getMateriales, allMateriales } = useApp()
  const [saving, setSaving] = useState(false)
  const [fichaTecnicaObj, setFichaTecnicaObj] = useState(fichaTecnica)



  const validate = (values) => {
    const errors = {}
    return errors
  }

  const formik = useFormik({
    initialValues: fichaTecnica, //initobj,
    validate,
    onSubmit: values => {
      console.log('quiero guardar: ', fichaTecnicaObj)
    },
  });

  useEffect(() => {
    setFichaTecnicaObj(prev => ({ ...formik.values, materiales: [...prev.materiales], numeroPuntos: [...prev.numeroPuntos] }))
  }, [formik?.values])


  const handleSelectImage = (e) => {
    setFichaTecnicaObj(prev => ({ ...prev, fotografia: e.target.files[0] }))
  }

  const handleDeleteFibra = (e, indx) => {
    e.preventDefault()
    if (fichaTecnicaObj.fibras.length === 1) {
      setFichaTecnicaObj(prev => ({ ...prev, fibras: [{ ...fibraObj }] }))
      return
    }
    let newFibras = [...fichaTecnicaObj.fibras]
    newFibras.splice(indx, 1)
    setFichaTecnicaObj(prev => ({ ...prev, fibras: newFibras }))
  }

  const handleChangeFibra = (e, indx) => {
    let newFibras = [...fichaTecnicaObj.fibras]
    newFibras[indx][e.target.name] = e.target.type == 'number' ? Number(e.target.value) : e.target.value
    setFichaTecnicaObj(prev => ({ ...prev, fibras: newFibras }))
  }

  const handleFocusFibra = (e, indx) => {
    if (indx === fichaTecnicaObj.fibras.length - 1) {
      setFichaTecnicaObj(prev => ({ ...prev, fibras: [...prev.fibras, { ...fibraObj }] }))
    }
  }

  const handleDeletePunto = (e, indx) => {
    e.preventDefault()
    if (fichaTecnicaObj.numeroPuntos.length === 1) {
      setFichaTecnicaObj(prev => ({ ...prev, numeroPuntos: [{ ...puntoObj }] }))
      return
    }
    let newPuntos = [...fichaTecnicaObj.numeroPuntos]
    newPuntos.splice(indx, 1)
    setFichaTecnicaObj(prev => ({ ...prev, numeroPuntos: newPuntos }))
  }

  const hanldeChangePunto = (e, indx) => {
    let newPuntos = [...fichaTecnicaObj.numeroPuntos]
    newPuntos[indx][e.target.name] = Number(e.target.value)
    setFichaTecnicaObj(prev => ({ ...prev, numeroPuntos: newPuntos }))
  }

  const handleFocusPunto = (e, indx) => {
    if (indx === fichaTecnicaObj.numeroPuntos.length - 1) {
      setFichaTecnicaObj(prev => ({ ...prev, numeroPuntos: [...prev.numeroPuntos, { ...puntoObj }] }))
    }
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
            hebras: "",
            calibre: "",
            guiaHilos: "",
            proveedor: m.proveedor,
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

  const handleChange = (e) => {
    setFichaTecnicaObj(prev => ({ ...prev, [e.target.name]: e.target.value }))
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
      let Obj = {}
      fichaTecnicaObj[arrayName][0].keys().forEach(key => Obj[key] = '')
      setFichaTecnicaObj(prev => ({ ...prev, [arrayName]: [{ ...Obj }] }))
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
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
              }
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Modelo' : 'Nuevo Modelo xd'}
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
                <div className='flex flex-row w-full h-full p-2 total-center'>
                  <div className="flex relative w-full items-center justify-center foto text-center">
                    { /* Imagen del Modelo */}
                    {(toUrl(fichaTecnicaObj?.fotografia) !== null) && <img
                      className='object-cover foto'
                      src={toUrl(fichaTecnicaObj?.fotografia)}
                      alt='' />}
                    <input id='file' type="file" name='fotografia' accept='image/*' onChange={handleSelectImage} className='inputfile' />
                    <label
                      className='absolute -bottom-2 -right-1  p-2  normal-button rounded-full'
                      htmlFor='file' >
                      <ICONS.Upload style={{ color: 'white' }} size='18px' />
                    </label>
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
                      onChange={(e) => handleChange(e)}
                      value={fichaTecnicaObj.nombre}
                      name='nombre' label="Nombre del Modelo" type='text' />
                    <Input
                      onChange={(e) => handleChange(e)}
                      value={fichaTecnicaObj.nombrePrograma}
                      name='nombrePrograma' label="Nombre del Programa" type='text' />
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.cliente}
                        name='cliente' label="Cliente" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.talla}
                        name='talla' label="Talla" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.pesoPoliester}
                        name='pesoPoliester' label="Peso Poliester" type='number' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.pesoMelt}
                        name='pesoMelt' label="Peso Melt" type='number' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.pesoLurex}
                        name='pesoLurex' label="Peso Lurex" type='number' />
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
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.maquinaTejido}
                        name='maquinaTejido' label="Maquina Tejido" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.tipoMaquinaTejido}
                        name='tipoMaquinaTejido' label="Tipo Maquina Tejido" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.galga}
                        name='galga' label="Galga" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.velocidadTejido}
                        name='velocidadTejido' label="Velocidad" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.tiempoBajada}
                        name='tiempoBajada' label="Tiempo Bajada" type='text' />
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
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.maquinaPlancha}
                        name='maquinaPlancha' label="Maquina Plancha" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.velocidadPlancha}
                        name='velocidadPlancha' label="Velocidad" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={fichaTecnicaObj.temperaturaPlancha}
                        name='temperaturaPlancha' label="Temperatura" type='text' />
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
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
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
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
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
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
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