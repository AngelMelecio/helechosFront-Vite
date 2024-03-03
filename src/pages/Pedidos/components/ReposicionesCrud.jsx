import { useEffect, useRef } from "react"
import { useState } from "react"
import { FormikProvider, useFormik } from "formik"
import FormReposicion from "./FormReposicion"
import { useEmpleados } from "../../Empleados/hooks/useEmpleados"
import { useMaquinas } from "../../Maquinas/hooks/useMaquinas"
import { usePedidos } from "../hooks/usePedidos"
import { useAuth } from "../../../context/AuthContext"

const ReposicionesCrud = ({ etiquetas, allDetalles, onSubmitted }) => {

    const { notify } = useAuth()

    const { allEmpleados, refreshEmpleados, loading } = useEmpleados()
    const { allMaquinas, refreshMaquinas, loading: loadingMaquinas } = useMaquinas()
    const { saveReposicionOrExtra } = usePedidos()
    const [empleadosFallasOpts, setEmpleadosFallasOpts] = useState([])
    const [maquinasOptions, setMaquinasOptions] = useState([])
    const [etiquetasOpts, setEtiquetasOpts] = useState([])
    const turnoOptions = [
        { value: 'Mañana', label: 'Mañana' },
        { value: 'Tarde', label: 'Tarde' },
    ]

    const [saving, setSaving] = useState(false)

    const validate = values => {
        const errors = {}
        if (!values.cantidad) {
            errors.cantidad = 'Requerido'
        }
        if (values.esReposicion === true) {
            if (!values.empleadoFalla) {
                errors.empleadoFalla = 'Requerido'
            }
            if (!values.turno) {
                errors.turno = 'Requerido'
            }
        }
        return errors
    }
    let initValues = {
        cantidad: null,
        motivos: "",
        empleadoFalla: null,
        maquina: null,
        esReposicion: false,
        etiqueta: null,
        turno: null,
    }
    const formik = useFormik({
        initialValues: initValues,
        validate,
        onSubmit: async (values) => {
            try {
                setSaving(true)
                let { message } = await saveReposicionOrExtra(values)
                formik.setValues(initValues)
                onSubmitted()
                notify(message)
            } catch (e) {
                notify(e.message + "", true)
            } finally {
                setSaving(false)
            }
        }
    })

    useEffect(() => {
        refreshEmpleados()
        refreshMaquinas()
    }, [])

    // Settear las opciones para empleados 
    useEffect(() => {
        setEmpleadosFallasOpts(allEmpleados.map(item => ({
            value: item.idEmpleado,
            label: item.nombre + " " + item.apellidos
        })))
    }, [allEmpleados])

    // settear las opciones para maquinas
    useEffect(() => {
        let dpto_falla = allEmpleados.find(e => e.idEmpleado === formik.values.empleadoFalla)?.departamento
        setMaquinasOptions([{ value: null, label: "No aplica" },
        ...(allMaquinas.filter(m => m.departamento === dpto_falla)
            .map(item => ({
                value: item.idMaquina,
                label: "L" + item.linea + " - " + "M" + item.numero,
            }))
        )])
    }, [formik.values.empleadoFalla])

    // settear las opciones para etiquetas
    useEffect(() => {
        setEtiquetasOpts(etiquetas.map(et => ({
            value: et.idProduccion,
            label: et.numEtiqueta + " - Talla: " + et.talla
        })))
    }, [etiquetas])


    return (
        <FormikProvider value={formik}>
            <form className="flex flex-col h-full overflow-y-hidden" onSubmit={formik.handleSubmit} action="">

                <input
                    value="Guardar"
                    type="submit"
                    className="absolute flex h-8 px-5 rounded-md focus:outline-none right-2 top-2 normal-button"
                />

                <div className="flex flex-col h-14 total-center">
                    <h1 className="text-xl font-bold text-teal-800/80">
                        {formik?.values.esReposicion ? 'Reposición' : 'Producción extra'}
                    </h1>
                </div>

                <FormReposicion
                    formik={formik}
                    etiquetasOpts={etiquetasOpts}
                    empleadosFallasOpts={empleadosFallasOpts}
                    maquinasOptions={maquinasOptions}
                    turnoOptions={turnoOptions}
                    allDetalles={allDetalles}
                    empleados={allEmpleados}
                    maquinas={allMaquinas}
                    saving={saving}
                />
            </form>
        </FormikProvider>
    )
}
export default ReposicionesCrud