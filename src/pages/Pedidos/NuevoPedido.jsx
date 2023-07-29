import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input";
import Loader from "../../components/Loader/Loader";
import { useClientes } from "../Clientes/hooks/useClientes";
import useModelos from "../Modelos/hooks/useModelos";
import { usePedidos } from "./hooks/usePedidos";
import Slider from "../../components/Slider";
import SelectedFichas from "./components/SelectedFichas";

const initPedido = {
  modelo: {
    idModelo: "",
    cliente: "",
  },
  fechaEntrega: "",
  detalles: []
}
const initRoute = {
  "creada": "tjeido",
  "tejido": null,
  "plancha": null,
  "corte": null,
  "calidad": null,
  "empaque": "empacado",
}

const defaultRoute = {
  "creada": "tejido",
  "tejido": "plancha",
  "plancha": "corte",
  "corte": "calidad",
  "calidad": "empaque",
  "empaque": "empacado",
}

const NuevoPedido = () => {

  const navigate = useNavigate();
  const { notify } = useAuth()
  
  const pageRef = useRef(null)
  
  const [saving, setSaving] = useState(false)
  const [pageScrollBottom, setPageScrollBottom] = useState(false)

  const { allClientes, refreshClientes } = useClientes()
  const [optionsCliente, setOptionsCliente] = useState([])
  
  const { getModelosCliente } = useModelos()
  const [optionsModelo, setOptionsModelo] = useState([])
  const [loadingModelos, setLoadingModelos] = useState(false)
  
  const { getFichas, postPedido } = usePedidos()
  const [allFichas, setAllFichas] = useState([])
  const [availableFichas, setAvailableFichas] = useState([])

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
        let formatValues = structuredClone(values)
        formatValues.modelo = formatValues.modelo.idModelo

        // Formatear los detalles
        formatValues.detalles.forEach(detalle => {

          // Crear la ruta a partir de las estaciones
          let rutaProduccion = { ...initRoute }
          let posRuta = "creada", posDef = "creada"
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
        const { message, pedido } = await postPedido(formatValues)
        notify(message)
        navigate('/pedidos')
      } catch (e) {
        notify('Error al crear pedido: ' + e.message, true)
      } finally {
        setSaving(false)
      }
    },
  });

  useEffect(() => {
    refreshClientes()
    formik.setValues(initPedido)
  }, [])

  useEffect(() => {
    setOptionsCliente(allClientes.map(cliente => ({ value: cliente.idCliente, label: cliente.nombre })))
  }, [allClientes])
  
  // Obtener modelos disponibles cuando el cliente seleccionado cambia
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
  
  // Obtener fichas disponibles cuando el modelo seleccionado cambia
  useEffect(async () => {
    let idmod = formik?.values?.modelo.idModelo
    if (!idmod) return
    try {
      let fichas = await getFichas(idmod)
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
                {"Nuevo pedido"}
              </p>
            </div>
            <input
              //disabled={saving}
              className='bg-teal-500 p-1 w-40 text-white normal-button rounded-lg'
              type="submit"
              value="Agregar"
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
                        <Input
                          name='fechaEntrega'
                          onChange={formik.handleChange}
                          value={formik.values ? formik.values.fechaEntrega : ""}
                          onBlur={formik.handleBlur}
                          label='Fecha de Entrega'
                          type="date"
                          errores={formik.errors.fechaEntrega && formik.touched.fechaEntrega ? formik.errors.fechaEntrega : null}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Seleccion de Fichas */}
                  <div className="screen flex flex-col">
                    {/*  HEADER */}
                    <div className="flex pt-8 pb-4 justify-between ">
                      <div className="flex items-center">
                        <p className="font-bold text-2xl pl-3 text-teal-700">
                          Selección de fichas técnicas
                        </p>
                      </div>
                    </div>
                    {/*  SLIDER */}
                    <div className="flex flex-col relative h-full bg-white rounded-lg ">
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
                      />
                    </div>
                  </div>
                </div>
              </form>
            </FormikProvider>
          }
        </div>
      </div>
    </>
  )
}
export default NuevoPedido