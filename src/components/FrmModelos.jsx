import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import Input from "./Input"

const puntoObj = {
  no: '',
  numeroPuntos: ''
}

const fibraObj = {
  guiaHilos: '',
  fibras: '',
  calibre: '',
  proveedor: '',
  color: '',
  hebras: '',
  otro: ''
}

const initFichaTecnicaObj = {
  nombre: '',
  nombrePrograma: '',
  fotografia: '',
  cliente: '',
  talla: '',

  maquinaTejido: '',
  tipoMaquinaTejido: '',
  galga: '',
  velocidadTejido: '',
  tiempoBajada: '',

  maquinaPlancha: '',
  velocidadPlancha: '',
  temperaturaPlancha: '',

  numeroPuntos: [{ ...puntoObj }],
  jalones: [],
  economisadores: [],
  otros: '',

  pesoPoliester: '',
  pesoMelt: '',
  pesoLurex: '',

  fibras: [{ ...fibraObj }],
}

const dumyFichaNormalAtr = {
  nombre: 'ROCUP-24-25-08-22',
  nombrePrograma: 'S19120122',
  fotografia: '',
  cliente: 'Flexi',
  talla: '27',

  maquinaTejido: '',
  tipoMaquina: 'SF3-365-FL',
  galga: '14',
  velocidadTejido: '',
  tiempoBajada: '65',

  maquinaPlancha: 'ESP-32',
  velocidadPlancha: '',
  temperaturaPlancha: '',

  numeroPuntos: [
    { no: 1, puntos: 123 },
    { no: 2, puntos: 232 },
    { no: 3, puntos: 321 },
  ],

  jalones: [],
  economisadores: [],
  otros: '',

  pesoPoliester: '12',
  pesoMelt: '546',
  pesoLurex: '648',
}



const FrmModelos = ({
  onCloseModal,
  fichaTecnica,
  isEdit,
  setIsEdit,
}) => {

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
    setFichaTecnicaObj(prev => ({ ...formik.values, fibras: [...prev.fibras], numeroPuntos: [...prev.numeroPuntos] }))
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
      console.log(fichaTecnicaObj)
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
  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
  }

  const handleChange = (e) => {
    setFichaTecnicaObj( prev => ({...prev, [e.target.name]:e.target.value }) )
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
                      value={ fichaTecnicaObj.nombre }
                      name='nombre' label="Nombre del Modelo" type='text' />
                    <Input
                      onChange={(e) => handleChange(e)}
                      value={ fichaTecnicaObj.nombrePrograma }
                      name='nombrePrograma' label="Nombre del Programa" type='text' />
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.cliente }
                        name='cliente' label="Cliente" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.talla }
                        name='talla' label="Talla" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.pesoPoliester }
                        name='pesoPoliester' label="Peso Poliester" type='number' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.pesoMelt }
                        name='pesoMelt' label="Peso Melt" type='number' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.pesoLurex }
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
                        value={ fichaTecnicaObj.maquinaTejido }
                        name='maquinaTejido' label="Maquina Tejido" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.tipoMaquinaTejido }
                        name='tipoMaquinaTejido' label="Tipo Maquina Tejido" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.galga }
                        name='galga' label="Galga" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.velocidadTejido }
                        name='velocidadTejido' label="Velocidad" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.tiempoBajada }
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
                        value={ fichaTecnicaObj.maquinaPlancha }
                        name='maquinaPlancha' label="Maquina Plancha" type='text' />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.velocidadPlancha }
                        name='velocidadPlancha' label="Velocidad" type='text' />
                      <Input
                        onChange={(e) => handleChange(e)}
                        value={ fichaTecnicaObj.temperaturaPlancha }
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
                    <div className='flex flex-col w-1/4 pr-2'>
                      <table>
                        <thead>
                          <tr className="font-medium text-teal-800">
                            <th>
                              NO.
                            </th>
                            <th>
                              PUNTOS
                            </th>
                            <th>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            fichaTecnicaObj?.numeroPuntos?.map((p, i) =>
                              <tr className="array-row" key={'P' + i} >
                                <td>
                                  <input
                                    name='no'
                                    onFocus={(e) => handleFocusPunto(e, i)}
                                    value={p.no}
                                    onChange={e => hanldeChangePunto(e, i)}
                                    className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                    type="number" />
                                </td>
                                <td>
                                  <input
                                    name='numeroPuntos'
                                    onFocus={(e) => handleFocusPunto(e, i)}
                                    value={p.puntos}
                                    onChange={e => hanldeChangePunto(e, i)}
                                    className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                    type="number" />
                                </td>
                                <td>
                                  <button
                                    onClick={(e) => handleDeletePunto(e, i)}
                                    className="p-1 opacity-0 trash-button rounded-md">
                                    <ICONS.Trash />
                                  </button>
                                </td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className='flex flex-col w-full'>
                      <table className="w-full">
                        <thead>
                          <tr className="font-medium text-teal-800">
                            <th >GUIA_HILOS</th>
                            <th >FIBRAS</th>
                            <th>CALIBRE</th>
                            <th>PROVEEDOR</th>
                            <th>COLORES</th>
                            <th>HEBRAS</th>
                            <th>MELT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {

                            fichaTecnicaObj?.fibras?.map((f, i) => <tr key={'F' + i} className="array-row">
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='guiaHilos'
                                  value={f.guiaHilos}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='fibras'
                                  value={f.fibras}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='calibre'
                                  value={f.calibre}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="number" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='proveedor'
                                  value={f.proveedor}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='color'
                                  value={f.color}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='hebras'
                                  value={f.hebras}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="number" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusFibra(e, i)}
                                  name='otro'
                                  value={f.otro}
                                  onChange={(e) => handleChangeFibra(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <button
                                  onClick={(e) => handleDeleteFibra(e, i)}
                                  className="p-1 opacity-0 trash-button rounded-md">
                                  <ICONS.Trash />
                                </button>
                              </td>
                            </tr>)
                          }
                        </tbody>
                      </table>
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