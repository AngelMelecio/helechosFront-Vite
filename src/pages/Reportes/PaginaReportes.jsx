import { useEffect, useState } from "react"
import { ICONS } from "../../constants/icons"
import { useRef } from "react"
import { API_URL } from "../../constants/HOSTS";
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/Input";
import { useFormik } from "formik";
import CustomSelect from "../../components/CustomSelect";
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import { set } from "lodash";
import { Chart } from "react-google-charts";
import Loader from "../../components/Loader/Loader";
import chroma from "chroma-js";





const PaginaReportes = () => {

    const { notify } = useAuth()
    const { produccion_por_modelo_y_empleado } = usePedidos()
    const [readyToRender, setReadyToRender] = useState(false)
    const [data, setData] = useState([])
    const [solicitud, setSolicitud] = useState(null)
    const [transformedData, setTransformedData] = useState([]);
    const [consolidatedData, setConsolidatedData] = useState([]);
    const [modelosTotales, setModelosTotales] = useState([]);

    const [options, setOptions] = useState({
        colors: ["#00898a", "#23aa8f", "#64c987", "#aae479"],
    })

    useEffect(() => {
        if (solicitud) {
            produccion_por_modelo_y_empleado(solicitud)
                .then((data) => {
                    setData(data)
                    const transformedData = data.map(empleado => transformDataEmpleado(empleado));
                    const consolidatedData = transformDataConsolidada(data);
                    const totalData = calculateModelosTotales(consolidatedData);
                    setModelosTotales(totalData);
                    // Guardamos los datos en el estado para usarlos en las graficas
                    setTransformedData(transformedData);
                    setConsolidatedData(consolidatedData);
                    setReadyToRender(true);
                })
        }
    }, [solicitud])

    function transformDataEmpleado(empleadoData) {
        const header = ["Modelos", "Produccion", "Reposiciones", "Fallas"];
        const modelosData = empleadoData.modelos.map(modelo => [
            modelo.modelo,
            modelo.produccion,
            modelo.reposicion,
            modelo.falla
        ]);
        return { empleado: empleadoData.empleado, data: [header, ...modelosData] };
    }

    function transformDataConsolidada(data) {
        const modelosSet = new Set();
        data.forEach(empleado => {
            empleado.modelos.forEach(modelo => {
                modelosSet.add(modelo.modelo);
            });
        });

        const modelos = [...modelosSet];
        const header = ["Empleado", ...modelos];
        const empleadosData = data.map(empleado => {
            const row = [empleado.empleado];
            modelos.forEach(modeloName => {
                const modelo = empleado.modelos.find(m => m.modelo === modeloName);
                if (modelo) {
                    row.push(modelo.produccion + modelo.reposicion - modelo.falla);
                } else {
                    row.push(0);
                }
            });
            return row;
        });

        return [header, ...empleadosData];
    }

    const calculateModelosTotales = (consolidatedData) => {
        const header = consolidatedData[0];
        const rows = consolidatedData.slice(1); // Eliminamos los titulos

        const totalByModelo = {};
        let totalGeneral = 0;

        rows.forEach(row => {
            header.forEach((modelo, idx) => {
                if (idx === 0) return; // Saltamos la primera columna (que es el nombre del empleado)

                if (!totalByModelo[modelo]) {
                    totalByModelo[modelo] = 0;
                }

                totalByModelo[modelo] += row[idx];
                totalGeneral += row[idx];
            });
        });

        const totales = Object.entries(totalByModelo).map(([modelo, total]) => ({
            modelo,
            total
        }));

        return {
            total: totalGeneral,
            totales
        };
    };




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
            setSolicitud(values)
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
                                    { /* Columna lateral */}
                                    <div className="w-1/6 relative pr-1.5 pb-1.5 rounded-lg">
                                        <div className="flex flex-col w-full h-full relative bg-white rounded-lg shadow-md">
                                            {/* Header */}
                                            <div className="w-full p-2 flex items-center justify-between">
                                                <p className="text-teal-700 text-lg font-bold px-2">Totales</p>
                                            </div>

                                            {/* Body */}
                                            <div className="flex w-full h-full px-2 total-center bg-white flex-col">
                                                {
                                                    readyToRender ?

                                                        modelosTotales.totales.length > 0 &&
                                                        <div className="w-full h-full justify-start">
                                                            <p className="text-teal-700 text-2xl font-extrabold p-2">{modelosTotales.total + " pares"}</p>
                                                            {
                                                                modelosTotales.totales.map((modelo, index) => (
                                                                    <div className="w-full flex justify-between" key={index}>
                                                                        <p className="text-teal-700 text-md font-normal px-2">{modelo.modelo + " :"}</p>
                                                                        <p className="text-teal-700 text-md font-medium px-2">{modelo.total}</p>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                        :
                                                        <p className="italic font-semibold text-gray-600">
                                                            Totales
                                                        </p>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/*  Datos de la Captura  */}
                                    <div className="w-full h-full relative pr-0.5 pb-1.5">
                                        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                                            {/* Header */}
                                            <div className="w-full h-12 p-2 flex items-center  justify-between">
                                                <p className="text-teal-700 text-lg font-bold px-2">Reportes</p>
                                            </div>
                                            {/* Body */}
                                            <div className=" w-full h-full px-2 total-center bg-white">
                                                {
                                                    readyToRender ?
                                                        data.length > 0 ?
                                                            //Renderizado de graficos
                                                            <div className="w-full h-full flex-col overflow-y-scroll">
                                                                <div className="flex h-full w-full">
                                                                    {/* Empleados */}
                                                                    {transformedData.map((dataEmpleado, index) => (
                                                                        <div className="flex flex-col w-full h-full" key={'divEmpleado' + index}>
                                                                            <p className="text-teal-700 text-md font-semibold px-2">{dataEmpleado.empleado}</p>
                                                                            <Chart
                                                                                key={'char' + index}
                                                                                chartType="Bar"
                                                                                width="100%"
                                                                                height="400px"
                                                                                data={dataEmpleado.data}
                                                                                options={{
                                                                                    colors: ["#23aa8f", "#64c987", "#DC2626"]
                                                                                }}
                                                                            />
                                                                        </div>

                                                                    ))}

                                                                </div>
                                                                <div className="flex h-full w-full overflow-x-scroll ">
                                                                    {/* Concentrado */}
                                                                    <Chart
                                                                        chartType="Bar"
                                                                        width="100%"
                                                                        height="400px"
                                                                        data={consolidatedData}
                                                                        options={{
                                                                            colors: chroma.scale(['#23aa8f','#fafa6e']).colors( modelosTotales.totales.length)
                                                                        }}
                                                                    />

                                                                </div>


                                                            </div>
                                                            :
                                                            <p className="italic font-semibold text-gray-600">
                                                                No hay suficientes datos para generar un grafico
                                                            </p>
                                                        :
                                                        <p className="italic font-semibold text-gray-600">
                                                            Graficas
                                                        </p>
                                                }
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