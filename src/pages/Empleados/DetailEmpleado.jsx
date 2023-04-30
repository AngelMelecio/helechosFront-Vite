import { useParams, useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar"
import { useEffect } from "react";
import { useState } from "react";
import { useEmpleados } from "./hooks/useEmpleados";
import { ICONS } from "../../constants/icons";
import { useFormik } from "formik";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";

const initobj = {
  idEmpleado: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  ns: "",
  fechaEntrada: "",
  fechaAltaSeguro: "",
  is_active: true,
  fotografia: "",
  departamento: "Seleccione",
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

const optionsEstado = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' }
]

const toUrl = (file) => {

  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  if (file === '') return null
  return file
}

const DetailEmpleado = () => {

  const navigate = useNavigate()
  const { id } = useParams();

  const isEdit = (id !== '0')
  const { getEmpleado, saveEmpleado, loading } = useEmpleados()

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

    if (!values.direccion) {
      errors.direccion = 'Ingresa la dirección';
    }

    if (!values.telefono) {
      errors.telefono = 'Ingresa el telefono';
    } else if (values.telefono.toString().length !== 10) {
      errors.telefono = 'Ingresa 10 digitos';
    }

    if (!values.fechaEntrada) {
      errors.fechaEntrada = 'Establece la fecha de contratación';
    }

    if (!values.departamento) {
      errors.departamento = 'Selecciona un departamento';
    } else if (values.departamento === "Seleccione") {
      errors.departamento = 'Selecciona un departamento';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: id !== '0' ? getEmpleado(id) : initobj,
    validate,
    onSubmit: async(values) => {
      await saveEmpleado({ values: values, mauqinas:[], method: isEdit ? 'PUT' : 'POST' })
      navigate(-1)
      //handleSaveEmpleado(values);
    },
  });
  const handleSelectImage = (e) => {
    formik.setValues(prev => ({ ...prev, fotografia: e.target.files[0] }))
  }

  const handleChange = (e) =>{
    //console.log(e.target.name, e.target.value)
    formik.setFieldValue( e.target.name, e.target.value)
  }
  
  /*
  useEffect(() => {
    
    let empleado = id !== '0' ? getEmpleado(id) : initobj
    console.log( 'formik: ', empleado )
    
    //formik?.setValues(empleado)
  }, [id])*/

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute px-8 py-5">
          <div className="flex pb-4 ">
            <button
              onClick={() => navigate(-1)}
              className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
            <p className="font-bold text-3xl pl-3 text-teal-700">
              {isEdit ? `Detalles del Empleado` : "Nuevo Empleado"}
            </p>
          </div>
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <input
                disabled={loading}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-10 z-10 top-5 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmEmpleados"
              />

              <div className="flex w-full h-full ">
                {
                  <form
                    id='frmEmpleados'
                    className='flex flex-col h-full w-full relative overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute w-full flex flex-col  px-4">
                      <div className='flex flex-row w-full h-full p-7 total-center'>
                        <div className="flex relative w-full items-center justify-center foto text-center">
                          {(toUrl(formik?.values?.fotografia) !== null) ? <img
                            className='object-cover foto'
                            src={toUrl(formik?.values?.fotografia)}
                            alt='' />
                            : <ICONS.Person className='' size='80px' style={{ color: '#115e59' }} />}
                          <input id='file' type="file" name='fotografia' accept='image/*' onChange={handleSelectImage} className='inputfile' />
                          <label
                            className='absolute -bottom-2 -right-1 bg-teal-500 p-2 text-white normal-button rounded-full'
                            htmlFor='file' >
                            <ICONS.Upload style={{ color: 'white' }} size='18px' />
                          </label>
                        </div>
                      </div>
                      <div className="flex w-full flex-col xl:flex-row">
                        <div className="relative px-2 py-4 w-full border-2 mx-2 my-4 border-slate-300">
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
                              label='Dirección' type='text' name='direccion' value={formik.values ? formik.values.direccion : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                              Icon={ICONS.House}
                            />
                            <Input
                              label='Teléfono' type='number' name='telefono' value={formik.values ? formik.values.telefono : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                              Icon={ICONS.Phone}
                            />
                          </div>
                        </div>

                        <div className="relative px-2 py-4 w-full border-2 mx-2 my-4 border-slate-300">
                          <div className="absolute w-full total-center -top-3">
                            <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                              DATOS DEL EMPLEADO
                            </div>
                          </div>
                          <div className='flex flex-row'>
                            <Input
                              label='Fec. de Contratación' type='date' name='fechaEntrada' value={formik.values ? formik.values.fechaEntrada : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.fechaEntrada && formik.touched.fechaEntrada ? formik.errors.fechaEntrada : null}
                            />
                            {
                              <CustomSelect
                                name='Departamento'
                                className='input z-[100]'
                                onChange={value => formik.setFieldValue('departamento', value.value)}
                                value={formik.values ? formik.values.departamento : ''}
                                onBlur={formik.handleBlur}
                                options={optionsDepartamento}
                                label='Departamento'
                                errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}
                              />}
                            {<CustomSelect
                              name='Estado'
                              className='input z-[100]'
                              onChange={value => formik.setFieldValue('is_active', value.value === 'Activo' ? true : false)}
                              value={formik.values ? (formik.values.is_active ? 'Activo' : 'Inactivo') : ''}
                              onBlur={formik.handleBlur}
                              options={optionsEstado}
                              label='Estado'
                              errores={formik.errors.is_active && formik.touched.is_active ? formik.errors.is_active : null}
                            />}
                          </div>
                          <div className='flex flex-row'>
                            <Input
                              label='Fec. de registro en el seguro' type='date' name='fechaAltaSeguro' value={formik.values ? formik.values.fechaAltaSeguro : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.fechaAltaSeguro && formik.touched.fechaAltaSeguro ? formik.errors.fechaAltaSeguro : null}
                            />
                            <Input
                              label='Seguro Social' type='number' name='ns' value={formik.values ? formik.values.ns : ''}
                              onChange={handleChange} onBlur={formik.handleBlur}
                              errores={formik.errors.ns && formik.touched.ns ? formik.errors.ns : null}
                              Icon={ICONS.Add}
                            />
                          </div>
                        </div>

                      </div>
                      <div className="mx-2 my-4 relative h-56 px-4 py-4 border-2 border-slate-300">
                        <div className="absolute w-full left-0 total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            MAQUINAS
                          </div>
                        </div>
                        {/*<SelectorMaquinas
                          availableMaquinas={availableMaquinas}
                          setAvailableMaquinas={setAvailableMaquinas}
                          assignedMaquinas={assignedMaquinas}
                          setAssignedMaquinas={setAssignedMaquinas}
                        />*/}
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
export default DetailEmpleado