import { useFormik } from "formik"
import { useState } from "react"
import useModelos from "../hooks/useModelos"
import { useEffect } from "react"
import { useClientes } from "../../Clientes/hooks/useClientes"
import { useNavigate } from "react-router-dom"
import { useDetailModelos } from "../hooks/useDetailModelos"
import FieldsBox from "../../../components/FieldsBox"
import Inpt from "../../../components/Inputs/Inpt"
import OptsInpt from "../../../components/Inputs/OptsInpt"

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

  useEffect(() => {
    modeloFormik.setValues(modelo)
  }, [modelo])

  useEffect(() => {
    if (allClientes.length === 0) return
    setClientesOptions(allClientes.map(
      c => ({ value: c.idCliente.toString(), label: c.nombre })
    ))
  }, [allClientes])

  const handleChange = (e) => {
    modeloFormik.setFieldValue(e.target.name, e.target.value)
    setTheresChangesModelo(true)
  }

  return (
    <form
      id='frmModelos'
      onSubmit={modeloFormik.handleSubmit}
      className="flex flex-col py-4 xl:px-32 px-7">
      <div className="flex w-full">
        <FieldsBox title="Datos del modelo">
          <div className='flex flex-row w-full gap-6'>
            <Inpt
              label="Nombre del modelo"
              name="nombre"
              type="text"
              formik={modeloFormik}
              onKeyDown={() => setTheresChangesModelo(true)}
            />
            <OptsInpt
              label="Cliente"
              name="idCliente"
              formik={modeloFormik}
              options={clientesOptions}
              fieldChange={() => setTheresChangesModelo(true)}
              placeholder="Seleccione"
            />

          </div>
        </FieldsBox>
      </div>
    </form>
  )
}
export default FrmModelos