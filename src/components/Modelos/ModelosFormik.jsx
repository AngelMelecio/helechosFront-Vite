import { useFormik } from "formik";
import { useApp } from "../../context/AppContext";
import CustomSelect from "../CustomSelect";
import Input from "../Input";
import { useState } from "react";

const ModelosFormik = ({
  Modelo,
  isEdit,
  clientesOptions,
  onCloseModal
}) => {

  const {saveModelo, getModelos } = useApp()
  const [saving, setSaving] = useState(false)


  const handleSaveModelo = async (values) => {
    setSaving(true)
    await saveModelo(values, isEdit)
    await getModelos()
    onCloseModal()
    setSaving(false)
  }

  const validate = values => {
    const errors = {}
    if (!values.nombre) {
      errors.nombre = 'Ingresa un nombre para el modelo';
    }

    if (!values.idCliente) {
      errors.idCliente = 'Selecciona un cliente';
    }
    else if (values.idCliente === "Seleccione") {
      errors.idCliente = 'Selecciona un cliente';
    }
    return errors
  }

  const modeloFormik = useFormik({
    initialValues: Modelo,
    validate,
    onSubmit: values => {
      handleSaveModelo(values)
      //console.log('quiero mandar modelo', values)
    }
  })

  return (
    <form id='frmModelos' onSubmit={modeloFormik.handleSubmit} className="shadow-md px-7 py-4 flex flex-col">
      <input
        disabled={saving}
        className='py-1 px-5 mr-2 text-white normal-button self-end rounded-lg'
        type="submit"
        value={isEdit ? "GUARDAR MODELO" : "AGREGAR MODELO"}
        form="frmModelos"
      />
      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
        <div className="absolute w-full total-center -top-3">
          <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
            DATOS DEL MODELO
          </div>
        </div>
        <div className='flex flex-row w-full'>
          <Input
            label='Nombre del modelo' type='text' name='nombre' value={modeloFormik.values.nombre}
            onChange={modeloFormik.handleChange} onBlur={modeloFormik.handleBlur}
            errores={modeloFormik.errors.nombre && modeloFormik.touched.nombre ? modeloFormik.errors.nombre : null}
          />
          <CustomSelect
            name='idCliente'
            className='input z-[100]'
            onChange={value => modeloFormik.setFieldValue('idCliente', value.value)}
            value={modeloFormik.values.idCliente}
            onBlur={modeloFormik.handleBlur}
            options={clientesOptions}
            label='Cliente'
            errores={modeloFormik.errors.idCliente && modeloFormik.touched.idCliente ? modeloFormik.errors.idCliente : null}
          />
        </div>
      </div>
    </form>
  )
}

export default ModelosFormik