import { useEffect, useRef } from "react"
import { useState } from "react"
import { sleep } from "../../../constants/functions"
import { useFormik } from "formik"
import FormReposicion from "./FormReposicion"
import { useEmpleados } from "../../Empleados/hooks/useEmpleados"
import Loader from "../../../components/Loader/Loader"
import { useMaquinas } from "../../Maquinas/hooks/useMaquinas"
import { usePedidos } from "../hooks/usePedidos"
import { useAuth } from "../../../context/AuthContext"
import { ICONS } from "../../../constants/icons"
import Table from "../../../components/Table"

const ReposicionesCrud = ({ produccion }) => {

    const { notify } = useAuth()

    const { allEmpleados, refreshEmpleados, loading } = useEmpleados()
    const { allMaquinas, refreshMaquinas, loading: loadingMaquinas } = useMaquinas()
    const { saveReposicion, getReposiciones } = usePedidos()
    const [reposiciones, setReposiciones] = useState([])
    const [fetching, setFetching] = useState(true)

    const [saving, setSaving] = useState(false)

    async function fetchReposiciones() {
        try {
            setFetching(true)
            let reposiciones = await getReposiciones(produccion)
            setReposiciones(reposiciones)
        } catch (e) {
            notify(e.message, true)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        refreshEmpleados()
        refreshMaquinas()
        fetchReposiciones()
    }, [])

    const [leftShow, setLeftShow] = useState(false)
    const leftRef = useRef(null)

    const openSlider = async () => {
        setLeftShow(prev => !prev)
        await sleep(120)
        leftRef.current.classList.toggle('visible')
    }

    const closeSlider = async () => {
        leftRef.current.classList.toggle('visible')
        await sleep(250)
        setLeftShow(prev => !prev)
    }

    const validate = values => {
        const errors = {}
        if (values.cantidad && !values.cantidad) {
            errors.cantidad = "Requerido"
        }
        if (values.motivos && values.motivos === "") {
            errors.motivos = "Requerido"
        }
        if (values.empleadoFalla===-1) {
            errors.empleadoFalla = "Requerido"
        }
        if (!values.empleadoReponedor) {
            errors.empleadoReponedor = "Requerido"
        }
        if (values.maquina===-1) {
            errors.maquina = "Requerido"
        }
        return errors
    }

    let initValues = {
        cantidad: null,
        motivos: "",
        empleadoFalla: null,
        empleadoReponedor: null,
        maquina: null,
        produccion: produccion
    }
    const formik = useFormik({
        initialValues: initValues,
        validate,
        onSubmit: async (values) => {
            try {
                setSaving(true)
                let { message, reposiciones } = await saveReposicion(values)
                setReposiciones(reposiciones)
                //console.log(reposiciones)
                formik.setValues(initValues)
                closeSlider()
                notify(message)
            } catch (e) {

            } finally {
                setSaving(false)
            }
            console.log(values)
        }
    })

    return (
        <div className="flex flex-1">
            {/* leftSide */}
            <div className={(leftShow ? "w-1/2 " : "w-10 ") + " relative duration-500 h-full flex "}>
                <div className={"flex h-full w-full relative "}>
                    <div ref={leftRef} className="h-full w-full modal ">
                        {loading || loadingMaquinas ? <Loader /> :
                            <FormReposicion
                                formik={formik}
                                empleados={allEmpleados}
                                maquinas={allMaquinas}
                                saving={saving}
                            />}
                    </div>
                </div>
                <button
                    onClick={leftShow ? closeSlider : openSlider}
                    className={"absolute total-center top-0 h-8 w-8 rounded-md " + (!leftShow ? "normal-button" : "neutral-button")}>
                    {!leftShow ?
                        <ICONS.Plus size="20px" />
                        :
                        <ICONS.Left size="23px" />}
                </button>
            </div>
            {/* RightSide */}
            <div className="flex flex-1">
                {fetching ? <Loader /> :
                    <div className="flex  flex-1 relative">
                        <div className="absolute w-full h-full">
                            <Table
                                data={reposiciones}
                                columns={[
                                    { label: 'ID', atr: 'indx' },
                                    { label: 'Cantidad', atr: 'cantidad' },
                                    { label: 'Motivos', atr: 'motivos' },
                                    { label: 'Falla', atr: 'empleadoFalla' },
                                    { label: 'Reponedor', atr: 'empleadoReponedor' },
                                    { label: 'Maquina', atr: 'maquina' },
                                    { label: 'Fecha', atr: 'fecha' },
                                ]}
                                unique={"indx"}
                            />

                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default ReposicionesCrud