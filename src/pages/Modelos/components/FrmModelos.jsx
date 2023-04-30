import { useFormik } from "formik"
import Input from "../../../components/Input"
import CustomSelect from "../../../components/CustomSelect"
import { useState } from "react"
import useModelos from "../hooks/useModelos"
import { useEffect } from "react"
import { useClientes } from "../../Clientes/hooks/useClientes"

const FrmModelos = ({ modelo, isEdit }) => {

  const [clientesOptions, setClientesOptions] = useState([])
  const { allClientes, refreshClientes } = useClientes()

  let modeloFormik = useFormik({
    initialValues: modelo,
    onSubmit: values => {
      console.log(values)
    }
  })

  useEffect(() => {
    refreshClientes()
  }, [])

  useEffect(() => {
    let newClientesOptions = [{ value: 'Seleccione', label: 'Seleccione' }]
    allClientes.forEach(c => {
      newClientesOptions.push({ value: c.idCliente.toString(), label: c.nombre })
    })
    setClientesOptions(newClientesOptions)
  }, [allClientes])

  return (
    <form 
    id='frmModelos' 
    onSubmit={modeloFormik.handleSubmit} 
    className="xl:px-32 px-7 py-4 flex flex-col">
      <input
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
            className='input z-10'
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
export default FrmModelos