import { useEffect, useRef, useState } from "react"
import { useFormik } from "formik";
import ReporteEmpleadoModelo from "./ReporteEmpleadoModelo";
import ReporteMaquinaTurno from "./ReporteMaquinaTurno";
import AbsScroll from "../../components/AbsScroll"
import Modal from "../../components/Modal";
import { sleep } from "../../constants/functions";

import Inpt from '../../components/Inputs/Inpt'
import OptsInpt from '../../components/Inputs/OptsInpt'
import FieldsBox from "../../components/FieldsBox";

const PaginaReportes = () => {
    {/* States and Effects */ }

    const screenRef = useRef()

    const [solicitud, setSolicitud] = useState(null)
    const [renderTurno, setRenderTurno] = useState(false)
    const [renderModelo, setRenderModelo] = useState(false)

    const modalContainerRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);

    const [modalComponent, setModalComponent] = useState(null)

    const handleOpenModal = async (setState) => {
        setState(true)
        await sleep(150)
        document.getElementById("tbl-page").classList.add('blurred')
        modalContainerRef.current.classList.add('visible')
    }
    const handleCloseModal = async (setState) => {
        modalContainerRef.current.classList.remove('visible')
        document.getElementById("tbl-page").classList.remove('blurred')
        await sleep(150)
        setState(false)
    }

    useEffect(() => {
        if (modalVisible) handleOpenModal(setModalVisible)
    }, [modalVisible])


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
        { value: 'Tejido', label: 'Tejido' },
        { value: 'Plancha', label: 'Plancha' },
        { value: 'Calidad', label: 'Calidad' },
        { value: 'Corte', label: 'Corte' },
        { value: 'Empaque', label: 'Empaque' },
    ]

    const optionsTipo = [
        { value: 'Modelo', label: 'Modelo' },
        { value: 'Turno', label: 'Turno' },
    ]

    const handleChange = (e) => {
        formik.handleChange(e)
    }

    {/* Formik */ }
    const initobj = {
        tipo: null,
        fechaInicio: null,
        fechaFinal: null,
        departamento: null,
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
        onSubmit: (values) => setSolicitud(values)
    });

    return (
        <>
            <div ref={screenRef} className="relative flex w-full h-full pl-18 bg-slate-100">
                <AbsScroll vertical >
                    <div id="tbl-page" className="flex flex-col w-full h-full p-4 ">

                        {/* Titulo de la pagina */}
                        <div className="flex flex-row justify-between w-full pr-1">
                            <h1 className="pb-4 pl-3 text-2xl font-bold text-teal-800/80">Reportes de producción</h1>
                            <input
                                form="frmReportes"
                                disabled={false}
                                type="submit"
                                value="Generar"
                                className="h-8 px-6 rounded-md normal-button " />
                        </div>

                        {/* Formulario */}
                        <div className="flex flex-col w-full bg-white rounded-lg shadow-md mb-2 mr-1.5">
                            <form
                                id='frmReportes'
                                className="flex flex-col p-4"
                                onSubmit={formik.handleSubmit}>
                                <div className="flex w-full">
                                    <FieldsBox title="Datos del reporte">
                                        <div className='flex flex-row w-full gap-6'>
                                            <OptsInpt
                                                label='Tipo'
                                                name='tipo'
                                                options={optionsTipo}
                                                formik={formik}
                                                placeholder='Seleccione'
                                            />
                                            <OptsInpt
                                                label='Departamento'
                                                name='departamento'
                                                options={optionsDepartamento}
                                                formik={formik}
                                                placeholder='Seleccione'
                                            />
                                            <Inpt
                                                formik={formik}
                                                label='Fecha inicio' type='date' name='fechaInicio' />
                                            <Inpt
                                                formik={formik}
                                                label='Fecha final' type='date' name='fechaFinal' />
                                        </div>

                                    </FieldsBox>
                                </div>

                            </form>

                        </div>
                        {solicitud &&
                            <div
                                className="flex flex-col"
                                style={{ height: `${screenRef.current?.clientHeight - 16}px` }}>
                                <h1 className="pt-4 pb-4 pl-3 text-2xl font-bold text-teal-800/80">Graficas</h1>
                                {/* Graficas */}
                                {
                                    renderModelo &&
                                    <ReporteEmpleadoModelo
                                        solicitud={solicitud}
                                        setModalComponent={setModalComponent}
                                        setModalVisible={setModalVisible}
                                    />
                                }
                                {
                                    renderTurno &&
                                    <ReporteMaquinaTurno solicitud={solicitud} />
                                }
                            </div>
                        }
                    </div>
                </AbsScroll>
            </div>
            <div className='absolute z-50 w-full h-full modal' ref={modalContainerRef}>
                {modalVisible &&
                    <Modal
                        onClose={() => handleCloseModal(setModalVisible)}
                        component={modalComponent}
                    />
                }
            </div>
        </>

    )
}
export default PaginaReportes