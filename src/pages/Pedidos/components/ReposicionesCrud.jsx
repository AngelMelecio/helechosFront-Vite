import { useEffect, useRef } from "react"
import { useState } from "react"
import { sleep } from "../../../constants/functions"
import { FormikProvider, useFormik } from "formik"
import FormReposicion from "./FormReposicion"
import { useEmpleados } from "../../Empleados/hooks/useEmpleados"
import Loader from "../../../components/Loader/Loader"
import { useMaquinas } from "../../Maquinas/hooks/useMaquinas"
import { usePedidos } from "../hooks/usePedidos"
import { useAuth } from "../../../context/AuthContext"

const ReposicionesCrud = ({ produccion, etiquetas, allDetalles }) => {

    const { notify } = useAuth()

    const { allEmpleados, refreshEmpleados, loading } = useEmpleados()
    const { allMaquinas, refreshMaquinas, loading: loadingMaquinas } = useMaquinas()
    const { saveReposicion, getReposiciones } = usePedidos()

    const [empleadosFallasOpts, setEmpleadosFallasOpts] = useState([])
    const [maquinasOptions, setMaquinasOptions] = useState([])
    const [etiquetasOpts, setEtiquetasOpts] = useState([])

    const [saving, setSaving] = useState(false)


    const validate = values => {
        const errors = {}
        /*if (values.cantidad && !values.cantidad) {
            errors.cantidad = "Requerido"
        }
        if (values.motivos && values.motivos === "") {
            errors.motivos = "Requerido"
        }
        if (values.empleadoFalla === -1) {
            errors.empleadoFalla = "Requerido"
        }
        if (values.maquina === -1) {
            errors.maquina = "Requerido"
        }*/
        return errors
    }

    let initValues = {
        cantidad: null,
        motivos: "",
        empleadoFalla: null,
        maquina: null,
        produccion: produccion
    }
    const formik = useFormik({
        initialValues: initValues,
        validate,
        onSubmit: async (values) => {
            try {
                setSaving(true)
                console.log(values)
                //let { message, reposiciones } = await saveReposicion(values)
                //console.log(reposiciones)
                formik.setValues(initValues)

                //notify(message)
            } catch (e) {

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

                <input value="Guardar" type="submit" className="absolute flex h-8 px-5 rounded-md focus:outline-none right-2 top-2 normal-button" />

                <div className="flex flex-col h-14 total-center">
                    <h1 className="text-xl font-bold text-teal-700">
                        Produccion Extra
                    </h1>
                </div>

                <FormReposicion
                    formik={formik}
                    etiquetasOpts={etiquetasOpts}
                    empleadosFallasOpts={empleadosFallasOpts}
                    maquinasOptions={maquinasOptions}
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