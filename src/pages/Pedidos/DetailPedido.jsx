import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import Loader from "../../components/Loader/Loader";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import { useRef, useState } from "react";
import { useClientes } from "../Clientes/hooks/useClientes";
import { useEffect } from "react";
import useModelos from "../Modelos/hooks/useModelos";
import Slider from "../../components/Slider";
import { usePedidos } from "./hooks/usePedidos";
import SelectedFichas from "./components/SelectedFichas";
import { useAuth } from "../../context/AuthContext";
import { entorno } from "../../constants/entornos";
import { Chart } from "react-google-charts";
import chroma from 'chroma-js';
import EtiquetasModal from "../../components/LabelModal";
import { sleep } from '../../constants/functions';
import useWebSocket from "../../components/useWebSockets";
import Progreso from "./components/Progreso";
import DetalleEtiquetaModal from "./components/DetalleEtiquetaModal";

const DetailPedido = () => {

  const navigate = useNavigate();
  const { notify } = useAuth()
  const { id } = useParams();

  const {
    messages: detallesSocket,
    status,
    sendMessage
  } = useWebSocket(`ws://localhost:8000/ws/pedidos/${id}/`)

  const pageRef = useRef()
  const modalRef = useRef()

  const [modalVisible, setModalVisible] = useState(false)
  const [detalleEtiquetaModalVisible, setDetalleEtiquetaModalVisible] = useState(false)

  const [pageScrollBottom, setPageScrollBottom] = useState(false)

  const { findPedido, allEtiquetas, getEtiquetas } = usePedidos()

  const [pedido, setPedido] = useState(null)

  const [selectedFichaIndx, setSelectedFichaIndx] = useState(0)
  const [selectedTallaIndx, setSelectedTallaIndx] = useState(0)

  useEffect(() => {
    console.log('llega etiquetas: ', allEtiquetas)
  }, [allEtiquetas])

  useEffect(async () => {
    getEtiquetas(id)
    let p = await findPedido(id)
    console.log('llega prdido: ', p)
    setPedido(p)
  }, [])

  useEffect(() => {
    if (detallesSocket) {
      console.log('Escuchando Actualizacion')
      setPedido(detallesSocket)
    }
  }, [detallesSocket])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    modalRef.current.classList.add('visible')
  }

  const handleCloseModal = async (setState) => {
    modalRef.current.classList.remove('visible')
    await sleep(150)
    setState(false)
  }

  const handleScroll = () => {
    setPageScrollBottom(
      Math.ceil(pageRef.current.scrollTop + pageRef.current.clientHeight) >=
      pageRef.current.scrollHeight
    )
  }

  return (
    <>
      <div
        ref={pageRef}
        onScroll={handleScroll}
        className="w-full relative overflow-y-scroll h-full">
        <div id="tbl-page" className="flex flex-col w-full bg-slate-100 relative p-4">
          {/*  PAGE HEADER  */}
          <div className="flex pb-4 justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/pedidos')}
                className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
              <p className="font-bold text-2xl pl-3 text-teal-700">
                Detalles del Pedido
              </p>
            </div>
          </div>

          {pedido === null ? <Loader /> :

            <form
              id='frmPedido'
              className='flex flex-col h-full w-full relative '
            //onSubmit={formik.handleSubmit}
            >
              <div className="w-full flex flex-col">
                {/* DATOS DEL PEDIDO */}
                <div className="bg-white p-6 shadow-md rounded-md">
                  <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                    <div className="absolute w-full total-center -top-3">
                      <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
                        Datos del Pedido
                      </div>
                    </div>
                    <div className="flex flex-row">
                      <Input
                        readOnly
                        name='Cliente'
                        value={pedido.modelo?.cliente.nombre}
                        label='Cliente'
                        type="text"
                      />
                      <Input
                        readOnly
                        name='Modelo'
                        value={pedido.modelo.nombre}
                        label='Modelo'
                        type="text"
                      />
                    </div>
                    <div className="flex flex-row">
                      <Input
                        readOnly
                        name='fechaEntrega'
                        value={pedido.fechaEntrega}
                        label='Fecha de Entrega'
                        type='text'
                      />
                      <Input
                        readOnly
                        name='fechaRegistro'
                        value={pedido.fechaRegistro}
                        label='Fecha de Registro'
                        type='text'
                      />

                    </div>
                  </div>
                </div>
                {/*  MONITOREO DE LA PRODUCCION */}
                <div className="screen flex flex-col">
                  {/*  HEADER */}
                  <div className="flex pt-8 pb-4 justify-between ">
                    <div className="flex items-center">
                      <p className="font-bold text-2xl pl-3 text-teal-700">
                        Monitoreo de la producción
                      </p>
                    </div>
                    <div className='flex'>
                      <button
                        disabled={allEtiquetas.length === 0}
                        onClick={(e) => { e.preventDefault(); handleOpenModal(setModalVisible) }}
                        className='normal-button h-10 w-10 rounded-lg total-center'
                      >
                        <ICONS.Print size='25px' />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col relative h-full bg-white rounded-lg ">
                    {/*  MONITOREO DE LA PRODUCCION */}
                    <div className="flex w-full relative h-full">
                      {/*  SIDE MENU  */}
                      <div className="h-full w-60 bg-gray-50">
                        <div className="flex flex-col w-full h-full overflow-hidden">
                          <div className="p-3">
                            <p className="px-4 py-2 text-xl font-semibold text-teal-700">
                              Modelos
                            </p>
                          </div>
                          <div className="flex flex-col w-full h-full relative overflow-y-scroll">
                            <div className="flex flex-col w-full h-full px-3 pb-3">
                              {
                                pedido?.detalles.map((detalle, indx) =>
                                  <button
                                    key={"B" + indx}
                                    type="button"
                                    className={"rounded-sm my-1 flex w-full p-3 items-center relative cursor-pointer"
                                      + (indx === selectedFichaIndx ?
                                        " bg-white shadow-md text-teal-700" :
                                        " hover:bg-white text-gray-600 duration-200")}
                                    onClick={() => { setSelectedFichaIndx(indx); setSelectedTallaIndx(0) }}>
                                    <p className="font-medium">
                                      {detalle.fichaTecnica.nombre}
                                    </p>
                                  </button>)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*  DETALLES DEL PEDIDO  */}
                      <div className="flex-1 relative h-full bg-white">
                        <div className="absolute w-full h-full">
                          {
                            <div className="flex flex-col w-full h-full ">
                              {/*  CHARTS  */}
                              <div className="relative w-full h-2/5">
                                <div className="flex absolute w-full h-full ">
                                  <div className="flex overflow-x-scroll bg-gray-50 w-full px-2">
                                    {pedido?.detalles[selectedFichaIndx]?.cantidades.map((cantidad, j) => {

                                      //por cada cantidad renderizamos una grafica
                                      //Especificamos las opciones de la grafica
                                      let options = {
                                        title: "Talla: " + cantidad.talla,
                                        titleTextStyle: { fontSize: 18, bold: false, color: '#0f766e', },
                                        colors: chroma.scale(['#2A4858', '#fafa6e']).mode('lch').colors(7),
                                        pieHole: 0.4,
                                        legend: { textStyle: { color: '#1f2937', fontSize: 17 } },
                                        //tooltip: { isHtml: true },
                                        tooltip: { backgroundColor: '#000', textStyle: { color: '#1f2937', fontSize: 17 } },
                                        pieSliceTextStyle: { color: '#fff', fontSize: 14, textAlign: 'center' },
                                        backgroundColor: "transparent",

                                      }
                                      //Ajustamos el arreglo de datos para la grafica
                                      let data = [["Departamentos", "Número de etiquetas"]]
                                      cantidad.progreso.forEach(progreso => {
                                        data.push(progreso);
                                      });
                                      //Renderizamos la grafica
                                      return (
                                        <div
                                          key={`PieChart-${j}`}
                                          className="flex-shrink-0 w-[33.33%] min-w-[220px]  h-full p-2 py-4">
                                          <div
                                            onClick={() => setSelectedTallaIndx(j)}
                                            className={(selectedTallaIndx === j ? "shadow-md rounded-lg bg-white" : "bg-gray-50 hover:bg-white") + " h-full cursor-pointer duration-200"}>
                                            {<Chart
                                              chartType="PieChart"
                                              data={data}
                                              options={options}
                                              loader={<Loader />}
                                              width={"100%"}
                                              height={"100%"}
                                            />}

                                          </div>
                                        </div>
                                      );
                                    })
                                    }
                                  </div>
                                </div>
                                <div className="flex flex-row w-full overflow-x-scroll overflow-y-hidden py-2">
                                </div>
                              </div>
                              {/*  Tabla de Etiquetas  */}
                              <div className="relative flex-grow overflow-y-scroll">
                                <div className="absolute w-full">
                                  <table className="customTable clic-row">
                                    <thead>
                                      <tr className="h-10">
                                        <th>Etiqueta</th>
                                        <th>Cantidad</th>
                                        <th>Progreso</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        allEtiquetas?.filter(e => e.idDetallePedido === pedido.detalles[selectedFichaIndx].idDetallePedido).filter(e => e.talla === pedido.detalles[selectedFichaIndx].cantidades[selectedTallaIndx].talla).
                                          map((etiqueta, fila) =>
                                            <tr
                                              onClick={()=>handleOpenModal(setDetalleEtiquetaModalVisible) }
                                              className="w-full text-center">
                                              <td> {etiqueta.numEtiqueta} </td>
                                              <td> {etiqueta.cantidad} </td>
                                              <td>
                                                <Progreso
                                                  last={fila === allEtiquetas.length - 1}
                                                  estacion={etiqueta.estacionActual}
                                                  ruta={etiqueta.rutaProduccion} />
                                              </td>
                                            </tr>)
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          }
        </div>
      </div>
      <div className='modal absolute z-50 h-full w-full' ref={modalRef}>
        {modalVisible &&
          <EtiquetasModal
            title="Selección de etiquetas"
            list={allEtiquetas}
            unique='idProduccion'
            columns={[
              { name: 'ID', atr: 'idProduccion' },
              { name: 'Talla', atr: 'talla' },
              { name: 'Cantidad', atr: 'cantidad' },
              { name: 'Número etiqueta', atr: 'numEtiqueta' },
              { name: 'Estado', atr: 'estado' },
            ]}
            onClose={() => { handleCloseModal(setModalVisible); }}
          />
        }
        {
          detalleEtiquetaModalVisible &&
          <DetalleEtiquetaModal
            onClose={()=>handleCloseModal(setDetalleEtiquetaModalVisible)}
          />
        }
      </div>
    </>
  )
}
export default DetailPedido