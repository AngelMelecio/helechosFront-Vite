import { useFormik } from "formik";
import { useState } from "react";
import { ICONS } from "../constants/icons";
import { useApp } from "../context/AppContext";
import CustomSelect from "./CustomSelect";

import Input from "./Input";

const contactoObj = {
  nombre: '',
  puesto: '',
  correo: '',
  telefono: '',
  otro: ''
}

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
const FrmProveedores = ({
  isEdit,
  proveedor,
  onCloseModal
}) => {

  const [saving, setSaving] = useState()
  const [objProveedor, setObjProveedor] = useState(proveedor)

  const { saveProveedor, getProveedores } = useApp()

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

    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } else if (values.departamento === "Seleccione") {
      errors.departamento = 'Selecciona un departamento';
    }

    return errors;
  };
  //Declaración
  const formik = useFormik({
    initialValues: proveedor,
    validate,
    onSubmit: values => {
      values.contactos = objProveedor.contactos
      handleSaveProveedores(values);
    },
  });

  const handleSaveProveedores = async (values) => {
    setSaving(true)
    await saveProveedor(values, isEdit)
    await getProveedores()
    onCloseModal()
    setSaving(false)
  }

  const handleDeleteContacto = (e, indx) => {
    e.preventDefault()
    if (objProveedor.contactos.length === 1) {
      setObjProveedor(prev => ({ ...prev, contactos: [{ ...contactoObj }] }))
      return
    }
    let newContacts = [...objProveedor.contactos]
    newContacts.splice(indx, 1)
    setObjProveedor(prev => ({ ...prev, contactos: newContacts }))
  }


  const handleChangeContacto = (e, indx) => {
    let newContacts = [...objProveedor.contactos]
    newContacts[indx][e.target.name] = e.target.type == 'number' ? Number(e.target.value) : e.target.value
    setObjProveedor(prev => ({ ...prev, contactos: newContacts }))
  }

  const handleFocusContacto = (e, indx) => {
    if (indx === objProveedor.contactos.length - 1) {
      setObjProveedor(prev => ({ ...prev, contactos: [...prev.contactos, { ...contactoObj }] }))
    }
  }



  return (
    <div id="form-modal-proveedores"
      className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col '>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.Edit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.Plus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />}
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </p>
              <input
                disabled={saving}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-0 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmProveedores" />
              <button
                className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                onClick={onCloseModal}>
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
            </div>
          </div>
          <div className="flex w-full h-full ">
            <form
              id='frmProveedores'
              className='flex flex-col h-full w-full relative overflow-y-scroll'
              onSubmit={formik.handleSubmit}>
              <div className="absolute w-full flex flex-col  px-4">
                <div className='flex flex-row w-full h-full p-2 total-center'>
                  <div className="flex relative w-full items-center justify-center text-center">
                    <ICONS.Truck className='' size='100px' style={{ color: '#115e59' }} />
                  </div>
                </div>
                <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                  <div className="absolute w-full total-center -top-3">
                    <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                      DATOS PROVEEDOR
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Nombre' type='text' name='nombre' value={formik.values.nombre}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : null}
                    />
                    <Input
                      label='Dirección' type='text' name='direccion' value={formik.values ? formik.values.direccion : ''}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                      Icon={ICONS.House}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Teléfono' type='number' name='telefono' value={formik.values ? formik.values.telefono : ''}
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
                      label='Otros' type='text' name='otro' value={formik.values.otro}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.otro && formik.touched.otro ? formik.errors.otro : null}
                    />
                    <CustomSelect
                      name='Departamento'
                      className='input'
                      onChange={value => formik.setFieldValue('departamento', value.value)}
                      value={formik.values.departamento}
                      onBlur={formik.handleBlur}
                      options={optionsDepartamento}
                      label='Departamento'
                      errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}
                    />
                  </div>
                </div>
                <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                  <div className="absolute w-full total-center -top-3">
                    <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                      CONTACTOS
                    </div>
                  </div>

                  <div className='flex flex-col w-full' >
                    <table className="w-full">
                      <thead>
                        <tr className="font-medium text-teal-800">
                          <th>Nombre</th>
                          <th>Puesto</th>
                          <th>Correo</th>
                          <th>Teléfono</th>
                          <th>Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          objProveedor ?
                            objProveedor.contactos.map((c, i) => <tr key={'C' + i} className="array-row">
                              <td>
                                <input
                                  onFocus={(e) => handleFocusContacto(e, i)}
                                  name='nombre'
                                  value={c.nombre}
                                  onChange={(e) => handleChangeContacto(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusContacto(e, i)}
                                  name='puesto'
                                  value={c.puesto}
                                  onChange={(e) => handleChangeContacto(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusContacto(e, i)}
                                  name='correo'
                                  value={c.correo}
                                  onChange={(e) => handleChangeContacto(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="email" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusContacto(e, i)}
                                  name='telefono'
                                  value={c.telefono}
                                  onChange={(e) => handleChangeContacto(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="number" />
                              </td>
                              <td>
                                <input
                                  onFocus={(e) => handleFocusContacto(e, i)}
                                  name='nota'
                                  value={c.nota}
                                  onChange={(e) => handleChangeContacto(e, i)}
                                  className="flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500"
                                  type="text" />
                              </td>
                              <td>
                                <button
                                  onClick={(e) => handleDeleteContacto(e, i)}
                                  className="p-1 opacity-0 trash-button rounded-md">
                                  <ICONS.Trash />
                                </button>
                              </td>
                            </tr>)
                            : null}
                      </tbody>
                    </table>
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
export default FrmProveedores