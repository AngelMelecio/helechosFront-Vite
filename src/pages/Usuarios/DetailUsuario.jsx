import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { useUsuarios } from './hooks/useUsuarios'
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import FieldsBox from "../../components/FieldsBox";
import Inpt from "../../components/Inputs/Inpt";
import OptsInpt from "../../components/Inputs/OptsInpt";
import Btton from "../../components/Buttons/Btton";

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
  { value: 'Encargado', label: 'Encargado' },
  { value: 'Desarrollador', label: 'Desarrollador' },
  { value: 'Administrador', label: 'Administrador' },
  { value: 'Produccion', label: 'Producción' },
  { value: 'Reportes', label: 'Reportes' },
]

const optionsActivo = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
]

const DetailUsuario = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')
  const {
    getUsuario,
    handleSaveUsuario,
    loading,
    findUsuario,
    allUsuarios,
    setLoading,
    errors,
    setErrors
  } = useUsuarios();
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


  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 bg-slate-100">
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {isEdit ? `Detalles del Usuario` : "Nuevo Usuario"}
              </p>
            </div>
            <Btton
              disabled={loading || !theresChanges}
              type="submit"
              form="frmUsuarios"
              className="h-10 px-8"
            >
              {isEdit ? "Guardar" : "Agregar"}
            </Btton>


          </div>
          <div className="relative flex flex-col h-full bg-white rounded-t-lg shadow-lg">
            <div className='flex flex-col w-full h-full '>
              <div className="flex w-full h-full ">
                {loading || formik.values === null ? <Loader /> :
                  <form
                    id='frmUsuarios'
                    className='relative flex flex-col w-full h-full overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute flex flex-col w-full p-4">

                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="relative flex items-center justify-center w-full text-center">
                          <ICONS.UsersIdentity className='text-teal-800/80' size='100px' />
                        </div>
                      </div>
                      <div className="flex w-full">
                        <FieldsBox title="Datos Personales">
                          <div className='flex flex-row gap-6'>
                            <Inpt
                              label="Nombre(s)"
                              name="nombre"
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                              type="text"
                            />
                            <Inpt
                              label="Apellido(s)"
                              name="apellidos"
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                              type="text"
                            />
                          </div>
                          <div className='flex flex-row'>
                            <Inpt
                              label="Correo"
                              name="correo"
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                              Icon={ICONS.Email}
                              type="text"
                            />
                          </div>
                        </FieldsBox>
                      </div>
                      <div className="flex w-full">
                        <FieldsBox title="Datos de usuario">
                          <div className='grid grid-cols-2 gap-6'>
                            <Inpt
                              label="Usuario"
                              name="usuario"
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                              type="text"
                              Icon={ICONS.User}
                            />
                            <div className="flex">
                              {isEdit &&
                                <div className="flex p-4 pb-8 total-center">
                                  <input
                                    onChange={() => setNewPass(prev => !prev)}
                                    value={newPass} type="checkbox" className="inpt-check" />
                                </div>}
                              <Inpt
                                label={isEdit ? 'Nueva Contraseña' : 'Contraseña'}
                                name='password'
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                                type="password"
                                Icon={ICONS.Key}
                                disabled={isEdit && !newPass}
                              />
                            </div>
                          </div>

                          <div className="flex gap-6">
                            <OptsInpt
                              label="Rol"
                              name="rol"
                              formik={formik}
                              options={optionsRol}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder="Seleccione"
                              space
                            />
                            <OptsInpt
                              label="Estado"
                              name="is_active"
                              formik={formik}
                              options={optionsActivo}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder="Seleccione"
                              space
                            />
                          </div>
                        </FieldsBox>
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