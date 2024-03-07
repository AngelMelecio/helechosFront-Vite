import { useEffect, useRef, useState } from "react"
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import { Chart } from "react-google-charts";
import chroma from "chroma-js";
import Loader from "../../components/Loader/Loader";
import AbsScroll from "../../components/AbsScroll";

const PADDING = 16

const ReporteMaquinaTurno = ({ solicitud }) => {

  const chartView = useRef(null)

  {/* States and Effects */ }
  const { produccion_por_maquina_y_turno } = usePedidos()

  const [readyToRender, setReadyToRender] = useState(false)
  const [transformedData, setTransformedData] = useState([]);
  const [turnosTotales, setTurnosTotales] = useState([]);
  const [widthChart2, setWidthChart2] = useState(1600)
  const [chartHeight, setChartHeight] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (chartView.current) {
      setChartHeight(chartView.current.clientHeight)
    }
  }, [chartView.current])

  useEffect(() => {
    if (solicitud) {
      setLoading(true)
      produccion_por_maquina_y_turno(solicitud)
        .then((data) => {
          const transData = transformDataMaquina(data);
          setWidthChart2(data.length * 50 + 200);

          const totalData = calculateTurnosTotales(data);
          //console.log(totalData)
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
    //console.log(resultado);
    return resultado;
  };

  return (
    <>
      {
        loading ?
          <div className="relative flex flex-col justify-center w-full h-full total-center">
            <Loader />
          </div> :
          <div className="grid grid-cols-[20%_auto] w-full h-full bg-slate-200">
            { /* Columna lateral Totales */}
            <div className="relative z-10 flex flex-col w-full h-full bg-white rounded-lg shadow-md appear">
              {readyToRender && turnosTotales && <>
                <div className="flex flex-col py-6 total-center">
                  <p className="text-xl font-bold text-teal-800/80"> {turnosTotales?.sumaTotal}</p>
                  <p className="text-gray-500">pares totales</p >
                </div>
                <AbsScroll vertical>
                  <div className="flex flex-col px-2 bg-white total-center appear">
                    {readyToRender && turnosTotales ?
                      <div className="w-full h-full ">
                        {[
                          { label: "Manaña", atr: "m" },
                          { label: "Tarde", atr: "t" },
                          { label: "Noche", atr: "n" },
                        ].map((turno, index) => (
                          <div className="flex items-center justify-between w-full py-1 border-b-2" key={index}>
                            <p className="px-2 font-normal text-gray-600 text-md">{turno.label}</p>
                            <p className="px-2 font-bold text-teal-800/80 text-md">{turnosTotales.totales[turno.atr]}</p>
                          </div>
                        ))}
                      </div> :
                      <p className="italic font-semibold text-gray-600">
                        Totales
                      </p>
                    }
                  </div>
                </AbsScroll>
              </>}
            </div>

            {/*  Reportes y graficas  */}

            <div ref={chartView} className="relative flex flex-grow h-full">
              <AbsScroll horizontal>
                <div className="h-full p-3 ">
                  <div
                    style={{
                      height: `${chartHeight - 2*PADDING}px`,
                      width: widthChart2
                    }}
                    className="p-3 mr-3 bg-white rounded-md shadow-md ">

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
              </AbsScroll>
              {/* Body 
              <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
                
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
                                {// Concentrado }
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
            */}
            </div>
          </div>

      }
    </>
  )
}

export default ReporteMaquinaTurno

