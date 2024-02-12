import { useEffect, useState } from "react"
import Input from "../../components/Input";
import { useFormik } from "formik";
import CustomSelect from "../../components/CustomSelect";
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import ReporteEmpleadoModelo from "./ReporteEmpleadoModelo";
import ReporteMaquinaTurno from "./ReporteMaquinaTurno";


const PaginaReportes = () => {
    {/* States and Effects */ }

    const [solicitud, setSolicitud] = useState(null)
    const [renderTurno, setRenderTurno] = useState(false)
    const [renderModelo, setRenderModelo] = useState(false)

    useEffect(() => {
        if (solicitud) {
            if (solicitud.tipo === "Modelo") {
                setRenderModelo(true)
                setRenderTurno(false)
            } else if (solicitud.tipo === "Turno") {
                setRenderModelo(false)
                setRenderTurno(true)
            }
        }
    }, [solicitud])

    {/* Options */ }

    const optionsDepartamento = [
        { value: 'Seleccione', label: 'Seleccione' },
        { value: 'Tejido', label: 'Tejido' },
        { value: 'Plancha', label: 'Plancha' },
        { value: 'Calidad', label: 'Calidad' },
        { value: 'Corte', label: 'Corte' },
        { value: 'Empaque', label: 'Empaque' },
    ]

    const optionsTipo = [
        { value: 'Seleccione', label: 'Seleccione' },
        { value: 'Modelo', label: 'Modelo' },
        { value: 'Turno', label: 'Turno' },
    ]

    const handleChange = (e) => {
        formik.handleChange(e)
    }

    {/* Formik */ }
    const initobj = {
        tipo: "Seleccione",
        fechaInicio: null,
        fechaFinal: null,
        departamento: "Seleccione",
    }
    const validate = values => {
        const errors = {};
        if (!values.tipo) {
            errors.tipo = 'Selecciona un tipo';
        } else if (values.tipo === "Seleccione") {
            errors.tipo = 'Selecciona un tipo';
        }
        if (!values.departamento) {
            errors.departamento = 'Selecciona un departamento';
        } else if (values.departamento === "Seleccione") {
            errors.departamento = 'Selecciona un departamento';
        }
        if (!values.fechaFinal) {
            errors.fechaFinal = 'Establece la fecha final';
        }
        if (!values.fechaInicio) {
            errors.fechaInicio = 'Establece la fecha inicial';
        }
        return errors;
    };
    const formik = useFormik({
        initialValues: initobj,
        validate,
        onSubmit: (values) => setSolicitud(values),
    });

    return (
        <>
            <div className="relative flex w-full h-full pl-18 bg-slate-100">
                <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Titulo de la pagina */}
                        <div className="flex flex-row justify-between w-full pr-1">
                            <h1 className="pb-4 pl-3 text-2xl font-bold text-teal-700">Reportes de producción</h1>
                            <input
                                form="frmReportes"
                                disabled={false}
                                type="submit"
                                value="Generar"
                                className="h-8 px-6 rounded-md normal-button " />
                        </div>
                        {/* Formulario */}
                        <div className="flex flex-col w-full bg-white rounded-lg shadow-lg mb-2 mr-1.5">
                            <form
                                id='frmReportes'
                                className="flex flex-col p-4"
                                onSubmit={formik.handleSubmit}>
                                <div className="relative p-4 mx-1 my-2 border-2 border-slate-300">
                                    <div className="absolute w-full total-center -top-3">
                                        <div className='px-3 text-base italic font-bold text-teal-700 bg-white' >
                                            Datos del reporte
                                        </div>
                                    </div>
                                    <div className='flex flex-row w-full'>
                                        <CustomSelect
                                            name='tipo'
                                            onChange={value => formik.setFieldValue('tipo', value.value)}
                                            value={formik.values ? formik.values.tipo : ''}
                                            onBlur={formik.handleBlur}
                                            options={optionsTipo}
                                            label='Tipo'
                                            errores={formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : null}
                                        />
                                        <CustomSelect
                                            name='departamento'
                                            onChange={value => formik.setFieldValue('departamento', value.value)}
                                            value={formik.values ? formik.values.departamento : ''}
                                            onBlur={formik.handleBlur}
                                            options={optionsDepartamento}
                                            label='Departamento'
                                            errores={formik.errors.departamento && formik.touched.departamento ? formik.errors.departamento : null}
                                        />
                                        <Input
                                            label='Fecha inicio' type='date' name='fechaInicio' value={formik.values ? formik.values.fechaInicio : ''}
                                            onChange={handleChange} onBlur={formik.handleBlur}
                                            errores={formik.errors.fechaInicio && formik.touched.fechaInicio ? formik.errors.fechaInicio : null}
                                        />
                                        <Input
                                            label='Fecha final' type='date' name='fechaFinal' value={formik.values ? formik.values.fechaFinal : ''}
                                            onChange={handleChange} onBlur={formik.handleBlur}
                                            errores={formik.errors.fechaFinal && formik.touched.fechaFinal ? formik.errors.fechaFinal : null}
                                        />
                                    </div>

                                </div>
                            </form>
                        </div>
                        {/* Graficas */}
                        {
                            renderModelo &&
                            <ReporteEmpleadoModelo solicitud={solicitud}/>
                        }
                        {
                            renderTurno &&
                            <ReporteMaquinaTurno solicitud={solicitud} />
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default PaginaReportes