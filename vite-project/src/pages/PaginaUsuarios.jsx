import { useFormik } from "formik"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import CustomSelect from "../components/CustomSelect"
import DeleteModal from "../components/DeleteModal"
import Input from "../components/Input"
import Table from "../components/Table"
import { ICONS } from "../constants/icons"
import { useAdmin } from "../context/AdminContext"
import { useAuth } from "../context/AuthContext"

const apiUserUrl = 'http://localhost:8000/users/'

const initobj = {
  nombre: '',
  apellidos: '',
  correo: '',
  usuario: '',
  password: '',
  is_active: true,
  is_staff: false
}

const optionsTipo = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Encargado', label: 'Encargado' },
  { value: 'Administrador', label: 'Administrador' },
]

const optionsActivo = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
]

const PaginaUsuarios = () => {

  const modalRef = useRef()
  const modalBoxRef = useRef()
  const newPassRef = useRef()
  const pageRef = useRef()

  const { session, notify } = useAuth()

  const {
    fetchingUsuarios,
    getUsuarios,
    allUsuarios,
    updateUser,
    updatePassword,
    UsuariosColumns,
    saveUser,
    deleteUsuarios

  } = useAdmin()

  const [objUsuario, setObjUsuario] = useState(initobj)
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newPass, setNewPass] = useState(false)

  useEffect(async () => {
    async function str() {
      await getUsuarios()
    }
    str()
  }, [])

  useEffect(async () => {
    setListaUsuarios(allUsuarios)
  }, [allUsuarios])

  const handleModalVisibility = async (show, edit) => {

    if (show) {
      document.getElementById("form-modal").classList.add('visible')
      document.getElementById("tbl-page").classList.add('blurred')
    }
    else {
      document.getElementById("form-modal").classList.remove('visible')
      document.getElementById("tbl-page").classList.remove('blurred')
    }

    if (!show) formik.resetForm()

    setIsEdit(edit)

    if (!edit) {
      setObjUsuario(initobj)
      setNewPass(false)
    }

  }
  const handleModalDeleteVisibility = (visible) => {
    //if (!someSelectedRef.current.checked) return
    if (visible) {
      document.getElementById('delete-modal').classList.add('visible')
      document.getElementById("tbl-page").classList.add('blurred')
    }
    else {
      document.getElementById('delete-modal').classList.remove('visible')
      document.getElementById("tbl-page").classList.remove('blurred')
    }
  }

  const validate = values => {
    const errors = {};

    if (!values.nombre) {
      errors.nombre = 'Ingresa el nombre';
    } else if (values.nombre.length > 25) {
      errors.nombre = '25 caracteres o menos';
    }

    if (!values.apellidos) {
      errors.apellidos = 'Ingresa el apellido';
    } else if (values.apellidos.length > 50) {
      errors.apellidos = '50 caracteres o menos';
    }

    if (!values.correo) {
      errors.correo = 'Ingresa el correo';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
      errors.correo = 'Correo invalido';
    }

    if (!values.usuario) {
      errors.usuario = 'Ingresa un usuario';
    } else if ((values.usuario.length < 4 || values.usuario.length > 20)) {
      errors.usuario = 'El usuario debe tener una longitud entre 4 y 20 caracteres';
    }

    if (!isEdit || (isEdit && newPass)) {
      if (!values.password) {
        errors.password = 'Ingresa una contraseña';
      } else if ((values.password.length < 8 || values.password.length > 15)) {
        errors.password = 'La contraseña debe tener una longitud entre 8 y 15 caracteres';
      }
    }

    if (values.is_staff !== true && values.is_staff !== false) {
      errors.is_staff = 'Selecciona un tipo';
    } else if (values.is_staff === "Seleccione") {
      errors.is_staff = 'Selecciona un tipo';
    }

    if (values.is_active !== true && values.is_active !== false) {
      errors.is_active = 'Selecciona un estado';
    } else if (values.is_active === "Seleccione") {
      errors.is_active = 'Selecciona un estado';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initobj,
    validate,
    onSubmit: values => {
      //console.log('Guardando:', values)
      handleSaveUsuario(values)
    },
  });

  const handleSaveUsuario = async (values) => {
    setSaving(true)
    try {
      if (!isEdit) {
        await saveUser(values)
      } else {
        let newV = {
          nombre: values.nombre,
          apellidos: values.apellidos,
          correo: values.correo,
          usuario: values.usuario,
          is_active: values.is_active,
          is_staff: values.is_staff,
        }
        let id = values.id
        await updateUser(id, newV)
        if (newPass) {
          await updatePassword(id, values.password)
        }
      }
      setListaUsuarios(await getUsuarios())
      handleModalVisibility(false, false)
    }
    catch (e) {
      let { errors } = e
      if (errors.correo) notify(errors.correo[0], true)
      if (errors.usuario) notify(errors.usuario[0], true)
    }
    finally {
      setSaving(false)
    }
  }

  const handleDeleteUsuarios = async () => {
    setSaving(true)
    await deleteUsuarios(listaUsuarios)
    handleModalDeleteVisibility(false)
    setSaving(false)
  }

  const handleEdit = (usr) => {
    formik.setValues(usr)
    handleModalVisibility(true, true)
    setIsEdit(true)
    setObjUsuario(usr)
  }

  return (
    <>
      <Table
        allItems={allUsuarios}
        visibleItems={listaUsuarios}
        setVisibleItems={setListaUsuarios}
        fetching={fetchingUsuarios}
        columns={UsuariosColumns}
        onAdd={() => handleModalVisibility(true, false)}
        onDelete={() => { handleModalDeleteVisibility(true) }}
        onEdit={handleEdit}
      />
      
      {
        //modalDeleteVisible ?
        <DeleteModal
          onCancel={() => handleModalDeleteVisibility(false)}
          onConfirm={handleDeleteUsuarios}
          elements={listaUsuarios}
          representation={['nombre', 'apellidos']}
          message='Los siguientes usuarios se eliminarán permanentemente:'
        />
        //  : null
      }
      {
        //modalVisible ?
        <div ref={modalRef} id="form-modal" name="form-modal"
          className='modal z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
          <div ref={modalBoxRef} className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
            <div className='w-full flex h-full flex-col '>
              <div className="z-10 py-2 px-4 flex w-full shadow-md ">
                <div className="flex flex-row w-full total-center relative h-10">
                  {isEdit
                    ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                    : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                  }
                  <p className='font-semibold text-teal-800 text-2xl' >
                    {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </p>
                  <input
                    disabled={saving}
                    className='bg-teal-500 p-1 w-40 text-white font-bold normalButton absolute right-0 rounded-lg'
                    type="submit"
                    value={isEdit ? "GUARDAR" : "AGREGAR"}
                    form="frmUsuarios"
                  />
                  <button
                    className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                    onClick={() => handleModalVisibility(false, false)}
                  >
                    <ICONS.Cancel className='m-0' size='25px' />
                  </button>
                </div>
              </div>
              <div className="flex w-full h-full ">
                {<form
                  id='frmUsuarios'
                  className='flex flex-col h-full w-full relative overflow-y-scroll'
                  onSubmit={formik.handleSubmit}>
                  <div className="absolute w-full flex flex-col  px-4">
                    <div className='flex flex-row w-full h-full p-2 total-center'>
                      <div className="flex relative w-full items-center justify-center text-center">
                        <ICONS.UsersIdentity className='' size='100px' style={{ color: '#115e59' }} />
                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS PERSONALES
                        </div>
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Nombre(s)' type='text' name='nombre' value={formik.values.nombre}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null} />

                        <Input
                          label='Apellido(s)' type='text' name='apellidos' value={formik.values.apellidos}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.apellidos && formik.touched.apellidos ? formik.errors.apellidos : null}
                        />
                      </div>

                      <div className='flex flex-row'>
                        <Input
                          label='Correo' type='text' name='correo' value={formik.values.correo}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.correo && formik.touched.correo ? formik.errors.correo : null}
                          Icon={ICONS.Email}
                        />

                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS DE USUARIO
                        </div>
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Usuario' type='text' name='usuario' value={formik.values.usuario}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.usuario && formik.touched.usuario ? formik.errors.usuario : null}
                          Icon={ICONS.User}
                        />
                        {isEdit ?
                          <div className="flex w-full mx-2 ">
                            <div className="flex items-center px-2 pt-4">
                              <div className="inp-container ">
                                <input
                                  onChange={() => setNewPass(prev => !prev)}
                                  value={newPass} type="checkbox" className="inp-check" />
                                <label className="check"></label>
                              </div>
                            </div>
                            <Input
                              label={isEdit ? 'Nueva Contraseña' : 'Contraseña'} type='password' name='password' value={formik.values.password}
                              onChange={formik.handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.password && formik.touched.password ? formik.errors.password : null}
                              Icon={ICONS.Key}
                              disabled={!newPass}
                            />
                          </div>
                          :
                          <Input
                            label={isEdit ? 'Nueva Contraseña' : 'Contraseña'} type='password' name='password' value={formik.values.password}
                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.password && formik.touched.password ? formik.errors.password : null}
                            Icon={ICONS.Key}
                          />}
                      </div>
                      <div className="flex flex-row">
                        <CustomSelect
                          name='Tipo'
                          className='input'
                          onChange={value => formik.setFieldValue('is_staff', value.value === 'Administrador' ? true : false)}
                          value={formik.values.is_staff ? "Administrador" : "Encargado"}
                          onBlur={formik.handleBlur}
                          options={optionsTipo}
                          label='Tipo'
                          errores={formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : null}
                        />
                        <CustomSelect
                          name='Estado'
                          className='input'
                          onChange={value => formik.setFieldValue('is_active', value.value === 'Activo' ? true : false)}
                          value={formik.values.is_active ? "Activo" : "Inactivo"}
                          onBlur={formik.handleBlur}
                          options={optionsActivo}
                          label='Estado'
                          errores={formik.errors.activo && formik.touched.activo ? formik.errors.activo : null}
                        />
                      </div>
                    </div>
                  </div>
                </form>}
              </div>
            </div>
          </div>
        </div>
        //: null
      }

    </>
  )
}
export default PaginaUsuarios