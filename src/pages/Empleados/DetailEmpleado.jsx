import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useEmpleados } from "./hooks/useEmpleados";
import { ICONS } from "../../constants/icons";
import { useFormik } from "formik";
import Loader from "../../components/Loader/Loader";
import { toUrl } from "../../constants/functions";
import SelectorMaquinas from "./components/SelectorMaquinas";
import { useMaquinas } from "../Maquinas/hooks/useMaquinas";
import { useAuth } from "../../context/AuthContext";
import FieldsBox from "../../components/FieldsBox";
import Inpt from "../../components/Inputs/Inpt"
import OptsInpt from "../../components/Inputs/OptsInpt"
import Btton from "../../components/Buttons/Btton";

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
}

const optionsDepartamento = [
  { value: 'Tejido', label: 'Tejido' },
  { value: 'Corte', label: 'Corte' },
  { value: 'Plancha', label: 'Plancha' },
  { value: 'Empaque', label: 'Empaque' },
  { value: 'Transporte', label: 'Transporte' },
  { value: 'Diseno', label: 'Diseño' },
  { value: 'Calidad', label: 'Calidad' },
  { value: 'Gerencia', label: 'Gerencia' }
]

const optionsEstado = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' }
]

const DetailEmpleado = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const { notify } = useAuth()
  const isEdit = (id !== '0')
  const [saving, setSaving] = useState(false)
  const [assignedMaquinas, setAssignedMaquinas] = useState([])
  const [theresChanges, setTheresChanges] = useState(false)
  const [theresMaquinasChanges, setTheresMaquinasChanges] = useState(false)

  const {
    getEmpleado,
    postEmpleado,
    assignMaquinas,
    loading
  } = useEmpleados()

  const {
    allMaquinas,
    refreshMaquinas,
    loading: loadingMaquinas,
  } = useMaquinas()

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
    initialValues: null,
    validate,
    onSubmit: async (values) => {

      try {
        setSaving(true)
        let idEmpleado = id !== '0' ? Number(id) : null
        if (theresChanges) {
          const { empleado: empleadoResponse, message } = await postEmpleado(values, isEdit ? 'PUT' : 'POST')
          idEmpleado = empleadoResponse.idEmpleado
          notify(message)
        }
        if (theresMaquinasChanges) {
          const { message: messageMaquinas } = await assignMaquinas({
            idEmpleado: idEmpleado,
            maquinasIds: assignedMaquinas.map(m => ({ id: m.idMaquina }))
          })
          notify(messageMaquinas)
        }
        navigate('/empleados/')
      } catch (e) {
        notify(e.message, true)
      } finally {
        setSaving(false)
      }
    },
  });

  useEffect(async () => {
    formik.setValues(id !== '0' ? await getEmpleado(id) : initobj)
    refreshMaquinas()
  }, [id])

  const handleSelectImage = (e) => {
    formik.setValues(prev => ({ ...prev, fotografia: e.target.files[0] }))
    setTheresChanges(true)
  }

  const handleChange = (e) => {
    formik.handleChange(e)
    setTheresChanges(true)
  }

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 bg-slate-100">
          {/**
           * HEADER
           */}
          <div className="flex justify-between pb-4 ">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/empleados')}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {isEdit ? `Detalles del Empleado` : "Nuevo Empleado"}
              </p>
            </div>
            <div>
              <Btton
                disabled={(!theresChanges && !theresMaquinasChanges)}
                className="h-10 px-8"
                type="submit"
                form="frmEmpleados"
              >
                {isEdit ? "Guardar" : "Agregar"}
              </Btton>

            </div>
          </div>
          <div className="relative flex flex-col h-full bg-white rounded-t-lg shadow-lg">
            <div className='flex flex-col w-full h-full '>
              <div className="flex w-full h-full ">
                {formik.values === null ? <Loader /> :
                  <form
                    id='frmEmpleados'
                    className='relative flex flex-col w-full h-full overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute flex flex-col w-full px-4">


                      <div className="flex w-full ">
                        {/**
                         * FOTOGRAFIA
                         */}

                        <div className='flex flex-row w-full h-full pt-4 pb-6 total-center'>
                          <div className="relative bg-gray-100 rounded-full total-center w-28 h-28">
                            {(toUrl(formik?.values?.fotografia) !== null) ?
                              <img
                                className='object-cover foto'
                                src={toUrl(formik?.values?.fotografia)}
                                alt='' />
                              : <ICONS.Person className='text-gray-500' size='90px' />
                            }
                            <input id='file' type="file" name='fotografia' accept='image/*'
                              onChange={handleSelectImage} className='hidden' />
                            <label
                              className='absolute -bottom-1.5 -right-1.5 p-2 text-white normal-button rounded-full'
                              htmlFor='file' >
                              <ICONS.Upload style={{ color: 'white' }} size='18px' />
                            </label>
                          </div>
                        </div>

                      </div>

                      <div className="flex flex-col w-full">
                        {/**
                         * DATOS PERSONALES
                         */}
                        <div className="flex w-full ">
                          <FieldsBox title="Datos personales">
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Nombre(s)"
                                name="nombre"
                                formik={formik}
                                type="text"
                              />
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Apellidos(s)"
                                name="apellidos"
                                formik={formik}
                                type="text"
                              />

                            </div>
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Dirección"
                                name="direccion"
                                formik={formik}
                                type="text"
                                Icon={ICONS.House}
                              />
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Teléfono"
                                name="telefono"
                                formik={formik}
                                type="number"
                                Icon={ICONS.Phone}
                              />

                            </div>
                          </FieldsBox>
                        </div>
                        {/**
                         * DATOS DEL EMPLEADO
                         */}
                        <div className="flex w-full">
                          <FieldsBox title="Datos del empleado">
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label='Fec. de Contratación'
                                name='fechaEntrada'
                                formik={formik}
                                type='date'
                              />
                              <OptsInpt
                                label="Departamento"
                                name="departamento"
                                formik={formik}
                                options={optionsDepartamento}
                                placeholder="Seleccione"
                                fieldChange={() => setTheresChanges(true)}
                              />
                              <OptsInpt
                                label="Estado"
                                name="is_active"
                                formik={formik}
                                options={optionsEstado}
                                placeholder="Seleccione"
                                fieldChange={() => setTheresChanges(true)}
                              />

                            </div>
                            <div className='flex flex-row gap-6'>
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Fec. de registro en el seguro"
                                name="fechaAltaSeguro"
                                formik={formik}
                                type="date"
                              />
                              <Inpt
                                onKeyDown={() => setTheresChanges(true)}
                                label="Seguro social"
                                name="ns"
                                formik={formik}
                                type="number"
                                Icon={ICONS.Add}
                              />
                            </div>
                          </FieldsBox>
                        </div>
                      </div>

                      <div className="flex w-full">
                        <FieldsBox title="Máquinas" className="h-80">
                          {
                            <SelectorMaquinas
                              idEmpleado={id}
                              allMaquinas={allMaquinas}
                              assignedMaquinas={assignedMaquinas}
                              setAssignedMaquinas={setAssignedMaquinas}
                              setTheresChanges={setTheresMaquinasChanges}
                              departamentoEmpleado={formik.values.departamento}
                            />
                          }
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
export default DetailEmpleado
