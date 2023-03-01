import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import Input from '../components/Input'
import SelectorMaquinas from '../components/SelectorMaquinas'
import { useFormik } from 'formik'

import { ICONS } from '../constants/icons'
import CustomSelect from '../components/CustomSelect'
import Table from '../components/Table'
import { useApp } from '../context/AppContext'
import { AiOutlineConsoleSql } from 'react-icons/ai'
import { useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const initobj = {
  idEmpleado: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  ns: "",
  fechaEntrada: null,
  fechaAltaSeguro: null,
  is_active: true,
  fotografia: "",
  departamento: "Seleccione",
}

const initErrors = {}

const PaginaEmpleados = () => {

  /*  const {
      fetchingEmpleados,
      empleadosColumns,
      getEmpleados,
      allEmpleados,
      allMaquinas,
      getEmpleadoMaquinas
  
    } = useAdmin()*/

  const {
    getEmpleadoMaquinas,

    empleadosColumns, getEmpleados, allEmpleados, fetchingEmpleados,
    saveEmpleado, deleteEmpleados,

    getMaquinas, allMaquinas, fetchingMaquinas
  } = useApp()

  const navigate = useNavigate()

  const { session } = useAuth()

  const [objEmpleado, setObjEmpleado] = useState(initobj);
  const [saving, setSaving] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [listaEmpleados, setListaEmpleados] = useState([])
  const [availableMaquinas, setAvailableMaquinas] = useState([])
  const [assignedMaquinas, setAssignedMaquinas] = useState([])

  const [shown, setShown] = React.useState(false);
  const switchShown = () => setShown(!shown);

  //Formik
  useEffect(async () => {
    setAvailableMaquinas(await getMaquinas())
    setListaEmpleados(await getEmpleados())
  }, [])

  //Formik
  //Options select
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


  //Validaciones
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

    /*if (!values.ns) {
      errors.ns = 'Ingresa el NSS';
    } else if (values.ns.toString().length !== 11) {
      errors.ns = 'NSS incorrecto';
    }*/

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
  //Declaración
  const formik = useFormik({
    initialValues: initobj,
    validate,
    onSubmit: values => {
      handleSaveEmpleado(values);
    },
  });

  const handleSaveEmpleado = async (values) => {
    setSaving(true)

    await saveEmpleado(values, objEmpleado, assignedMaquinas, isEdit)
    setListaEmpleados(await getEmpleados())
    setObjEmpleado(initobj)
    handleModalVisibility(false, false)

    setSaving(false)
  }

  const handleDeleteEmpleados = async () => {
    setSaving(true)

    await deleteEmpleados(listaEmpleados)
    let newList = await getEmpleados()
    setListaEmpleados(newList)
    handleModalDeleteVisibility(false)

    setSaving(false)
    //window.location.reload()
  }



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
      setObjEmpleado(initobj)
      if (show) {
        setAvailableMaquinas(allMaquinas)
        setAssignedMaquinas([])
      }
    }
  }

  const handleSelectImage = (e) => {
    setObjEmpleado({ ...objEmpleado, fotografia: e.target.files[0] })
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

  const handleEdit = async (emp) => {

    const assigned = await getEmpleadoMaquinas(emp.idEmpleado)
    const maquinasIds = assigned.message ? [] : assigned.map(a => a.idMaquina)
    let newAvailable = []
    let newAssigned = []
    allMaquinas.forEach(m => {
      if (maquinasIds.includes(m.idMaquina))
        newAssigned.push({ ...m, isChecked: false })
      else
        newAvailable.push({ ...m, isChecked: false })
    })

    setAssignedMaquinas(newAssigned)
    setAvailableMaquinas(newAvailable)
    formik.setValues(emp)
    handleModalVisibility(true, true)
    setIsEdit(true)
    setObjEmpleado(emp)
  }

  const toUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    if (file === '') return null
    return file
  }

  return (
    <>
      <Table
        allItems={allEmpleados}
        visibleItems={listaEmpleados}
        setVisibleItems={setListaEmpleados}
        columns={empleadosColumns}
        onAdd={() => handleModalVisibility(true, false)}
        onDelete={() => { handleModalDeleteVisibility(true) }}
        onEdit={handleEdit}
      />
      {
        //modalDeleteVisible ?
        <DeleteModal
          onCancel={() => handleModalDeleteVisibility(false)}
          onConfirm={handleDeleteEmpleados}
          elements={listaEmpleados}
          representation={['nombre', 'apellidos']}
          message='Los siguientes empleados se eliminarán permanentemente:'
        />
        //  : null
      }
      {
        //modalVisible ?
        <div id="form-modal" name="form-modal"
          className='modal z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
          <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
            <div className='w-full flex h-full flex-col '>
              <div className="z-10 py-2 px-4 flex w-full shadow-md ">
                <div className="flex flex-row w-full total-center relative h-10">
                  {isEdit
                    ? <ICONS.UserEdit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                    : <ICONS.PersonPlus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                  }
                  <p className='font-semibold text-teal-800 text-2xl' >
                    {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
                  </p>
                  <input
                    disabled={saving}
                    className='bg-teal-500 p-1 w-40 text-white normalButton absolute right-0 rounded-lg'
                    type="submit"
                    value={isEdit ? "GUARDAR" : "AGREGAR"}
                    form="frmEmpleados"
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
                <form
                  id='frmEmpleados'
                  className='flex flex-col h-full w-full relative overflow-y-scroll'
                  onSubmit={formik.handleSubmit}>
                  <div className="absolute w-full flex flex-col  px-4">
                    <div className='flex flex-row w-full h-full p-2 total-center'>
                      <div className="flex relative w-full items-center justify-center foto text-center">
                        { /* Imagen del Empleado */}
                        {(toUrl(objEmpleado?.fotografia) !== null) ? <img
                          className='object-cover foto'
                          src={toUrl(objEmpleado?.fotografia)}
                          alt='' /> 
                          : <ICONS.Person className='' size='80px' style={{ color: '#115e59' }} />}
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
                          label='Dirección' type='text' name='direccion' value={formik.values.direccion}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.direccion && formik.touched.direccion ? formik.errors.direccion : null}
                          Icon={ICONS.House}
                        />
                        <Input
                          label='Teléfono' type='number' name='telefono' value={formik.values.telefono}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : null}
                          Icon={ICONS.Phone}
                        />
                      </div>
                    </div>
                    <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                      <div className="absolute w-full total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          DATOS DEL EMPLEADO
                        </div>
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Fecha de Contratación' type='date' name='fechaEntrada' value={formik.values.fechaEntrada}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.fechaEntrada && formik.touched.fechaEntrada ? formik.errors.fechaEntrada : null}
                        />
                        {<CustomSelect
                          name='Departamento'
                          className='input z-[100]'
                          onChange={value => formik.setFieldValue('departamento', value.value)}
                          value={formik.values.departamento}
                          onBlur={formik.handleBlur}
                          options={optionsDepartamento}
                          label='Departamento'
                          errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}

                        />}
                        {<CustomSelect
                          name='Estado'
                          className='input z-[100]'
                          onChange={value => formik.setFieldValue('is_active', value.value === 'Activo' ? true : false)}
                          value={formik.values.is_active ? 'Activo' : 'Inactivo'}
                          onBlur={formik.handleBlur}
                          options={optionsEstado}
                          label='Estado'
                          errores={formik.errors.is_active && formik.touched.is_active ? formik.errors.is_active : null}
                        />}
                      </div>
                      <div className='flex flex-row'>
                        <Input
                          label='Fecha de registro en el seguro' type='date' name='fechaAltaSeguro' value={formik.values.fechaAltaSeguro}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.fechaAltaSeguro && formik.touched.fechaAltaSeguro ? formik.errors.fechaAltaSeguro : null}
                        />
                        <Input
                          label='Seguro Social' type='number' name='ns' value={formik.values.ns}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          errores={formik.errors.ns && formik.touched.ns ? formik.errors.ns : null}
                          Icon={ICONS.Add}
                        />
                      </div>
                    </div>
                    <div className="mx-2 my-4 relative h-56 px-4 py-4 border-2 border-slate-300">
                      <div className="absolute w-full left-0 total-center -top-3">
                        <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                          MAQUINAS
                        </div>
                      </div>
                      <SelectorMaquinas
                        availableMaquinas={availableMaquinas}
                        setAvailableMaquinas={setAvailableMaquinas}
                        assignedMaquinas={assignedMaquinas}
                        setAssignedMaquinas={setAssignedMaquinas}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        //: null
      }
    </>
  )
}
export default PaginaEmpleados