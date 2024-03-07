import { useNavigate, useParams } from "react-router-dom";
import { useMaquinas } from "./hooks/useMaquinas";
import { ICONS } from "../../constants/icons";
import { useFormik } from "formik";
import Loader from "../../components/Loader/Loader";
import { useEffect } from "react";
import { useState } from "react";
import FieldsBox from "../../components/FieldsBox";
import Btton from "../../components/Buttons/Btton";
import OptsInpt from "../../components/Inputs/OptsInpt";
import Inpt from "../../components/Inputs/Inpt";

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
      //console.log("Error en Detalles de Maquina", e)
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
      <div className="relative w-full overflow-hidden">
        <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 bg-slate-100">
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/maquinas')}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {isEdit ? `Detalles de la máquina` : "Nueva máquina"}
              </p>
            </div>

            <Btton
              disabled={loading || !theresChanges}
              className={'h-10 px-8'}
              type="submit"
              form="frmMaquinas"
            >
              {isEdit ? "Guardar" : "Agregar"}
            </Btton>


          </div>
          <div className="relative flex flex-col h-full bg-white rounded-t-lg shadow-lg">
            <div className='flex flex-col w-full h-full '>
              <div className="flex w-full h-full ">
                {formik?.values === null ? <Loader /> :
                  <form
                    id='frmMaquinas'
                    className='relative flex flex-col w-full h-full overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute flex flex-col w-full p-4">

                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="relative flex items-center justify-center w-full text-center">
                          <ICONS.Machine className='text-teal-800/80' size='100px' />
                        </div>
                      </div>

                      <div className="flex w-full">
                        <FieldsBox title="Datos de la máquina">
                          <div className='flex flex-row gap-6'>
                            <OptsInpt
                              label="Línea"
                              name="linea"
                              formik={formik}
                              options={optionsLinea}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder="Seleccione"
                            />
                            <Inpt
                              label="Número"
                              name="numero"
                              formik={formik}
                              type="number"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                            <OptsInpt
                              label="Departamento"
                              name="departamento"
                              formik={formik}
                              options={optionsDepartamento}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder="Seleccione"
                            />

                          </div>
                          <div className='flex flex-row gap-6'>
                            <Inpt
                              label="Marca"
                              name="marca"
                              formik={formik}
                              type="text"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                            <Inpt
                              label="Modelo"
                              name="modelo"
                              formik={formik}
                              type="text"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                            <Inpt
                              label="Número de serie"
                              name="ns"
                              formik={formik}
                              type="text"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                          </div>
                        </FieldsBox>
                      </div>
                      <div className="flex w-full">
                        <FieldsBox title="Información adicional">
                          <div className='flex flex-row'>
                            <Inpt
                              label="Otros"
                              name="otros"
                              formik={formik}
                              type="text"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                          </div>
                          <div className='flex flex-row gap-6'>
                            <Inpt
                              label="Fecha de adquisición"
                              name="fechaAdquisicion"
                              formik={formik}
                              type="date"
                              onKeyDown={() => setTheresChanges(true)}
                            />
                            <Inpt
                              label="Infromación extra de adquisición"
                              name="detalleAdquisicion"
                              formik={formik}
                              type="text"
                              onKeyDown={() => setTheresChanges(true)}
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
export default DetailMaquina