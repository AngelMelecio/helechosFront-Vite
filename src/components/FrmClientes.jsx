
import { useFormik, FormikProvider } from "formik";
import { useState } from "react";
import { ICONS } from "../constants/icons";
import { useApp } from "../context/AppContext";
import Input from "./Input";
import DynamicInput from "./DynamicInput"

const FrmClientes = ({
  onCloseModal,
  cliente,
  isEdit
}) => {
  const [saving, setSaving] = useState()
  const [objCliente, setObjCliente] = useState(cliente)
  const { saveCliente, getClientes } = useApp()
  const [cleaning, setCleaning] = useState(false)
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
  //Declaración
  const formik = useFormik({
    initialValues: objCliente,
    validate,
    onSubmit: values => {
      handleSaveClientes(values);
    },
  });
  const handleSaveClientes = async (values) => {
    setSaving(true)
    setCleaning(true)
    await saveCliente(values, isEdit)
    await getClientes()
    onCloseModal()
    setCleaning(false)
    setSaving(false)
  }

  return (
    <div id="form-modal-clientes"
      className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col '>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.Edit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.Plus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />}
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </p>
              <input
                disabled={saving}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-0 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmClientes" />
              <button
                className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                onClick={onCloseModal}>
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
            </div>
          </div>
          <div className="flex w-full h-full ">
            <FormikProvider value={formik}>

              <form
                id='frmClientes'
                className='flex flex-col h-full w-full relative overflow-y-scroll'
                onSubmit={formik.handleSubmit}>
                <div className="absolute w-full flex flex-col  px-4">
                  <div className='flex flex-row w-full h-full p-2 total-center'>
                    <div className="flex relative w-full items-center justify-center text-center">
                      <ICONS.HandShake className='' size='100px' style={{ color: '#115e59' }} />
                    </div>
                  </div>
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                    <div className="absolute w-full total-center -top-3">
                      <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                        DATOS CLIENTE
                      </div>
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Nombre' type='text' name='nombre' value={formik.values.nombre}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null}
                      />
                      <Input
                        label='Dirección' type='text' name='direccion' value={formik.values.direccion}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                        Icon={ICONS.House}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='Teléfono' type='number' name='telefono' value={formik.values.telefono}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                        Icon={ICONS.Phone}
                      />
                      <Input
                        label='Correo' type='text' name='correo' value={formik.values.correo}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.correo && formik.touched.correo ? formik.errors.correo : null}
                        Icon={ICONS.Email}
                      />
                    </div>
                    <div className='flex flex-row'>
                      <Input
                        label='RFC' type='text' name='rfc' value={formik.values.rfc}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.rfc && formik.touched.rfc ? formik.errors.rfc : null}
                      />
                      <Input
                        label='Otros' type='text' name='otro' value={formik.values.otro}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        errores={formik.errors.otro && formik.touched.otro ? formik.errors.otro : null}
                      />
                    </div>
                  </div>
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                    <div className="absolute w-full total-center -top-3">
                      <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                        CONTACTOS
                      </div>
                    </div>
                    <div className="flex flex-row w-full  justify-around">
                      <div className="overflow-y-scroll">
                        <DynamicInput
                          columns={[
                            { name: 'Nombre', atr: 'nombre' },
                            { name: 'Puesto', atr: 'puesto' },
                            { name: 'Correo', atr: 'correo' },
                            { name: 'Teléfono', atr: 'telefono' },
                            { name: 'Nota', atr: 'nota' }
                          ]}
                          elements={formik.values.contactos}
                          arrayName={'contactos'}
                          handleChange={formik.handleChange}
                          clearObject={{ nombre: '', puesto: '', correo: '', telefono: '', nota: '' }}
                        >
                        </DynamicInput>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FrmClientes