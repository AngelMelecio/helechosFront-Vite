import { useEffect, useState } from "react"
import { ICONS } from "../../constants/icons"
import { useRef } from "react"
import { API_URL } from "../../constants/HOSTS";
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/Input";
import { useFormik } from "formik";
import CustomSelect from "../../components/CustomSelect";



const PaginaReportes = () => {

    const { notify } = useAuth()

    const initobj = {
        tipo: "Seleccione",
        fechaInicio: null,
        fechaFinal: null,
        departamento: "Seleccione",
    }

    const optionsDepartamento = [
        { value: 'Seleccione', label: 'Seleccione' },
        { value: 'Tejido', label: 'Tejido' },
        { value: 'Corte', label: 'Corte' },
        { value: 'Plancha', label: 'Plancha' },
        { value: 'Empaque', label: 'Empaque' },
        { value: 'Calidad', label: 'Calidad' },
    ]

    const optionsTipo = [
        { value: 'Seleccione', label: 'Seleccione' },
        { value: 'Modelo', label: 'Modelo' },
        { value: 'Turno', label: 'Turno' },
    ]

    const optionsModelo = [
        { value: 'Seleccione', label: 'Seleccione' },
        { value: 'Todos', label: 'Todos ' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
    ]

    const handleChange = (e) => {
        formik.handleChange(e)
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
        onSubmit: (values) => {
            console.log(values)

        },
    });


    return (
        <>
            <div className="flex w-full h-full relative pl-18 bg-slate-100">
                <div id="tbl-page" className="flex flex-col h-full w-full absolute p-4 overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Page Header */}
                        <div className="flex flex-row w-full justify-between pr-1">
                            <h1 className="font-bold text-2xl pb-4 pl-3 text-teal-700">Reportes de producción</h1>
                            <input
                                form="frmReportes"
                                disabled={false}
                                type="submit"
                                value="Generar"
                                className="normal-button h-8 rounded-md px-6 " />
                        </div>
                        {/* Formulario */}
                        <div className="flex flex-col w-full bg-white rounded-lg shadow-lg mb-2 mr-1.5">
                            <form
                                id='frmReportes'
                                className="p-4 flex flex-col"
                                onSubmit={formik.handleSubmit}>
                                <div className="relative p-4 border-2 mx-1 my-2 border-slate-300">
                                    <div className="absolute w-full total-center -top-3">
                                        <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
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
                                    </div>
                                    <div className='flex flex-row w-full'>
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
                        {/* Body Page (Totales y graficos) */}
                        <div className="h-full flex flex-col overflow-hidden bg-slate-100">
                            <div className="w-full h-full">
                                <div className="flex w-full h-full">
                                    {/* Columna lateral  */}
                                    <div className="w-1/4 relative pr-1.5 pb-1.5 rounded-lg">
                                        <div className="flex flex-col w-full h-full relative bg-white rounded-lg shadow-md">
                                            {/* Header */}
                                            <div className="w-full p-2 flex items-center justify-between">
                                                <p className="text-teal-700 text-lg font-semibold px-2">Totales</p>
                                            </div>

                                            {/* Body */}
                                            <div className=" w-full h-full px-2 total-center bg-white">
                                                <p className="italic font-semibold text-gray-600">
                                                    Información extra
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/*  Datos de la Captura  */}
                                    <div className="w-full h-full relative pr-0.5 pb-1.5">
                                        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                                            {/* Header */}
                                            <div className="w-full h-12 p-2 flex items-center  justify-between">
                                                <p className="text-teal-700 text-lg font-semibold px-2">Graficos</p>
                                            </div>
                                            {/* Body */}
                                            <div className=" w-full h-full px-2 total-center bg-white">
                                                <p className="italic font-semibold text-gray-600">
                                                    Graficas
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PaginaReportes