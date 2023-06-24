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
import { useFichas } from "../Modelos/hooks/useFichas";
import { usePedidos } from "./hooks/usePedidos";
import SelectedFichas from "./components/SelectedFichas";
import { useAuth } from "../../context/AuthContext";
import { entorno } from "../../constants/entornos";

const initPedido = {
  cliente: "",
  modelo: "",
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

function formatFichas(fichas) {
  let formatedFichas = []
  fichas.forEach(ficha => {
    formatedFichas.push({
      ...ficha,
      fotografia: entorno + ficha.fotografia,
      fechaCreacion: new Date(ficha.fechaCreacion).toLocaleString(),
      fechaUltimaEdicion: new Date(ficha.fechaUltimaEdicion).toLocaleString()
    })
  })
  return formatedFichas
}

function formatPedido(pedido) {
  return ({
    ...pedido,
    modelo: pedido.modelo.idModelo,
    cliente: pedido.modelo.cliente.idCliente,
  })
}

const DetailPedido = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = (id !== '0');

  const blankRef = useRef()

  const { notify } = useAuth()
  const { allClientes, refreshClientes } = useClientes()
  const { getModelosCliente } = useModelos()
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [optionsCliente, setOptionsCliente] = useState([])
  const [optionsModelo, setOptionsModelo] = useState([])
  const [loadingModelos, setLoadingModelos] = useState(false)

  const [allFichas, setAllFichas] = useState([])
  const [availableFichas, setAvailableFichas] = useState([])
  const { getFichas, postPedido, allPedidos, findPedido } = usePedidos()
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
      
      console.log(values)
      /*
      try {
        setSaving(true)

        let formatValues = structuredClone(values)

        formatValues.detalles.forEach(detalle => {


          // Formatear la ruta
          let estaciones = detalle.estaciones
          let rutaProduccion = { ...initRoute }
          let posRuta = "impresa"
          let posDef = "impresa"

          while (posDef !== "empacado") {
            posDef = defaultRoute[posDef]
            if (estaciones[posDef]) {
              rutaProduccion[posRuta] = posDef
              posRuta = posDef
            }
          }


          detalle.rutaProduccion = rutaProduccion
          delete detalle.estaciones
          delete detalle.nombre

          // Crear descripcion de cantidades
          detalle.cantidades.forEach(cantidad => {
            cantidad.cantidad = Number(cantidad.cantidad)
            cantidad.paquete = Number(cantidad.paquete)
            let paquetes = Math.floor(cantidad.cantidad / cantidad.paquete)
            let sobrante = cantidad.cantidad % cantidad.paquete
            cantidad.descripcion = ""
            cantidad.descripcion += paquetes
              + " paquetes de " + cantidad.paquete
            if (sobrante) cantidad.descripcion += " y un paquete de " + sobrante
          })

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
    formik.setValues(
      id === '0' ? initPedido :
        allPedidos.length > 0 ? formatPedido(allPedidos.find(pedido => pedido.idPedido === Number(id))) :
          formatPedido(await findPedido(id))
    )
  }, [])

  // selecciona cliente -> Cambia los modelos disponibles
  useEffect(async () => {
    if (!formik?.values?.cliente) return
    try {
      setLoadingModelos(true)
      let modelos = await getModelosCliente(formik?.values?.cliente)
      setOptionsModelo(modelos.map(modelo => ({ value: modelo.idModelo, label: modelo.nombre })))
    } catch (e) {
      console.log(e)
    } finally {
      setLoadingModelos(false)
    }
  }, [formik?.values?.cliente])

  // Selecciona modelo -> Cambia las fichas disponibles
  useEffect(async () => {
    let id = formik?.values?.modelo
    if (!id) return
    try {
      let fichas = await getFichas(id)
      setAllFichas(formatFichas(fichas))
    } catch (e) {
      console.log(e)
    }
  }, [formik?.values?.modelo])

  useEffect(() => { setAvailableFichas(allFichas) }, [allFichas])

  const handlePass = (list) => {
    let newAvailable = []
    let newDetalles = []
    availableFichas.forEach(f => {
      if (list.includes(f.idFichaTecnica)) {
        let nD = {
          cantidades: [],
          estaciones: {
            "tejido": true,
            "plancha": true,
            "corte": true,
            "calidad": true,
            "empaque": true,
          }
        }
        nD['fichaTecnica'] = f.idFichaTecnica
        nD['nombre'] = f.nombre
        let tallas = f.talla.split(',')
        tallas.forEach(t => {
          nD.cantidades.push({
            talla: t,
            cantidad: 0,
            paquete: 0,
            descripcion: ''
          })
        })
        newDetalles.push(nD)
      } else {
        newAvailable.push(f)
      }
    })
    setAvailableFichas(newAvailable)
    //console.log(newDetalle)
    formik.setFieldValue('detalles', [...formik.values.detalles, ...newDetalles])
  }

  const handleErase = (detalle) => {
    let newDetalles = formik.values.detalles.filter(d => d.fichaTecnica !== detalle.fichaTecnica)
    formik.setFieldValue('detalles', newDetalles)
    let newAvailable = [...availableFichas]
    let ficha = allFichas.find(f => f.idFichaTecnica === detalle.fichaTecnica)
    newAvailable.push({ ...ficha, isSelected: false })
    setAvailableFichas(newAvailable)
  }

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute px-8 py-5">
          {/*  PAGE HEADER  */}
          <div className="flex pb-4 justify-between">
            <div className="flex">
              <button
                onClick={() => navigate('/pedidos')}
                className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
              <p className="font-bold text-3xl pl-3 text-teal-700">
                {isEdit ? `Detalles del Pedido` : "Nuevo pedido"}
              </p>
            </div>
            <div>
              <input
                disabled={saving}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-10 z-10 top-5 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmPedido"
              />
            </div>
          </div>
          
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <div ref={blankRef} id='visible-blank' className="flex w-full h-full">
                {formik.values === null ? <Loader /> :
                  <FormikProvider value={formik}>
                    <form
                      id='frmPedido'
                      className='flex flex-col h-full w-full relative overflow-y-scroll'
                      onSubmit={formik.handleSubmit}>
                      <div className="absolute w-full flex flex-col px-4">
                        <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                          <div className="absolute w-full total-center -top-3">
                            <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                              Datos del Pedido
                            </div>
                          </div>
                          <div className="flex flex-row">
                            <CustomSelect
                              readOnly={id !== '0'}
                              name='Cliente'
                              className='input'
                              onChange={value => { formik.setFieldValue('cliente', value.value) }}
                              value={formik?.values.cliente}
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
                              onChange={value => { formik.setFieldValue('modelo', value.value) }}
                              value={formik.values ? formik.values.modelo : ""}
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
                        <div
                          className="relative flex h-full px-2 py-4 border-2 mx-2 my-4 border-slate-300"
                          style={{ height: `${blankRef.current.offsetHeight - 32}px` }}
                        >
                          <div className="absolute w-full total-center -top-3">
                            <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                              Datos de los Modelos
                            </div>
                          </div>
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
                              right={<SelectedFichas formik={formik} onErase={handleErase} />}
                            /> :
                            <SelectedFichas formik={formik} onErase={handleErase} />
                          }

                        </div>
                      </div>
                    </form>
                  </FormikProvider>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DetailPedido