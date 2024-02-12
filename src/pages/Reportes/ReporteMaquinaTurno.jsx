import { useEffect, useState } from "react"
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import { Chart } from "react-google-charts";
import chroma from "chroma-js";
import Loader from "../../components/Loader/Loader";

const ReporteMaquinaTurno = ({ solicitud }) => {
    {/* States and Effects */ }
    const { produccion_por_maquina_y_turno } = usePedidos()

    const [readyToRender, setReadyToRender] = useState(false)
    const [transformedData, setTransformedData] = useState([]);
    const [turnosTotales, setTurnosTotales] = useState([]);
    const [widthChart2, setWidthChart2] = useState(1600)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (solicitud) {
            setLoading(true)
            produccion_por_maquina_y_turno(solicitud)
                .then((data) => {
                    const transData = transformDataMaquina(data);
                    setWidthChart2(data.length * 50 + 200);

                    const totalData = calculateTurnosTotales(data);
                    setTurnosTotales(totalData);
                    setTransformedData(transData);
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


    {/* Metodos para tratar la informacion de los reportes (M) */ }
    function transformDataMaquina(maquinaData) {
        const formatedData = [["Maquina", "Mañana ", "Tarde", "Noche"]];

        maquinaData.forEach(item => {
            const maquinaLabel = `L${item.maquina__linea} - M${item.maquina__numero}`;
            const manana = item.m || 0; // Si es null, usar 0
            const tarde = item.t || 0; // Si es null, usar 0
            const noche = item.n || 0; // Si es null, usar 0

            formatedData.push([maquinaLabel, manana, tarde, noche]);
        });
        return formatedData;
    }

    const calculateTurnosTotales = (data) => {
        const totales = data.reduce((acumulador, item) => {
            acumulador.m += item.m;
            acumulador.t += item.t;
            acumulador.n += item.n;
            return acumulador;
        }, { m: 0, t: 0, n: 0 });

        // Calcula la suma total de m, t y n.
        const sumaTotal = totales.m + totales.t + totales.n;

        // Crea un objeto JSON con los totales y la suma total.
        const resultado = {
            totales: totales,
            sumaTotal: sumaTotal
        };
        console.log(resultado);
        return resultado;
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
                                            readyToRender && turnosTotales &&
                                            <div className="flex items-center justify-between w-full p-2">
                                                <p className="p-2 text-2xl font-extrabold text-teal-700">{turnosTotales?.sumaTotal + " pares"}</p>
                                            </div>

                                        }

                                        {/* Body */}
                                        <div className="flex flex-col w-full h-full px-2 overflow-x-hidden overflow-y-scroll bg-white total-center appear">

                                            {

                                                readyToRender ?
                                                    turnosTotales &&
                                                    <div className="justify-start w-full h-full">
                                                        <div className="flex justify-between w-full py-1 border-b-2">
                                                            <p className="px-2 font-normal text-teal-700 text-md">{'Mañana'}</p>
                                                            <p className="px-2 font-medium text-teal-700 text-md">{turnosTotales.totales.m}</p>
                                                        </div>
                                                        <div className="flex justify-between w-full py-1 border-b-2">
                                                            <p className="px-2 font-normal text-teal-700 text-md">{'Tarde'}</p>
                                                            <p className="px-2 font-medium text-teal-700 text-md">{turnosTotales.totales.t}</p>
                                                        </div>
                                                        <div className="flex justify-between w-full py-1 border-b-2">
                                                            <p className="px-2 font-normal text-teal-700 text-md">{'Noche'}</p>
                                                            <p className="px-2 font-medium text-teal-700 text-md">{turnosTotales.totales.n}</p>
                                                        </div>
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
                                                    transformedData.length > 0 ?
                                                        //Renderizado de graficos
                                                        <div className="flex-col w-full h-full overflow-y-scroll">

                                                            <div className="relative h-full overflow-x-scroll overflow-y-hidden">
                                                                <div className="absolute h-full ">
                                                                    <div
                                                                        style={{ width: widthChart2 }}
                                                                        className="flex w-full h-full ">
                                                                        {/* Concentrado */}
                                                                        <Chart
                                                                            chartType="Bar"
                                                                            width="100%"
                                                                            height="100%"
                                                                            data={transformedData}
                                                                            options={{
                                                                                title: 'Pares tejidos por turno',
                                                                                colors: ['#23aa8f', '#64c987', '#aae479'],
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

export default ReporteMaquinaTurno

