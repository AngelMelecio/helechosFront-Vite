import { useNavigate, useParams } from "react-router-dom";
import { useMaquinas } from "./hooks/useMaquinas";
import { ICONS } from "../../constants/icons";
import { useFormik } from "formik";
import Loader from "../../components/Loader/Loader";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import { useEffect } from "react";
import { useState } from "react";

const initMaquina = {
  idMaquina: "",
  numero: "",
  linea: "0",
  marca: "",
  modelo: "",
  ns: "",
  fechaAdquisicion: "",
  otros: "",
  detalleAdquisicion: "",
  departamento: "Seleccione"
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
const optionsLinea = [
  { value: '0', label: 'Ninguna' },
  { value: '1', label: 'Línea 1' },
  { value: '2', label: 'Línea 2' },
  { value: '3', label: 'Línea 3' }
]

const DetailMaquina = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')

  const [theresChanges, setTheresChanges] = useState(false)

  const {
    saveMaquina,
    loading,
    findMaquina,
    allMaquinas,
    setLoading } = useMaquinas();

  const validate = values => {
    const errors = {};

    if (!values.numero) {
      errors.numero = 'Asigna un número a la máquina';
    }

    if (!values.marca) {
      errors.marca = 'Ingresa la marca';
    }

    if (!values.modelo) {
      errors.modelo = 'Ingresa el modelo';
    }

    if (!values.ns) {
      errors.ns = 'Ingresa el número de serie';
    }

    if (!values.fechaAdquisicion) {
      errors.fechaAdquisicion = 'Ingresa la fecha de adquisición';
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
      await saveMaquina({
        values: values,
        method: isEdit ? 'PUT' : 'POST'
      })
      navigate(("/maquinas"))
    },
  });

  useEffect(() => {
    return () => setLoading(true)
  }, [])

  useEffect(async () => {
    try {
      setLoading(true)
      formik.setValues(
        id === '0' ? initMaquina :
          allMaquinas.length > 0 ? allMaquinas.find(m => m.idMaquina + '' === id) :
            await findMaquina(id)
      )
    } catch (e) {
      console.log("Error en Detalles de Maquina", e)
    } finally {
      setLoading(false)
    }
  }, [id]);

  const handleChange = (e) => {
    formik.handleChange(e)
    setTheresChanges(true)
  }

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute p-4">
          <div className="flex pb-4 justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/maquinas')}
                className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
              <p className="font-bold text-2xl pl-3 text-teal-700">
                {isEdit ? `Detalles de la máquina` : "Nueva máquina"}
              </p>
            </div>
            
              <input
                disabled={loading || !theresChanges}
                className='bg-teal-500 h-10 p-1 w-40 text-white text-md normal-button rounded-lg'
                type="submit"
                value={isEdit ? "Guardar" : "Agregar"}
                form="frmMaquinas"
              />
          
          </div>
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <div className="flex w-full h-full ">
                {formik?.values === null ? <Loader /> :
                  <form
                    id='frmMaquinas'
                    className='flex flex-col h-full w-full relative overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute w-full flex flex-col  px-4">
                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="flex relative w-full items-center justify-center text-center">
                          <ICONS.Machine className='' size='100px' style={{ color: '#115e59' }} />
                        </div>
                      </div>
                      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            DATOS MAQUINA
                          </div>
                        </div>
                        <div className='flex flex-row'>
                          <CustomSelect
                            name='Línea'
                            className='input'
                            onChange={value => {
                              formik.setFieldValue('linea', value.value)
                              setTheresChanges(true)
                            }}
                            value={formik?.values?.linea}
                            onBlur={formik.handleBlur}
                            options={optionsLinea}
                            label='Línea'
                          />
                          <Input
                            label='Número' type='number' name='numero' value={formik?.values?.numero}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.numero && formik.touched.numero ? formik.errors.numero : null}
                          />
                          <CustomSelect
                            name='Departamento'
                            className='input'
                            onChange={value => {
                              formik.setFieldValue('departamento', value.value)
                              setTheresChanges(true)
                            }}
                            value={formik?.values?.departamento}
                            onBlur={formik.handleBlur}
                            options={optionsDepartamento}
                            label='Departamento'
                            errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <Input
                            label='Marca' type='text' name='marca' value={formik?.values?.marca}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.marca && formik.touched.marca ? formik.errors.marca : null}
                          />
                          <Input
                            label='Modelo' type='text' name='modelo' value={formik?.values?.modelo}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.modelo && formik.touched.modelo ? formik.errors.modelo : null}
                          />
                          <Input
                            label='Número de serie' type='text' name='ns' value={formik?.values?.ns}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.ns && formik.touched.ns ? formik.errors.ns : null}
                          />
                        </div>
                      </div>
                      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                            INFORMACIÓN ADICIONAL
                          </div>
                        </div>
                        <div className='flex flex-row'>
                          <Input
                            label='Otros' type='text' name='otros' value={formik?.values?.otros}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.otros && formik.touched.otros ? formik.errors.otros : null}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <Input
                            label='Fecha de adquisición' type='date' name='fechaAdquisicion' value={formik?.values?.fechaAdquisicion}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.fechaAdquisicion && formik.touched.fechaAdquisicion ? formik.errors.fechaAdquisicion : null}
                          />
                          <Input
                            label='Infromación extra de adquisición' type='text' name='detalleAdquisicion' value={formik?.values?.detalleAdquisicion}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.detalleAdquisicion && formik.touched.detalleAdquisicion ? formik.errors.detalleAdquisicion : null}
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
export default DetailMaquina