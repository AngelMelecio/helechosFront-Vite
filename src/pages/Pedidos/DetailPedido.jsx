import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { FormikProvider, useFormik } from "formik";
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
import EtiquetasModal from "../../components/EtiquetasModal";
import { sleep } from '../../constants/functions';

const initPedido = {
  modelo: {
    idModelo: "",
    cliente: "",
  },
  fechaEntrega: "",
  detalles: []
}

const defaultRoute = {
  "creada": "impresa",
  "impresa": "tejido",
  "tejido": "plancha",
  "plancha": "corte",
  "corte": "calidad",
  "calidad": "empaque",
  "empaque": "empacado",
  "empacado": "entregado"
}

const initRoute = {
  "creada": "impresa",
  "impresa": null,
  "tejido": null,
  "plancha": null,
  "corte": null,
  "calidad": null,
  "empaque": "empacado",
  "empacado": "entregado"
}

function formatPedido(pedido) {
  return ({
    ...pedido,
    //modelo: pedido.modelo.idModelo,
    //cliente: pedido.modelo.cliente.idCliente,
  })
}

const DetailPedido = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = (id !== '0');

  const blankRef = useRef()
  const pageRef = useRef()
  const modalRef = useRef()
  const [modalEtiquetas, setModalEtiquetas] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const { notify } = useAuth()
  const { allClientes, refreshClientes } = useClientes()
  const { getModelosCliente } = useModelos()
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [optionsCliente, setOptionsCliente] = useState([])
  const [optionsModelo, setOptionsModelo] = useState([])
  const [loadingModelos, setLoadingModelos] = useState(false)

  const [pageScrollBottom, setPageScrollBottom] = useState(false)

  const [allFichas, setAllFichas] = useState([])
  const [availableFichas, setAvailableFichas] = useState([])
  const { getFichas, postPedido, allPedidos, findPedido, allEtiquetas, getEtiquetas } = usePedidos()
  const [saving, setSaving] = useState(false)

  const validate = values => {
    let errors = {}
    if (values.modelo === "") errors.modelo = "Seleccione un modelo"
    if (values.fechaEntrega === "") errors.fechaEntrega = "Seleccione una fecha de entrega"
    if (values.detalles?.length === 0) errors.detalles = "Seleccione al menos una ficha"

    values.detalles?.forEach((detalle, i) => {
      detalle.cantidades.forEach((cantidad, j) => {
        if (cantidad.cantidad === "" || cantidad.cantidad === 0)
          errors[`detalles[${i}].cantidades[${j}].cantidad`] = "Ingrese una cantidad"
        if (cantidad.paquete === "" || cantidad.paquete === 0 || Number(cantidad.paquete) > Number(cantidad.cantidad))
          errors[`detalles[${i}].cantidades[${j}].paquete`] = "Ingrese un paquete válido"
      })
    })
    return errors
  }

  const formik = useFormik({
    initialValues: null,
    validate,
    onSubmit: async (values) => {
      try {
        setSaving(true)
        console.log(values)
        let formatValues = structuredClone(values)
        formatValues.modelo = formatValues.modelo.idModelo

        // Formatear los detalles
        formatValues.detalles.forEach(detalle => {

          // Crear la ruta a partir de las estaciones
          let rutaProduccion = { ...initRoute }
          let posRuta = "impresa", posDef = "impresa"
          while (posDef !== "empacado") {
            posDef = defaultRoute[posDef]
            if (detalle.estaciones[posDef]) {
              rutaProduccion[posRuta] = posDef
              posRuta = posDef
            }
          }
          detalle.rutaProduccion = rutaProduccion
          detalle.fichaTecnica = detalle.fichaTecnica.idFichaTecnica
          delete detalle.estaciones
          detalle.cantidades.forEach(cantidad => { cantidad.cantidad = Number(cantidad.cantidad); cantidad.paquete = Number(cantidad.paquete) })
        })

        console.log(formatValues)
        const { message, pedido } = await postPedido(formatValues)
        notify(message)
        navigate('/pedidos')
      } catch (e) {
        notify('Error al crear pedido: ' + e.message, true)
      } finally {
        setSaving(false)
      }
      // */
    },
  });

  useEffect(() => {
    setOptionsCliente(allClientes.map(cliente => ({ value: cliente.idCliente, label: cliente.nombre })))
  }, [allClientes])

  useEffect(async () => {

    refreshClientes()
    let p = id === '0' ? initPedido :
      formatPedido(await findPedido(id))

    //console.log(p)
    formik.setValues(p)
  }, [])
  useEffect(async () => {
    await getEtiquetas(id)
  }, [])
  // selecciona cliente -> Cambia los modelos disponibles
  useEffect(async () => {
    if (!formik?.values?.modelo.cliente) return
    try {
      setLoadingModelos(true)
      let modelos = await getModelosCliente(formik?.values?.modelo.cliente)
      setOptionsModelo(modelos.map(modelo => ({ value: modelo.idModelo, label: modelo.nombre })))
    } catch (e) {
      console.log(e)
    } finally {
      setLoadingModelos(false)
    }
  }, [formik?.values?.modelo?.cliente])

  // Selecciona modelo -> Cambia las fichas disponibles
  useEffect(async () => {
    let id = formik?.values?.modelo.idModelo
    if (!id) return
    try {
      let fichas = await getFichas(id)
      setAllFichas(fichas)
    } catch (e) {
      console.log(e)
    }
  }, [formik?.values?.modelo?.idModelo])

  useEffect(() => { setAvailableFichas(allFichas) }, [allFichas])

  const handlePass = (list) => {

    formik.setFieldValue('detalles', [...formik.values.detalles,
    ...availableFichas.filter(f => list.includes(f.idFichaTecnica))
      .map(f => ({
        fichaTecnica: { ...f },
        estaciones: {
          "tejido": true,
          "plancha": true,
          "corte": true,
          "calidad": true,
          "empaque": true,
        },
        cantidades: [
          ...f.talla.split(',').map(t => ({
            talla: t,
            cantidad: 0,
            paquete: 0
          }))
        ]
      }))]
    )
    setAvailableFichas(availableFichas.filter(f => !list.includes(f.idFichaTecnica)))
  }

  const handleErase = (idFicha) => {
    formik.setFieldValue('detalles', formik.values.detalles.filter(d => d.fichaTecnica.idFichaTecnica !== idFicha))
    setAvailableFichas(prev => [...prev, { ...allFichas.find(f => f.idFichaTecnica === idFicha), isSelected: false }])
  }

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
                {isEdit ? `Detalles del Pedido` : "Nuevo pedido"}
              </p>
            </div>

            <input
              disabled={saving}
              className='bg-teal-500 p-1 w-40 text-white normal-button rounded-lg'
              type="submit"
              value={isEdit ? "Guardar" : "Agregar"}
              form="frmPedido"
            />
          </div>

          {formik.values === null ? <Loader /> :
            <FormikProvider value={formik}>
              <form
                id='frmPedido'
                className='flex flex-col h-full w-full relative '
                onSubmit={formik.handleSubmit}>
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
                        <CustomSelect
                          readOnly={formik?.values.detalles?.length > 0 || id !== '0'}
                          name='Cliente'
                          className='input'
                          onChange={value => { formik.setFieldValue('modelo', { ...formik.values.modelo, cliente: value.value }) }}
                          value={formik?.values.modelo?.cliente}
                          //onBlur={formik.handleBlur}
                          options={optionsCliente}
                          label='Cliente'
                        //errores={formik.errors.cliente && formik.touched.cliente ? formik.errors.cliente : null}
                        />
                        <CustomSelect
                          readOnly={formik?.values.detalles?.length > 0 || id !== '0'}
                          loading={loadingModelos}
                          name='Modelo'
                          className='input'
                          onChange={value => { formik.setFieldValue('modelo', { ...formik.values.modelo, idModelo: value.value }) }}
                          value={formik.values ? formik.values.modelo.idModelo : ""}
                          //onBlur={formik.handleBlur}
                          options={optionsModelo}
                          label='Modelo'
                          errores={formik.errors.modelo && formik.touched.modelo ? formik.errors.modelo : null}
                        />
                      </div>
                      <div className="flex flex-row">
                        <Input
                          readOnly={id !== '0'}
                          name='fechaEntrega'
                          onChange={formik.handleChange}
                          value={formik.values ? formik.values.fechaEntrega : ""}
                          onBlur={formik.handleBlur}
                          label='Fecha de Entrega'
                          type={id === '0' ? 'date' : 'text'}
                          errores={formik.errors.fechaEntrega && formik.touched.fechaEntrega ? formik.errors.fechaEntrega : null}
                        />
                        {id !== '0' && <Input
                          readOnly
                          name='fechaRegistro'
                          //onChange={formik.handleChange}
                          value={formik.values ? formik.values.fechaRegistro : ""}
                          onBlur={formik.handleBlur}
                          label='Fecha de Registro'
                          type={id === '0' ? 'date' : 'text'}
                          errores={formik.errors.fechaRegistro && formik.touched.fechaRegistro ? formik.errors.fechaRegistro : null}
                        />
                        }
                      </div>
                    </div>
                  </div>
                  {/*  SECCION DETALLES DEL PEDIDO */}
                  <div className="screen flex flex-col">
                    {/*  HEADER */}
                    <div className="flex pt-8 pb-4 justify-between ">
                      <div className="flex items-center">
                        <p className="font-bold text-2xl pl-3 text-teal-700">
                          {isEdit ? `Monitoreo de la producción` : "Selección de fichas técnicas"}
                        </p>
                      </div>
                      {
                        isEdit &&
                        <div className='flex'>
                          {
                            allEtiquetas.length > 0 &&
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenModal(setModalVisible)
                              }}
                              className='normal-button h-10 w-10 rounded-lg total-center'
                            >
                              <ICONS.Print size='25px' />
                            </button>
                          }
                        </div>
                      }
                    </div>

                    <div className="flex flex-col relative h-full bg-white rounded-lg shadow-lg">
                      {id === '0' ?
                        <Slider
                          list={availableFichas}
                          unique='idFichaTecnica'
                          onPass={(list) => { handlePass(list) }}
                          columns={[
                            { name: 'Nombre', atr: 'nombre' },
                            { name: 'Talla', atr: 'talla' },
                            { name: 'Fecha de Creación', atr: 'fechaCreacion' },
                            { name: 'Ultima Edición', atr: 'fechaUltimaEdicion' },
                          ]}
                          right={<SelectedFichas pageScrollBottom={pageScrollBottom} formik={formik} onErase={handleErase} />}
                        /> :
                        <div className="flex w-full relative h-full">
                          <div className="h-full w-60 bg-gray-50">
                            <div className="flex flex-col w-full h-full overflow-hidden">
                              <div className="flex w-full h-full relative overflow-y-scroll">
                              
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 relative flex-col h-full overflow-y-scroll bg-slate-100">
                            <div className="absolute w-full h-full">

                              {

                                formik?.values?.detalles.map((detalle, i) => {
                                  return (
                                    <div key={`detalle-${i}`} className="flex flex-row w-full h-1/2 p-4 pb-2">
                                      <div className="flex flex-col w-full h-full bg-white rounded-md shadow-md">
                                        <div >
                                          <p className="font-semibold text-teal-700 text-lg ml-1">
                                            {detalle.fichaTecnica.nombre}
                                          </p>
                                        </div>
                                        <div className="flex flex-row w-full h-full ">
                                          {detalle.cantidades.map((cantidad, j) => {//por cada cantidad renderizamos una grafica
                                            //Especificamos las opciones de la grafica
                                            let options = {
                                              title: "Distribución de\n produccion - Talla \n " + cantidad.talla,
                                              colors: chroma.scale(['#2A4858', '#fafa6e']).mode('lch').colors(7),
                                              pieHole: 0.4
                                            }
                                            //Ajustamos el arreglo de datos para la grafica
                                            let data = [["Departamentos", "Número de etiquetas"]]
                                            cantidad.progreso.forEach(progreso => {
                                              data.push(progreso);
                                            });
                                            //Renderizamos la grafica
                                            return (
                                              <div key={`PieChart-${j}`} className="flex lg:w-1/3 md:w-1/2 sm:w-1 h-full bg-white">
                                                <Chart
                                                  chartType="PieChart"
                                                  data={data}
                                                  options={options}
                                                  loader={<Loader />}
                                                  width={"100%"}
                                                  height={"100%"}
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })

                              }
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </form>
            </FormikProvider>
          }

          {/*<div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <div ref={blankRef} id='visible-blank' className="flex w-full h-full">
              </div>
            </div>
        </div>*/}

        </div>
      </div>
      <div className='modal absolute z-50 h-full w-full' ref={modalRef}>
        {modalVisible &&
          <EtiquetasModal
            listaEtiquetas={allEtiquetas}
            onClose={() => { handleCloseModal(setModalVisible); }}
            title="Selección de etiquetas"
          />
        }
      </div>
    </>
  )
}
export default DetailPedido