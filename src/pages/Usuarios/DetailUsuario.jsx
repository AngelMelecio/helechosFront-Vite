import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { useUsuarios } from './hooks/useUsuarios'
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input";
import Loader from "../../components/Loader/Loader";

const initUsuario = {
  nombre: '',
  apellidos: '',
  correo: '',
  usuario: '',
  password: '',
  is_active: true,
  is_staff: false,
  rol: 'Seleccione'
}

const optionsRol = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Encargado', label: 'Encargado' },
  { value: 'Desarrollador', label: 'Desarrollador' },
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Produccion', label: 'Producción' },
]

const optionsActivo = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
]

const DetailUsuario = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')
  const { getUsuario, handleSaveUsuario, loading, findUsuario, allUsuarios, setLoading, errors, setErrors } = useUsuarios();
  const [newPass, setNewPass] = useState(false)
  const [theresChanges, setTheresChanges] = useState(false)

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
    if (!values.rol) {
      errors.rol = 'Selecciona un rol';
    } else if (values.rol === 'Seleccione') {
      errors.rol = 'Selecciona un rol';
    }

    if (values.is_active !== true && values.is_active !== false) {
      errors.is_active = 'Selecciona un estado';
    } else if (values.is_active === "Seleccione") {
      errors.is_active = 'Selecciona un estado';
    }
    return errors;
  };



  const formik = useFormik({
    initialValues: null,
    validate,
    onSubmit: async (values) => {
      let success = await handleSaveUsuario({ values: values, method: isEdit ? 'PUT' : 'POST', newPass })
      if (!success) {
        return
      }
      navigate(("/usuarios"))
      setErrors(null);
    },
  });

  useEffect(async () => {
    try {
      setLoading(true)
      formik.setValues(
        id === '0' ? initUsuario :
          allUsuarios.length > 0 ? allUsuarios.find(m => m.id + '' === id) :
            await findUsuario(id)
      )
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [id]);

  useEffect(() => {
    return () => { setLoading(true); }
  }, [])

  const handleChange = (e) => {
    formik.setFieldValue(e.target.name, e.target.value)
    setTheresChanges(true)
  }

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute p-4">
          <div className="flex pb-4 justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
              <p className="font-bold text-2xl pl-3 text-teal-700">
                {isEdit ? `Detalles del Usuario` : "Nuevo Usuario"}
              </p>
            </div>
            <input
              disabled={loading || !theresChanges}
              className='bg-teal-500 p-1 w-40 text-white normal-button rounded-lg'
              type="submit"
              value={isEdit ? "Guardar" : "Agregar"}
              form="frmUsuarios"
            />
          </div>
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <div className="flex w-full h-full ">
                {loading || formik.values === null ? <Loader /> :
                  <form
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
                            label='Nombre(s)' type='text' name='nombre' value={formik.values ? formik.values.nombre : ''}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null} />

                          <Input
                            label='Apellido(s)' type='text' name='apellidos' value={formik.values ? formik.values.apellidos : ''}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.apellidos && formik.touched.apellidos ? formik.errors.apellidos : null}
                          />
                        </div>

                        <div className='flex flex-row'>
                          <Input
                            label='Correo' type='text' name='correo' value={formik.values ? formik.values.correo : ''}
                            onChange={handleChange} onBlur={formik.handleBlur}
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
                            label='Usuario' type='text' name='usuario' value={formik.values ? formik.values.usuario : ''}
                            onChange={handleChange} onBlur={formik.handleBlur}
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
                                label={isEdit ? 'Nueva Contraseña' : 'Contraseña'} type='password' name='password' value={formik.values ? formik.values.password : ''}
                                onChange={handleChange} onBlur={formik.handleBlur}
                                errores={formik.errors.password && formik.touched.password ? formik.errors.password : null}
                                Icon={ICONS.Key}
                                disabled={!newPass}
                              />
                            </div>
                            :
                            <Input
                              label={isEdit ? 'Nueva Contraseña' : 'Contraseña'} type='password' name='password' value={formik.values ? formik.values.password : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.password && formik.touched.password ? formik.errors.password : null}
                              Icon={ICONS.Key}
                            />}
                        </div>
                        <div className="flex flex-row">
                          <CustomSelect
                            name='Rol'
                            className='input'
                            onChange={value => { formik.setFieldValue('rol', value.value); setTheresChanges(true) }}
                            value={formik.values?.rol}
                            onBlur={formik.handleBlur}
                            options={optionsRol}
                            label='Rol'
                            errores={formik.errors.rol && formik.touched.rol ? formik.errors.rol : null}
                          />
                          <CustomSelect
                            name='Estado'
                            className='input'
                            onChange={value => { formik.setFieldValue('is_active', value.value === 'Activo' ? true : false); setTheresChanges(true) }}
                            value={formik.values ? formik.values.is_active ? "Activo" : "Inactivo" : ''}
                            onBlur={formik.handleBlur}
                            options={optionsActivo}
                            label='Estado'
                            errores={formik.errors.activo && formik.touched.activo ? formik.errors.activo : null}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DetailUsuario