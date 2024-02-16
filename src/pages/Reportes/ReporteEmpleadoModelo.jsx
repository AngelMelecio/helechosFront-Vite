import { useEffect, useState } from "react"
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import { Chart } from "react-google-charts";
import chroma from "chroma-js";
import Loader from "../../components/Loader/Loader";

const ReporteEmpleadoModelo = ({ solicitud }) => {
    {/* States and Effects */ }
    const { produccion_por_modelo_y_empleado } = usePedidos()

    const [readyToRender, setReadyToRender] = useState(false)
    const [data, setData] = useState([])
    const [transformedData, setTransformedData] = useState([]);
    const [consolidatedData, setConsolidatedData] = useState([]);
    const [modelosTotales, setModelosTotales] = useState([]);
    const [widthChart2, setWidthChart2] = useState(1600)
    const [loading, setLoading] = useState(false) 

    useEffect(() => {
        if (solicitud) {
            setLoading(true)
            produccion_por_modelo_y_empleado(solicitud)
                .then((data) => {
                    setData(data)
                    const transData = data.map(empleado => transformDataEmpleado(empleado));
                    const consolidatedData = transformDataConsolidada(data);
                    setWidthChart2(data.reduce((acc, e) => acc + e.modelos.length, 0) * 50 + 200)
                    const totalData = calculateModelosTotales(consolidatedData);

                    setModelosTotales(totalData);
                    setTransformedData(transData);
                    setConsolidatedData(consolidatedData);
                    setReadyToRender(true);
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [solicitud])

    {/* Metodos para tratar la informacion de los reportes (Model-Empleado) */ }
    function transformDataEmpleado(empleadoData) {
        const header = ["Modelos", "Ordinarios", "Reposiciones", "Extras", "Fallas"]
        const modelosData = empleadoData.modelos.map(modelo => [
            modelo.modelo,
            modelo.ordinario,
            modelo.reposicion,
            modelo.extra,
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
                    row.push(((modelo.ordinario + modelo.reposicion + modelo.extra) - modelo.falla));
                } else {
                    row.push(0);
                }
            });
            return row;
        });

        return [header, ...empleadosData];
    }

    const calculateModelosTotales = (consolidatedData) => {
        //console.log(consolidatedData)
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


    return (
        <>
            {
                loading ?
                    <div className="relative flex flex-col justify-center w-full h-full total-center">
                        <Loader />
                    </div> :
                    < div className="flex flex-col h-full overflow-hidden bg-slate-100 " >
                        <div className="w-full h-full">
                            <div className="flex w-full h-full">
                                { /* Columna lateral */}
                                <div className="w-1/6 relative pr-1.5 pb-1.5 rounded-lg appear">
                                    <div className="relative flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                                        {/* Header */}
                                        <div className="flex items-center justify-between w-full p-2">
                                            <p className="px-2 text-lg font-bold text-teal-700">Totales</p>
                                        </div>
                                        {
                                            readyToRender && modelosTotales.totales.length > 0 &&
                                            <div className="flex items-center justify-between w-full p-2">
                                                <p className="p-2 text-2xl font-extrabold text-teal-700">{modelosTotales.total + " pares"}</p>
                                            </div>

                                        }


                                        {/* Body */}
                                        <div className="flex flex-col w-full h-full px-2 overflow-x-hidden overflow-y-scroll bg-white total-center appear">

                                            {

                                                readyToRender && consolidatedData ?
                                                    modelosTotales.totales.length > 0 &&
                                                    <div className="justify-start w-full h-full">
                                                        {
                                                            modelosTotales.totales.map((modelo, index) => (
                                                                <div className="flex justify-between w-full py-1 border-b-2" key={index}>
                                                                    <p className="px-2 font-normal text-teal-700 text-md">{modelo.modelo}</p>
                                                                    <p className="px-2 font-medium text-teal-700 text-md">{modelo.total}</p>
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

                                {/*  Reportes y graficas  */}
                                <div className="w-full h-full relative pr-0.5 pb-1.5">
                                    <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                                        {/* Header */}
                                        <div className="flex items-center justify-between w-full h-12 p-2">
                                            <p className="px-2 text-lg font-bold text-teal-700">Gráficas</p>
                                        </div>
                                        {/* Body */}
                                        <div className="w-full h-full px-2 bg-white total-center">
                                            {
                                                readyToRender ?
                                                    data.length > 0 ?
                                                        //Renderizado de graficos
                                                        <div className="flex-col w-full h-full overflow-y-scroll">

                                                            <div className="relative flex-row h-full overflow-x-scroll overflow-y-hidden">
                                                                <div className="absolute flex flex-row h-full">
                                                                    {/* Empleados */}
                                                                    {transformedData.map((dataEmpleado, index) => {

                                                                        let w = dataEmpleado.data.length * 200
                                                                        return (

                                                                            <div
                                                                                style={{ width: w }}
                                                                                className={`flex flex-col h-full w-full mx-5 px-5`} key={'divEmpleado' + index}>
                                                                                <p className="px-2 py-2 font-semibold text-teal-700 text-md">{dataEmpleado.empleado}</p>
                                                                                <Chart
                                                                                    loader={<Loader />}
                                                                                    key={'char' + index}
                                                                                    chartType="Bar"
                                                                                    width="100%"
                                                                                    height="100%"
                                                                                    data={dataEmpleado.data}
                                                                                    options={{
                                                                                        colors: ["#23aa8f", "#46b99d", "#64c987", "#DC2626"]
                                                                                    }}
                                                                                />

                                                                            </div>

                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                            <div className="relative h-full overflow-x-scroll overflow-y-hidden">
                                                                <div className="absolute h-full ">
                                                                    <div
                                                                        style={{ width: widthChart2 > 0 ? widthChart2 : 1600}}
                                                                        className="flex w-full h-full ">
                                                                        {/* Concentrado */}
                                                                        <Chart
                                                                            chartType="Bar"
                                                                            width="100%"
                                                                            height="100%"
                                                                            data={consolidatedData}
                                                                            options={{
                                                                                colors: chroma.scale(['#23aa8f', '#8fd27f']).colors(modelosTotales.totales.length)
                                                                            }}
                                                                        />

                                                                    </div>
                                                                </div>
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
                    </div >
            }
        </>
    )
}

export default ReporteEmpleadoModelo