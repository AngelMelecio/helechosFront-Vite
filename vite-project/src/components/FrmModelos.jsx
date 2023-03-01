import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import Input from "./Input"

const puntoObj = {
  no: '',
  puntos: ''
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
  tipoMaquina: '',
  modelo: '',
  numeroMaquina: '',
  galga: '',
  cliente: '',
  talla: '',
  velocidad: '',
  tiempoBajada: '',
  pesoPoliester: '',
  pesoMelt: '',
  pesoLurex: '',

  fibras: [{ ...fibraObj }],
  puntos: [{ ...puntoObj }],

}

const dummyFichaNormalAtr = {
  nombre: 'ROCUP-24-25-08-22',
  tipoMaquina: 'SF3-365-FL',
  modelo: '031',
  numeroMaquina: '91',
  galga: '14',
  cliente: 'Flexi',
  talla: '27',
  velocidad: '25',
  tiempoBajada: '65',
  pesoPoliester: '12',
  pesoMelt: '546',
  pesoLurex: '648',
}



const FrmModelos = ({ 
  onCloseModal, 
  fichaTecnica, 
  setFichaTecnica,
  isEdit,
  setIsEdit,
}) => {

  const [saving, setSaving] = useState(false)

  

  const validate = (values) => {
    const errors = {}
    return errors
  }

  const formik = useFormik({
    initialValues: dummyFichaNormalAtr, //initobj,
    validate,
    onSubmit: values => {
      console.log(fichaTecnica)
    },
  });

  useEffect(() => {
    setFichaTecnica(prev => ({ ...formik.values, fibras: [...prev.fibras], puntos: [...prev.puntos] }))
  }, [formik?.values])


  const handleSelectImage = (e) => {
  }

  const handleDeleteFibra = (e, indx) => {
    e.preventDefault()
    if (fichaTecnica.fibras.length === 1) {
      setFichaTecnica(prev => ({ ...prev, fibras: [{ ...fibraObj }] }))
      return
    }
    let newFibras = [...fichaTecnica.fibras]
    newFibras.splice(indx, 1)
    setFichaTecnica(prev => ({ ...prev, fibras: newFibras }))
  }

  const handleChangeFibra = (e, indx) => {
    let newFibras = [...fichaTecnica.fibras]
    newFibras[indx][e.target.name] = e.target.type == 'number' ? Number(e.target.value) : e.target.value
    setFichaTecnica(prev => ({ ...prev, fibras: newFibras }))
  }

  const handleFocusFibra = (e, indx) => {
    if (indx === fichaTecnica.fibras.length - 1) {
      setFichaTecnica(prev => ({ ...prev, fibras: [...prev.fibras, { ...fibraObj }] }))
    }
  }

  const handleDeletePunto = (e, indx) => {
    e.preventDefault()
    if (fichaTecnica.puntos.length === 1) {
      setFichaTecnica(prev => ({ ...prev, puntos: [{ ...puntoObj }] }))
      return
    }
    let newPuntos = [...fichaTecnica.puntos]
    newPuntos.splice(indx, 1)
    setFichaTecnica(prev => ({ ...prev, puntos: newPuntos }))
  }

  const hanldeChangePunto = (e, indx) => {
    let newPuntos = [...fichaTecnica.puntos]
    newPuntos[indx][e.target.name] = Number(e.target.value)
    setFichaTecnica(prev => ({ ...prev, puntos: newPuntos }))
  }

  const handleFocusPunto = (e, indx) => {
    if (indx === fichaTecnica.puntos.length - 1) {
      setFichaTecnica(prev => ({ ...prev, puntos: [...prev.puntos, { ...puntoObj }] }))
    }
  }

  return (
    <div className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col '>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
              }
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Modelo' : 'Nuevo Modelo'}
              </p>
              <div className="flex flex-row absolute right-0">
                {<button
                  onClick={() => { } /*handleImprimir*/}
                  className="bg-teal-500 py-1 px-5 mr-4 w-auto text-white normalButton  rounded-lg">
                  IMPRIMIR
                </button>}
                <input
                  disabled={saving}
                  className='bg-teal-500 py-1 w-auto px-5 text-white normalButton  rounded-lg'
                  type="submit"
                  value={isEdit ? "GUARDAR" : "AGREGAR"}
                  form="frmModelos"
                />
              </div>
              <button
                className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
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
                    { /* Imagen del Empleado */}
                    <input id='file' type="file" name='fotografia' accept='image/*' onChange={handleSelectImage} className='inputfile' />
                    <label
                      className='absolute -bottom-2 -right-1 bg-teal-500 p-2 text-white normalButton rounded-full'
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
                  <div className='flex flex-row'>
                    <div className="flex flex-row w-full">
                      <Input
                        label='Nombre del Programa' type='text' name='nombre' value={formik.values.nombre}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null} />
                    </div>
                    <div className="flex flex-row w-full">
                      <Input
                        label='Tipo de Maquina' type='text' name='tipoMaquina' value={formik.values.tipoMaquina}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.tipoMaquina && formik.touched.tipoMaquina ? formik.errors.tipoMaquina : null}
                      />
                      <Input
                        label='Modelo' type='number' name='modelo' value={formik.values.modelo}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.modelo && formik.touched.modelo ? formik.errors.modelo : null}
                      />
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='No. Maquina' type='text' name='numeroMaquina' value={formik.values.numeroMaquina}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.numeroMaquina && formik.touched.numeroMaquina ? formik.errors.numeroMaquina : null}
                    />
                    <Input
                      label='Galga' type='text' name='galga' value={formik.values.galga}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.galga && formik.touched.galga ? formik.errors.galga : null}
                    />
                    <Input
                      label='Cliente' type='text' name='cliente' value={formik.values.cliente}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.cliente && formik.touched.cliente ? formik.errors.cliente : null}
                    />
                    <Input
                      label='Talla' type='text' name='talla' value={formik.values.talla}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.talla && formik.touched.talla ? formik.errors.talla : null}
                    />
                    <Input
                      label='Velocidad' type='number' name='velocidad' value={formik.values.velocidad}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.velocidad && formik.touched.velocidad ? formik.errors.velocidad : null}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Vel. de Plancha' type='number' name='velocidadPlancha' value={formik.values.velocidadPlancha}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.velocidadPlancha && formik.touched.velocidadPlancha ? formik.errors.velocidadPlancha : null}
                    />
                    <Input
                      label='Tiempo de Bajada' type='number' name='tiempoBajada' value={formik.values.tiempoBajada}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.tiempoBajada && formik.touched.tiempoBajada ? formik.errors.tiempoBajada : null}
                    />
                    <Input
                      label='Peso Poliester' type='number' name='pesoPoliester' value={formik.values.pesoPoliester}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.pesoPoliester && formik.touched.pesoPoliester ? formik.errors.pesoPoliester : null}
                    />
                    <Input
                      label='Peso Melt' type='number' name='pesoMelt' value={formik.values.pesoMelt}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.pesoMelt && formik.touched.pesoMelt ? formik.errors.pesoMelt : null}
                    />
                    <Input
                      label='Peso Lurex' type='number' name='pesoLurex' value={formik.values.pesoLurex}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.pesoLurex && formik.touched.pesoLurex ? formik.errors.pesoLurex : null}
                    />
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
                            fichaTecnica?.puntos?.map((p, i) =>
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
                                    name='puntos'
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

                            fichaTecnica.fibras.map((f, i) => <tr key={'F' + i} className="array-row">
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