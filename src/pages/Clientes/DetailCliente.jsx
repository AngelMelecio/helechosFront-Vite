
import DynamicInput from "../../components/DynamicInput"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClientes } from "./hooks/useClientes";
import { ICONS } from "../../constants/icons";
import { useFormik, FormikProvider } from "formik";
import Input from "../../components/Input";
import Loader from "../../components/Loader/Loader";

const initCliente = {
  idCliente: "",
  nombre: "",
  direccion: "",
  correo: "",
  contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
  otro: ""
}

const initContacto = { nombre: '', puesto: '', correo: '', telefono: '', nota: '' }

const DetailCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = (id !== '0');
  const { saveCliente, loading, findCliente, allClientes, setLoading } = useClientes();
  const [theresChanges, setTheresChanges] = useState(false);

  const validate = values => {
    const errors = {};
    if (!values.nombre) {
      errors.nombre = 'Ingresa un nombre';
    }
    if (!values.direccion) {
      errors.direccion = 'Ingresa la dirección';
    }
    if (!values.telefono) {
      errors.telefono = 'Ingresa el teléfono';
    } else if (values.telefono.toString().length !== 10) {
      errors.telefono = 'Ingresa 10 digitos';
    }
    if (!values.rfc) {
      errors.rfc = 'Ingresa el RFC';
    } else if (values.rfc.toString().length !== 13) {
      errors.rfc = 'Ingresa 13 digitos';
    }
    if (!values.correo) {
      errors.correo = 'Ingresa el correo';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
      errors.correo = 'Correo invalido';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: null,
    validate,
    onSubmit: async (values) => {
      await saveCliente({ values: values, method: isEdit ? 'PUT' : 'POST' })
      navigate(("/clientes"))
    },
  });

  useEffect(async () => {
    try {
      setLoading(true)
      formik.setValues(
        id === '0' ? initCliente :
          allClientes.length > 0 ? allClientes.find(m => m.idCliente + '' === id) :
            await findCliente(id)
      )
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }, [id]);

  const handleChange = (e) => {
    formik.setFieldValue(e.target.name, e.target.value)
    setTheresChanges(true)
  }
  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute p-4">
          <div className="flex pb-4 justify-between">
            <div className="flex justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
                <p className="font-bold text-2xl pl-3 text-teal-700">
                  {isEdit ? `Detalles del cliente` : "Nuevo cliente"}
                </p>
              </div>
            </div>

            <input
              disabled={loading || !theresChanges}
              className='bg-teal-500 p-1 w-40 text-white normal-button h-full rounded-lg'
              type="submit"
              value={isEdit ? "Guardar" : "Agregar"}
              form="frmClientes"
            />


          </div>
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <div className="flex w-full h-full ">
                {loading || formik.values === null ? <Loader /> :
                  <FormikProvider value={formik}>

                    <form
                      id='frmClientes'
                      className='flex flex-col h-full w-full relative overflow-y-scroll'
                      onSubmit={formik.handleSubmit}>
                      <div className="absolute w-full flex flex-col  px-4">
                        <div className='flex flex-row w-full h-full p-2 total-center'>
                          <div className="flex relative w-full items-center justify-center text-center">
                            <ICONS.HandShake className='' size='100px' style={{ color: '#0f766e' }} />
                          </div>
                        </div>
                        <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                          <div className="absolute w-full total-center -top-3">
                            <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
                              Datos del Cliente
                            </div>
                          </div>
                          <div className='flex flex-row'>
                            <Input
                              label='Nombre' type='text' name='nombre' value={formik.values ? formik.values.nombre : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null}
                            />
                            <Input
                              label='Dirección' type='text' name='direccion' value={formik.values ? formik.values.direccion : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                              Icon={ICONS.House}
                            />
                          </div>
                          <div className='flex flex-row'>
                            <Input
                              label='Teléfono' type='number' name='telefono' value={formik.values ? formik.values.telefono : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                              Icon={ICONS.Phone}
                            />
                            <Input
                              label='Correo' type='text' name='correo' value={formik.values ? formik.values.correo : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.correo && formik.touched.correo ? formik.errors.correo : null}
                              Icon={ICONS.Email}
                            />
                          </div>
                          <div className='flex flex-row'>
                            <Input
                              label='RFC' type='text' name='rfc' value={formik.values ? formik.values.rfc : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.rfc && formik.touched.rfc ? formik.errors.rfc : null}
                            />
                            <Input
                              label='Otros' type='text' name='otro' value={formik.values ? formik.values.otro : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.otro && formik.touched.otro ? formik.errors.otro : null}
                            />
                          </div>
                        </div>
                        <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                          <div className="absolute w-full total-center -top-3">
                            <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
                              Contactos
                            </div>
                          </div>
                          <div className="flex flex-row w-full  justify-around">
                            <div className="overflow-y-scroll w-full px-2">
                              <DynamicInput
                                columns={[
                                  { name: 'Nombre', atr: 'nombre' },
                                  { name: 'Puesto', atr: 'puesto' },
                                  { name: 'Correo', atr: 'correo' },
                                  { name: 'Teléfono', atr: 'telefono' },
                                  { name: 'Nota', atr: 'nota' }
                                ]}
                                elements={formik.values ? formik.values.contactos : [initContacto]}
                                arrayName={'contactos'}
                                handleChange={formik.handleChange}
                                clearObject={initContacto}
                                setTheresChanges={setTheresChanges}
                              >
                              </DynamicInput>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </FormikProvider>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DetailCliente