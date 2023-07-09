import { useFormik } from "formik"
import Input from "../../../components/Input"
import CustomSelect from "../../../components/CustomSelect"
import { useState } from "react"
import useModelos from "../hooks/useModelos"
import { useEffect } from "react"
import { useClientes } from "../../Clientes/hooks/useClientes"
import { useNavigate } from "react-router-dom"
import { useDetailModelos } from "../hooks/useDetailModelos"

const FrmModelos = ({
  modelo,
  isEdit,
}) => {

  const navigate = useNavigate()

  const [clientesOptions, setClientesOptions] = useState([])
  const { allClientes, refreshClientes } = useClientes()
  const { saveModelo } = useModelos()

  const {
    setTheresChangesModelo
  } = useDetailModelos()

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

  let modeloFormik = useFormik({
    initialValues: modelo,
    validate,
    onSubmit: async (values) => {
      await saveModelo({
        modelo: values,
        method: values.idModelo ? 'PUT' : 'POST'
      })
      navigate("/modelos/")
    }
  })

  useEffect(() => {
    refreshClientes()
  }, [])

  useEffect(()=>{

    modeloFormik.setValues(modelo)
  }, [modelo])

  useEffect(() => {
    let newClientesOptions = [{ value: 'Seleccione', label: 'Seleccione' }]
    allClientes.forEach(c => {
      newClientesOptions.push({ value: c.idCliente.toString(), label: c.nombre })
    })
    setClientesOptions(newClientesOptions)
  }, [allClientes])

  const handleChange = (e) => {
    modeloFormik.setFieldValue(e.target.name, e.target.value)
    setTheresChangesModelo(true)
  }

  return (
    <form
      id='frmModelos'
      onSubmit={modeloFormik.handleSubmit}
      className="xl:px-32 px-7 py-4 flex flex-col">
      {/*<input
        disabled={!theresChanges}
        className='py-1 px-5 mr-2 text-white normal-button self-end rounded-lg'
        type="submit"
        value={isEdit ? "GUARDAR MODELO" : "AGREGAR MODELO"}
        form="frmModelos"
  />*/}
      <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
        <div className="absolute w-full total-center -top-3">
          <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
            Datos del Modelo
          </div>
        </div>
        <div className='flex flex-row w-full'>
          <Input
            label='Nombre del modelo' type='text' name='nombre' value={modeloFormik.values.nombre}
            onChange={handleChange} onBlur={modeloFormik.handleBlur}
            errores={modeloFormik.errors.nombre && modeloFormik.touched.nombre ? modeloFormik.errors.nombre : null}
          />
          <CustomSelect
            name='idCliente'
            className='input z-10'
            onChange={(value) => handleChange({ target: { name: 'idCliente', value: value.value } })}
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
export default FrmModelos