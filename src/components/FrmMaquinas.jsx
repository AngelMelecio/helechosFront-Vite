import { useFormik } from "formik";
import { useState } from "react";
import { ICONS } from "../constants/icons";
import { useApp } from "../context/AppContext";
import CustomSelect from "./CustomSelect";
import Input from "./Input";

const initobj = {
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


const FrmMaquinas = ({
  isEdit,
  maquina,
  onCloseModal
}) => {

  const [saving, setSaving] = useState()
  const [objMaquina, setObjMaquina] = useState(maquina)

  const { saveMaquina, getMaquinas } = useApp()




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
  //Declaración
  const formik = useFormik({
    initialValues: maquina,
    validate,
    onSubmit: values => {
      handleSaveMaquinas(values);
    },
  });

  const handleSaveMaquinas = async (values) => {
    setSaving(true)
    await saveMaquina(values, isEdit)
    await getMaquinas()
    onCloseModal()
    setSaving(false)
  }

  return (
    <div id="form-modal-maquinas"
      className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col '>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.Edit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.Plus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />}
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Maquina' : 'Nueva Maquina'}
              </p>
              <input
                disabled={saving}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-0 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmMaquinas" />
              <button
                className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                onClick={onCloseModal}>
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
            </div>
          </div>
          <div className="flex w-full h-full ">
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
                      onChange={value => formik.setFieldValue('linea', value.value)}
                      value={formik.values.linea}
                      onBlur={formik.handleBlur}
                      options={optionsLinea}
                      label='Línea'
                    />
                    <Input
                      label='Número' type='number' name='numero' value={formik.values.numero}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.numero && formik.touched.numero ? formik.errors.numero : null}
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
                  <div className='flex flex-row'>
                    <Input
                      label='Marca' type='text' name='marca' value={formik.values.marca}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.marca && formik.touched.marca ? formik.errors.marca : null}
                    />
                    <Input
                      label='Modelo' type='text' name='modelo' value={formik.values.modelo}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.modelo && formik.touched.modelo ? formik.errors.modelo : null}
                    />
                    <Input
                      label='Número de serie' type='text' name='ns' value={formik.values.ns}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
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
                      label='Otros' type='text' name='otros' value={formik.values.otros}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.otros && formik.touched.otros ? formik.errors.otros : null}
                    />
                  </div>
                  <div className='flex flex-row'>
                    <Input
                      label='Fecha de adquisición' type='date' name='fechaAdquisicion' value={formik.values.fechaAdquisicion}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.fechaAdquisicion && formik.touched.fechaAdquisicion ? formik.errors.fechaAdquisicion : null}
                    />
                    <Input
                      label='Infromación extra de adquisición' type='text' name='detalleAdquisicion' value={formik.values.detalleAdquisicion}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.detalleAdquisicion && formik.touched.detalleAdquisicion ? formik.errors.detalleAdquisicion : null}
                    />
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

export default FrmMaquinas