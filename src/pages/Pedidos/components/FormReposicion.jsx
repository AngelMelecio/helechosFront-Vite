import { useState, useEffect, useRef } from "react"
import CustomSelect from "../../../components/CustomSelect"
import Input from "../../../components/Input"
import Textarea from "../../../components/Textarea"
import { ICONS } from "../../../constants/icons"
import { sleep } from "../../../constants/functions"
import { useAuth } from "../../../context/AuthContext"
import { FormikProvider } from "formik"

const FormReposicion = ({ formik, empleados, maquinas, saving }) => {

  const { notify } = useAuth()

  const refs = ["empleadoFalla", "empleadoReponedor"].reduce((acc, item) => {
    acc[item] = useRef(null)
    return acc
  }, {})

  const [scaning, setScaning] = useState(null)
  const [empleadosOptions, setEmpleadosOptions] = useState([])
  const [maquinasOptions, setMaquinasOptions] = useState([])

  useEffect(() => {
    setEmpleadosOptions(empleados.map(item => ({
      value: item.idEmpleado,
      label: item.nombre + " " + item.apellidos
    })))
  }, [empleados])

  useEffect(() => {
    let dpto_reponedor = empleados.find(e => e.idEmpleado === formik.values.empleadoReponedor)?.departamento
    setMaquinasOptions(
      maquinas.filter(m => m.departamento === dpto_reponedor)
        .map(item => ({
          value: item.idMaquina,
          label: "L:" + item.linea + " - " + "M:" + item.numero,
        }))
    )
  }, [formik.values.empleadoReponedor])

  function openScan(empleado) {
    setScaning(empleado)
    refs[empleado]?.current?.focus()
  }


  const onScanRead = (e) => {
    if (e.key === "Enter") {
      try {
        let objScan = {}
        try {
          objScan = JSON.parse(e.target.value)
        } catch (e) {
          throw new Error('Gafete invalido')
        }
        if (!objScan.idEmpleado)
          throw new Error('Gafete invalido')
        if (!empleados.some(e => e.idEmpleado === objScan.idEmpleado))
          throw new Error('No se encontró el empleado')

        formik.setFieldValue(e.target.name, objScan.idEmpleado)
      } catch (e) {
        notify(e + "", true)
      } finally {
        e.target.value = ""
        e.target.blur()
      }
    }
  }



  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col h-full">
        {/* Submit */}
        <div className="pb-4 ">
          <div className="flex total-center h-8 relative">
            <input
              disabled={saving}
              className="normal-button px-5 rounded-md absolute right-0 h-8 mr-4"
              type="submit" value={ saving ? "Guardando..." : "Guardar"} />
          </div>
        </div>
        {/* Formulario */}
        <div className="relative h-full overflow-y-scroll">

          <p className="text-teal-700 text-lg font-bold">Nueva Reposición</p>
          <div className="absolute w-full ">
            {/* Cantidad */}
            <div className="flex w-full">
              <Input
                label="Cantidad"
                name="cantidad"
                value={formik.values.cantidad}
                onChange={(e) => formik.setFieldValue("cantidad", Number(e.target.value) )}
                type="number"
                placeholder="Ingrese cantidad"
                errores={formik.errors.cantidad}
              />
            </div>
            {/* Motivos */}
            <div className="flex w-full">
              <Textarea
                resize="none"
                label="Motivos"
                value={formik.values.motivos}
                onChange={(e) => formik.setFieldValue("motivos", e.target.value)}
                name="motivos"
                type="text"
                placeholder="Ingrese los motivos"
                rows="5"
                errores={formik.errors.motivos}
              />
            </div>
            {/* Empleado Falla */}
            <div className="flex w-full">
              <CustomSelect
                options={empleadosOptions}
                value={formik.values.empleadoFalla}
                onChange={(e) => formik.setFieldValue("empleadoFalla", e.value)}
                label="Empleado Falla"
                errores={formik.errors.empleadoFalla}
              />
              <div className={( formik.errors.empleadoFalla ? "mb-[24px]" : "" )+" self-end relative mr-2"}>
                <button
                  type="button"
                  onClick={() => openScan("empleadoFalla")}
                  className={(scaning === "empleadoFalla" ? "text-teal-700 scan-icon pointer-events-none" : "normal-button") + " relative w-10 h-10 total-center rounded-md"}>
                  <ICONS.Qr size="28px" />
                </button>
                <input
                  ref={refs["empleadoFalla"]}
                  name="empleadoFalla"
                  onBlur={() => setScaning(null)}
                  type="text"
                  className="absolute flex w-0"
                  onKeyDown={onScanRead}
                />
              </div>
            </div>
            {/* Empleado Repositor */}
            <div className="flex w-full">
              <CustomSelect
                options={empleadosOptions}
                value={formik.values.empleadoReponedor}
                onChange={(e) => formik.setFieldValue("empleadoReponedor", e.value)}
                label="Empleado Repositor"
                errores={formik.errors.empleadoReponedor}
              />
              <div className={( formik.errors.empleadoReponedor ? "mb-[24px]" : "" )+" self-end relative mr-2"}>
                <button
                  onClick={() => openScan("empleadoReponedor")}
                  className={(scaning === "empleadoReponedor" ? "text-teal-700 scan-icon pointer-events-none" : "normal-button") + " relative w-10 h-10 total-center rounded-md"}>
                  <ICONS.Qr size="28px" />
                </button>
                <input
                  ref={refs['empleadoReponedor']}
                  name="empleadoReponedor"
                  onBlur={() => setScaning(null)}
                  type="text"
                  className="absolute flex w-0"
                  onKeyDown={onScanRead} />
              </div>

            </div>
            {/* Maquina Repositor */}
            <div className="flex w-full">
              <CustomSelect
                label="Maquina Repositor"
                options={maquinasOptions}
                value={formik.values.maquina}
                onChange={(e) => formik.setFieldValue("maquina", e.value)}
                errores={formik.errors.maquina}
              />
            </div>
          </div>

        </div>
      </form>

    </FormikProvider>
  )
}

export default FormReposicion