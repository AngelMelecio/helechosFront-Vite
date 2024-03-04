import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import Loader from "../../components/Loader/Loader";
import Input from "../../components/Input";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { usePedidos } from "./hooks/usePedidos";
import { useAuth } from "../../context/AuthContext";
import { WS_PREFIX } from "../../constants/HOSTS";
import { Chart } from "react-google-charts";
import EtiquetasModal from "../../components/LabelModal";
import { sleep } from '../../constants/functions';
import useWebSocket from "../../components/useWebSockets";
import Progreso from "./components/Progreso";
import DetalleEtiquetaModal from "./components/DetalleEtiquetaModal";
import LabelToPrint from "../../components/LabelToPrint";
import { DPTO_COLOR } from "../../constants/Despartamentos";
import ScanModal from "../Produccion/components/ScanModal";
import Modal from "../../components/Modal";
import ReposicionesCrud from "./components/ReposicionesCrud";
import PesosModal from "./components/PesosModal";
import HButton from "./components/HButton";

import FieldsBox from '../../components/FieldsBox'

const DetailPedido = () => {

  const navigate = useNavigate();
  const { notify } = useAuth()
  const { id } = useParams();

  const {
    messages: detallesSocket
  } = useWebSocket(`${WS_PREFIX}/ws/pedidos/${id}/`)

  const pageRef = useRef()
  const modalRef = useRef()

  const { findPedido, putProduccion } = usePedidos()

  const [modalVisible, setModalVisible] = useState(false)
  const [detalleEtiquetaModalVisible, setDetalleEtiquetaModalVisible] = useState(false)
  const [printEtiquetasModalVisible, setPrintEtiquetasModalVisible] = useState(false)
  const [extraModalVisible, setExtraModalVisible] = useState(false)
  const [scanModalVisible, setScanModalVisible] = useState(false)
  const [pesosModalVisible, setPesosModalVisible] = useState(false)
  const [pageScrollBottom, setPageScrollBottom] = useState(false)

  const [pedido, setPedido] = useState(null)
  const [allEtiquetas, setAllEtiquetas] = useState([])
  const [etiquetasToPrint, setEtiquetasToPrint] = useState([])

  const [selectedFichaIndx, setSelectedFichaIndx] = useState(0)
  const [selectedTallaIndx, setSelectedTallaIndx] = useState(0)
  const [selectedEtiqueta, setSelectedEtiqueta] = useState(null)

  const onMountComponent = async () => {
    let p = await findPedido(id)
    setPedido(p)
  }

  useEffect(() => {
    onMountComponent()
  }, [])

  // settear las etiquetas cada que el pedido cambie
  useEffect(() => {
    let etiquetasFormated = []
    let modelo = pedido?.modelo.nombre
    let idPedido = pedido?.idPedido
    pedido?.detalles?.forEach((detalle) => {
      let clrs = new Set()
      detalle?.fichaTecnica?.materiales.forEach((material) => { clrs.add(material?.color) })
      detalle?.cantidades?.forEach((cantidad) => {
        cantidad?.etiquetas?.forEach((etiqueta) => {
          etiquetasFormated.push({
            ...etiqueta,
            modelo: modelo,
            idPedido: idPedido,
            color: Array.from(clrs).join("\n"),
            estado: etiqueta.estacionActual !== 'creada' ? "Impresa" : "No impresa",
            isSelected: false,
            talla: etiqueta.tallaReal,
            numEtiqueta: etiqueta.numEtiqueta,
            od: pedido.ordenCompra,
            destino: etiqueta.destino
          })
        })
      })
    })
    //console.log(etiquetasFormated)
    setAllEtiquetas(etiquetasFormated)
  }, [pedido])

  useEffect(() => {
    if (detallesSocket) {
      setPedido(prev => {
        // Aplicamos los cambios a cada lista de etiquetas
        let newPedido = { ...prev }
        detallesSocket.forEach(cambio => {
          newPedido.detalles
            .find(dtll => dtll.idDetallePedido === cambio.detallePedido).cantidades
            .find(ctd => ctd.talla === cambio.talla).etiquetas
            .find(etq => etq.idProduccion === cambio.produccion)
            .estacionActual = cambio.estacionNueva
        })
        // Aplicamos los cambios a cada lista de progresos
        newPedido.detalles.forEach(detalle => {
          detalle.cantidades.forEach(cantidad => {
            cantidad.progreso =
              // Sacar las estaciones Unicas
              [...new Set(cantidad.etiquetas.map(etiqueta => etiqueta.estacionActual))]
                // Devolver una matris con el nombre de la estacion y la cantidad de etiquetas en esa estacion
                .map(uniqueEstacion => [
                  uniqueEstacion,
                  [...cantidad.etiquetas.filter(et => et.estacionActual === uniqueEstacion)].length
                ])
          })
        })
        return newPedido
      })
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
    setState.map(st => st(false))
    //setState(false)
  }

  const handleScroll = () => {
    setPageScrollBottom(
      Math.ceil(pageRef.current.scrollTop + pageRef.current.clientHeight) >=
      pageRef.current.scrollHeight
    )
  }

  const handleSearchProduccion = (etiqueta) => {
    let prd = JSON.parse(etiqueta).idProduccion
    pedido?.detalles
      .forEach((dtll, i) => dtll.cantidades
        .forEach((cntd, j) => cntd.etiquetas
          .forEach(async (etq) => {
            if (etq.idProduccion === prd) {
              setSelectedFichaIndx(i)
              setSelectedTallaIndx(j)
              setSelectedEtiqueta(etq)

              await handleCloseModal([setScanModalVisible])
              await sleep(95)
              await handleOpenModal(setDetalleEtiquetaModalVisible)
              return
            }
          })
        )
      )
  }

  return (
    <>
      <div
        ref={pageRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-scroll">
        <div id="tbl-page" className="relative flex flex-col w-full p-4 bg-slate-100">
          {/*  PAGE HEADER  */}
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/pedidos')}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                Detalles del Pedido
              </p>
            </div>
          </div>

          {pedido === null ? <Loader /> :
            <form
              id='frmPedido'
              className='relative flex flex-col w-full h-full'
            >
              <div className="flex flex-col w-full">
                {/* DATOS DEL PEDIDO */}
                <div className="p-6 bg-white rounded-md shadow-md">
                  <div className="flex w-full">
                    <FieldsBox title="Datos del pedido">
                      <div className="flex flex-row gap-6">
                        <Input
                          readOnly
                          name='Cliente'
                          value={pedido?.modelo?.cliente.nombre}
                          label='Cliente'
                          type="text"
                        />

                        <Input
                          readOnly
                          name='Modelo'
                          value={pedido?.modelo.nombre}
                          label='Modelo'
                          type="text"
                        />
                        <Input
                          readOnly
                          name='orderCompra'
                          value={pedido?.ordenCompra}
                          label='Orden de compra'
                          type="text"
                        />
                      </div>

                      <div className="flex flex-row gap-6">
                        <Input
                          readOnly
                          name='fechaRegistro'
                          value={pedido?.fechaRegistro}
                          label='Fecha de Registro'
                          type='text'
                        />
                        <Input
                          readOnly
                          name='space'
                          value={pedido?.fraccion}
                          label='Pares terminados'
                          type='text'
                        />
                        <Input
                          readOnly
                          name='fechaEntrega'
                          value={pedido?.fechaEntrega}
                          label='Fecha de Entrega'
                          type='text'
                        />

                      </div>
                    </FieldsBox>
                  </div>

                </div>
                {/*  MONITOREO DE LA PRODUCCION */}
                <div className="flex flex-col screen">
                  {/*  HEADER */}
                  <div className="flex justify-between pt-8 pb-4 ">
                    <div className="flex items-center">
                      <p className="pl-3 text-2xl font-bold text-teal-800/80">
                        Monitoreo de la producción
                      </p>
                    </div>
                    <div className='relative flex gap-2'>

                      <HButton
                        openModal={() => handleOpenModal(setPesosModalVisible)}
                        icon={<ICONS.Weight size='27px' />}
                        tooltip="Consumo de material"
                        className='ellipsis e-b e-r'
                      />
                      <HButton
                        openModal={() => handleOpenModal(setExtraModalVisible)}
                        icon={<ICONS.NewLabel size='27px' />}
                        tooltip="Agregar extra / reposiciones"
                        className="ellipsis e-b e-r"
                      />
                      <HButton
                        openModal={() => handleOpenModal(setScanModalVisible)}
                        icon={<ICONS.Qr size='27px' />}
                        tooltip="Buscar etiqueta"
                        className="ellipsis e-b e-r"
                      />
                      <HButton
                        openModal={() => handleOpenModal(setModalVisible)}
                        icon={<ICONS.Print size='27px' />}
                        disabled={allEtiquetas?.length === 0}
                        tooltip="Imprimir etiquetas"
                        className="ellipsis e-b e-r"
                      />

                    </div>
                  </div>
                  <div className="relative flex flex-col h-full bg-white rounded-lg ">
                    {/*  MONITOREO DE LA PRODUCCION */}
                    <div className="relative flex w-full h-full">
                      {/*  SIDE MENU  */}
                      <div className="h-full w-60 bg-gray-50">
                        <div className="flex flex-col w-full h-full overflow-hidden">
                          <div className="p-3">
                            <p className="px-4 py-2 text-xl font-semibold text-teal-800/80">
                              Fichas técnicas
                            </p>
                          </div>
                          <div className="relative flex flex-col w-full h-full overflow-y-scroll">
                            <div className="flex flex-col w-full h-full px-3 pb-3">
                              {
                                pedido?.detalles.map((detalle, indx) =>
                                  <button
                                    key={"B" + indx}
                                    type="button"
                                    className={"rounded-sm my-1 flex w-full p-3 items-center relative cursor-pointer"
                                      + (indx === selectedFichaIndx ?
                                        " bg-white shadow-md text-teal-800/80" :
                                        " hover:bg-white text-gray-600 duration-200")}
                                    onClick={() => { setSelectedFichaIndx(indx); setSelectedTallaIndx(0); }}>
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
                      <div className="relative flex-1 h-full bg-white">
                        <div className="absolute w-full h-full">
                          <div className="flex flex-col w-full h-full ">
                            {/*  CHARTS  */}
                            <div className="relative w-full h-2/5">
                              <div className="absolute flex w-full h-full ">
                                <div className="flex w-full px-2 overflow-x-scroll bg-gray-50">
                                  {pedido?.detalles[selectedFichaIndx]?.cantidades.map((cantidad, j) => {
                                    //Especificamos las opciones de la grafica

                                    let options = {
                                      title: "Talla: " + cantidad.talla + "\n" + "Etiquetas: " + cantidad.etiquetas.length,
                                      titleTextStyle: { fontSize: 18, bold: false, color: '#0f766e', },
                                      colors: cantidad.progreso.map(p => DPTO_COLOR[p[0]]),
                                      pieHole: 0.35,
                                      legend: { textStyle: { color: '#1f2937', fontSize: 17 } },
                                      //tooltip: { isHtml: true },
                                      tooltip: { backgroundColor: '#000', textStyle: { color: '#1f2937', fontSize: 17 } },
                                      pieSliceTextStyle: { color: '#fff', fontSize: 14, textAlign: 'center' },
                                      backgroundColor: "transparent",
                                      animation: {
                                        duration: 1000,
                                        easing: 'out',
                                      }
                                    }
                                    //Ajustamos el arreglo de datos para la grafica
                                    let data = [["Departamentos", "Número de etiquetas"]]
                                    cantidad.progreso?.forEach(progreso => {
                                      data.push(progreso);
                                    });
                                    //Renderizamos la grafica
                                    return (
                                      <div
                                        key={`PieChart-${j}`}
                                        className="flex-shrink-0 w-[33.33%] min-w-[320px]  h-full p-2 py-4">
                                        <div
                                          onClick={() => { setSelectedTallaIndx(j) }}
                                          className={(selectedTallaIndx === j ? "shadow-md rounded-lg bg-white" : "bg-gray-50 hover:bg-white") + " h-full cursor-pointer duration-200"}>
                                          <Chart
                                            chartType="PieChart"
                                            data={data}
                                            options={options}
                                            loader={<Loader />}
                                            width={"100%"}
                                            height={"100%"}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })
                                  }
                                </div>
                              </div>
                              <div className="flex flex-row w-full py-2 overflow-x-scroll overflow-y-hidden">
                              </div>
                            </div>

                            {/*  Tabla de Etiquetas */}
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
                                      (pedido.detalles[selectedFichaIndx]?.cantidades[selectedTallaIndx]?.etiquetas)
                                        .map((etiqueta, fila) =>
                                          <tr
                                            key={'E' + fila}
                                            onClick={() => {
                                              handleOpenModal(setDetalleEtiquetaModalVisible)
                                              setSelectedEtiqueta(etiqueta)
                                            }}
                                            className="w-full text-center">
                                            <td> {etiqueta.numEtiqueta} </td>
                                            <td> {etiqueta.cantidad} </td>
                                            <td>
                                              {
                                                <Progreso
                                                  last={fila === pedido.detalles[selectedFichaIndx]?.cantidades[selectedTallaIndx]?.etiquetas.length - 1}
                                                  estacion={etiqueta.estacionActual}
                                                  ruta={pedido.detalles[selectedFichaIndx]?.rutaProduccion}
                                                />
                                              }
                                            </td>
                                          </tr>)
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
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
      <div className='absolute z-50 w-full h-full modal' ref={modalRef}>
        {modalVisible &&
          <EtiquetasModal
            title="Selección de etiquetas"
            allEtiquetas={allEtiquetas}
            unique='idProduccion'
            columns={[
              { name: 'Número etiqueta', atr: 'numEtiqueta' },
              { name: 'Talla', atr: 'talla' },
              { name: 'Cantidad', atr: 'cantidad' },
              { name: 'Estado', atr: 'estado' },
            ]}
            onClose={() => { handleCloseModal([setModalVisible]); }}
            onPrint={
              async (etqList) => {
                setEtiquetasToPrint(etqList)
                handleOpenModal(setPrintEtiquetasModalVisible)
                putProduccion(etqList?.map(e => ({ idProduccion: e.idProduccion })))
              }
            }
          />
        }
        {
          printEtiquetasModalVisible &&
          <LabelToPrint
            list={etiquetasToPrint}
            onCloseModal={() => handleCloseModal(
              [setPrintEtiquetasModalVisible, setModalVisible]
            )} />
        }
        {
          detalleEtiquetaModalVisible &&
          <DetalleEtiquetaModal
            onClose={() => handleCloseModal([setDetalleEtiquetaModalVisible])}
            etiqueta={selectedEtiqueta}
            modelo={pedido?.modelo?.nombre}
            ficha={pedido?.detalles[selectedFichaIndx]?.fichaTecnica?.nombre}
            talla={pedido?.detalles[selectedFichaIndx]?.cantidades[selectedTallaIndx]?.talla}
          />
        }
        {
          scanModalVisible &&
          <ScanModal
            onClose={() => handleCloseModal([setScanModalVisible])}
            onScan={(value) => handleSearchProduccion(value)}
            title="Buscar Etiqueta..."
          />
        }
        {
          extraModalVisible &&
          <Modal
            onClose={() => handleCloseModal([setExtraModalVisible])}
            component={
              <ReposicionesCrud
                onSubmitted={() => {
                  handleCloseModal([setExtraModalVisible]);
                  onMountComponent();
                }}
                etiquetas={allEtiquetas}
                allDetalles={pedido?.detalles}
              />}
          />
        }
        {
          pesosModalVisible &&
          <Modal
            onClose={() => handleCloseModal([setPesosModalVisible])}
            component={<PesosModal
              idPedido={id}
            />}
          />
        }
      </div>
    </>
  )
}
export default DetailPedido