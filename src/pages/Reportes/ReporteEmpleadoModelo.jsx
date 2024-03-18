import { useEffect, useRef, useState } from "react"
import { usePedidos } from "../Pedidos/hooks/usePedidos";
import { Chart } from "react-google-charts";
import chroma from "chroma-js";
import Loader from "../../components/Loader/Loader";
import AbsScroll from "../../components/AbsScroll";

const PADDING = 16

const ReporteEmpleadoModelo = ({ solicitud }) => {

  const chartView = useRef(null)

  {/* States and Effects */ }
  const { produccion_por_modelo_y_empleado } = usePedidos()

  const [readyToRender, setReadyToRender] = useState(false)
  const [data, setData] = useState([])
  const [transformedData, setTransformedData] = useState([]);
  const [consolidatedData, setConsolidatedData] = useState([]);
  const [modelosTotales, setModelosTotales] = useState([]);
  const [widthChart2, setWidthChart2] = useState(1600)
  const [chartViewHeight, setChartViewHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tabSelected, setTabSelected] = useState(0)
  const [empleadosTotales, setEmpleadosTotales] = useState([]);
  const groupTabs = [
    { value: 0, label: 'Modelos' },
    { value: 1, label: 'Empleados' }
  ]
  const [datosActuales, setDatosActuales] = useState({ totales: [], total: 0 });

  useEffect(() => {
    // Asigna los datos actuales a mostrar basados en la pestaña seleccionada
    if (tabSelected === 0) {
      setDatosActuales({ totales: modelosTotales.totales, total: modelosTotales.total });
    } else if (tabSelected === 1) {
      setDatosActuales({ totales: empleadosTotales.totales, total: empleadosTotales.total });
    }
  }, [tabSelected, modelosTotales, empleadosTotales]);

  useEffect(() => {
    if (chartView.current) {
      setChartViewHeight(chartView.current.clientHeight)
    }
  }, [chartView.current])

  useEffect(() => {
    if (solicitud) {
      setLoading(true)
      produccion_por_modelo_y_empleado(solicitud)
        .then((data) => {
          setData(data)
          const transData = data.map(empleado => transformDataEmpleado(empleado));
          const consolidatedData = transformDataConsolidada(data);
          setWidthChart2(data.reduce((acc, e) => acc + e.modelos.length, 0) * 50 + 200)
          const totalDataModelos = calculateModelosTotales(consolidatedData);
          const totalDataEmpleados = calculateEmpleadosTotales(consolidatedData);
          setModelosTotales(totalDataModelos);
          setEmpleadosTotales(totalDataEmpleados);
          setTransformedData(transData);
          setConsolidatedData(consolidatedData);
          setReadyToRender(true)
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

    const totales = Object.entries(totalByModelo).map(([entidad, total]) => ({
      entidad,
      total
    }));

    totales.sort((a, b) => b.total - a.total);

    return {
      total: totalGeneral,
      totales
    };
  };
  const calculateEmpleadosTotales = (consolidatedData) => {
    let totalGeneral = 0; // Inicializamos el total de totales

    const totales = consolidatedData.slice(1).map(empleado => {
      const suma = empleado.slice(1).reduce((acumulado, valorActual) => acumulado + valorActual, 0);
      totalGeneral += suma; // Sumamos al total de totales
      return { entidad: empleado[0], total: suma };
    });

    totales.sort((a, b) => b.total - a.total);

    return {
      total: totalGeneral,
      totales
    };
  };

  const Tab = ({ children, active, ...props }) => {
    return (
      <div
        className={`cursor-pointer hover:bg-white duration-100 rounded-md font-medium text-sm h-6 px-6 total-center mx-1 ${active ? 'bg-white text-teal-700 shadow-md' : 'text-gray-600'}`}
        {...props}
      >
        {children}
      </div>
    )
  }
  return (
    <>
      {loading && readyToRender ?
        <div className="relative flex flex-col justify-center w-full h-full total-center">
          <Loader />
        </div>
        :
        <div className="grid grid-cols-[20%_auto] w-full h-full bg-slate-200">
          { /* Columna lateral Totales */}
          <div className="relative z-10 flex flex-col w-full h-full bg-white rounded-lg shadow-md appear">
            <div className="flex flex-row justify-center w-full p-2 bg-slate-200">
              {[groupTabs.map((tab, indx) =>
                <Tab
                  key={indx}
                  active={tabSelected === tab.value}
                  onClick={() => setTabSelected(tab.value)}
                >
                  {tab.label}
                </Tab>)]
              }
            </div>


            {
              readyToRender && datosActuales?.totales.length > 0 && <>
                <div className="flex flex-col py-6 total-center">
                  <p className="text-xl font-bold text-teal-800/80"> {datosActuales.total}</p>
                  <p className="text-gray-500">pares totales</p >
                </div>
                <AbsScroll vertical>
                  <div className="flex flex-col px-2 bg-white total-center appear">
                    {consolidatedData ?
                      datosActuales?.totales.length > 0 &&
                      <div className="w-full h-full ">
                        {datosActuales.totales.map((entidad, index) => (
                          <div className="flex items-center justify-between w-full py-1 border-b-2" key={index}>
                            <p className="px-2 font-normal text-gray-600 text-md">{entidad.entidad}</p>
                            <p className="px-2 font-bold text-teal-800/80 text-md">{entidad.total}</p>
                          </div>
                        ))}
                      </div> :
                      <p className="italic font-semibold text-gray-600">
                        Totales
                      </p>
                    }
                  </div>
                </AbsScroll>
              </>
            }
          </div>

          {/*  Reportes y graficas  */}
          <div ref={chartView} className="relative flex flex-grow h-full bg-slate-200">
            <AbsScroll vertical>
              {transformedData.length > 0 ?
                <>
                  {/* Ordinario, extra, reposiciones por Empleado */}
                  <div style={{ height: chartViewHeight }} className="w-full">
                    <AbsScroll horizontal>
                      <div className="absolute flex gap-2 p-3">
                        {transformedData.map((dataEmpleado, index) => {
                          let w = dataEmpleado.data.length * 200
                          return (
                            <div
                              style={{
                                width: w,
                                height: `${chartViewHeight - 2 * PADDING}px`
                              }}
                              className={`flex flex-col bg-white shadow-md rounded-md p-4`} key={'DE_' + index}
                            >
                              <p className="px-2 pb-4 font-semibold text-teal-800/80 text-md">{dataEmpleado.empleado}</p>
                              <Chart
                                loader={<Loader />}
                                key={'CE_' + index}
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
                    </AbsScroll>
                  </div>
                  { /* Modelos por empleado */}
                  <div style={{ height: chartViewHeight }} className="w-full">
                    <AbsScroll horizontal>
                      <div
                        style={{
                          height: `${chartViewHeight - PADDING}px`,
                          width: widthChart2
                        }}
                        className="absolute p-3 ">
                        <div className={` bg-white shadow-md rounded-md p-4 h-full`}>
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
                    </AbsScroll>
                  </div>
                </> :
                <p className="italic font-semibold text-gray-600">
                  No hay suficientes datos para generar un grafico
                </p>
              }
            </AbsScroll>
          </div>
        </div>

      }
    </>
  )
}

export default ReporteEmpleadoModelo