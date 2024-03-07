import DynamicInput from "../../components/DynamicInput"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProveedores } from "./hooks/useProveedores";
import { ICONS } from "../../constants/icons";
import { useFormik, FormikProvider } from "formik";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import Inpt from "../../components/Inputs/Inpt";
import OptsInpt from "../../components/Inputs/OptsInpt";
import FieldsBox from "../../components/FieldsBox";

const initProveedor = {
  idProveedor: "",
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  departamento: "Seleccione",
  contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
  otro: ""
}
const initContacto = { nombre: '', puesto: '', correo: '', telefono: '', nota: '' }

const optionsDepartamento = [
  { value: 'Seleccione', label: 'Seleccione' },
  { value: 'Tejido', label: 'Tejido' },
  { value: 'Corte', label: 'Corte' },
  { value: 'Plancha', label: 'Plancha' },
  { value: 'Empaque', label: 'Empaque' },
  { value: 'Transporte', label: 'Transporte' },
  { value: 'Diseno', label: 'Diseño' },
  { value: 'Gerencia', label: 'Gerencia' }
]
const DetailProveedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = (id !== '0');
  const { saveProveedor, loading, findProveedor, allProveedores, setLoading } = useProveedores();
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
      errors.telefono = 'Ingresa el telefono';
    } else if (values.telefono.toString().length !== 10) {
      errors.telefono = 'Ingresa 10 digitos';
    }

    if (!values.correo) {
      errors.correo = 'Ingresa el correo';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.correo)) {
      errors.correo = 'Correo invalido';
    }

    if (!values.rfc) {
      errors.rfc = 'Ingresa el RFC';
    } else if (values.rfc.toString().length !== 13) {
      errors.rfc = 'Ingresa 13 digitos';
    }

    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } else if (values.departamento === "Seleccione") {
      errors.departamento = 'Selecciona un departamento';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: null,
    validate,
    onSubmit: async (values) => {
      await saveProveedor({ values: values, method: isEdit ? 'PUT' : 'POST' })
      navigate(("/proveedores"))
    },
  });

  useEffect(async () => {
    try {
      setLoading(true)
      formik.setValues(
        id === '0' ? initProveedor :
          allProveedores.length > 0 ? allProveedores.find(m => m.idProveedor + '' === id) :
            await findProveedor(id)
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
      <div className="relative w-full overflow-hidden">
        <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 bg-slate-100">
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {isEdit ? `Detalles del proveedor` : "Nuevo proveedor"}
              </p>
            </div>

            <input
              disabled={loading || !theresChanges}
              className='w-40 h-full p-1 text-white bg-teal-500 rounded-lg normal-button'
              type="submit"
              value={isEdit ? "Guardar" : "Agregar"}
              form="frmProveedores"
            />

          </div>
          <div className="relative flex flex-col h-full bg-white rounded-t-lg shadow-lg">
            <div className='flex flex-col w-full h-full '>
              <div className="flex w-full h-full ">
                {formik?.values === null ? <Loader /> :
                  <FormikProvider value={formik}>
                    <form
                      id='frmProveedores'
                      className='relative flex flex-col w-full h-full overflow-y-scroll'
                      onSubmit={formik.handleSubmit}>
                      <div className="absolute flex flex-col w-full px-4">
                        <div className='flex flex-row w-full h-full p-2 total-center'>
                          <div className="relative flex items-center justify-center w-full text-center">
                            <ICONS.Truck className='text-teal-800/80' size='100px' />
                          </div>
                        </div>
                        {/**
                         * DATOS PROVEEDOR
                         */}
                        <div className="flex w-full">
                          <FieldsBox title="Datos del proveedor">

                            <div className='flex flex-row gap-6'>
                              <Inpt
                                label='Nombre' type='text' name='nombre'
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                              <Inpt
                                label='Dirección' type='text' name='direccion' Icon={ICONS.House}
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                            </div>
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                label='Teléfono' type='number' name='telefono' Icon={ICONS.Phone}
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                              <Inpt
                                label='Correo' type='text' name='correo' Icon={ICONS.Email}
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                            </div>
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                label='RFC' type='text' name='rfc'
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                              <OptsInpt
                                label='Departamento'
                                name='departamento'
                                options={optionsDepartamento}
                                formik={formik}
                                fieldChange={() => setTheresChanges(true)}

                              />
                            </div>
                            <div className='flex flex-row'>
                              <Inpt
                                label='Otros' type='text' name='otro'
                                formik={formik}
                                onKeyDown={() => setTheresChanges(true)}
                              />
                            </div>
                          </FieldsBox>
                        </div>
                        <div className="flex w-full">

                          <FieldsBox title="Contactos" vertical >
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
                          </FieldsBox>
                        </div>
                      </div>
                    </form>
                  </FormikProvider>
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
export default DetailProveedor