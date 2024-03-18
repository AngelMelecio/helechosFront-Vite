import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";
import { useClientes } from "../Clientes/hooks/useClientes";
import useModelos from "../Modelos/hooks/useModelos";
import { usePedidos } from "./hooks/usePedidos";
import Slider from "../../components/Slider";
import SelectedFichas from "./components/SelectedFichas";
import OptsInpt from "../../components/Inputs/OptsInpt";
import FieldsBox from "../../components/FieldsBox";
import Inpt from "../../components/Inputs/Inpt";
import OptionsInpt from "../../components/Inputs/OptsInpt";

const initPedido = {
  modelo: {
    idModelo: "",
    cliente: "",
  },
  fechaEntrega: "",
  detalles: [],
  ordenProduccion: "",
  tipo: "Produccion",
}
const initRoute = {
  "creada": "tjeido",
  "tejido": null,
  "plancha": null,
  "calidad": null,
  "corte": null,
  "empaque": "empacado",
}

const defaultRoute = {
  "creada": "tejido",
  "tejido": "plancha",
  "plancha": "calidad",
  "calidad": "corte",
  "corte": "empaque",
  "empaque": "empacado",
}

const optionsTipo = [
  { value: 'Produccion', label: 'Produccion' },
  { value: 'Muestra', label: 'Muestra' },
  { value: 'Almacen', label: 'Almacen' },
  { value: 'Faltante', label: 'Faltante' },
  { value: 'Reposicion', label: 'Reposicion' },
  { value: 'Otro', label: 'Otro' }
]

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
    if (values.ordenProduccion === "") errors.ordenProduccion = "Ingrese una orden de producción"

    values.detalles?.forEach((detalle, i) => {
      detalle.cantidades.forEach((cantidad, j) => {
        if (cantidad.cantidad === "")
          errors[`detalles[${i}].cantidades[${j}].cantidad`] = "Ingrese una cantidad"
        if (cantidad.paquete === "" || Number(cantidad.paquete) > Number(cantidad.cantidad))
          errors[`detalles[${i}].cantidades[${j}].paquete`] = "Ingrese un paquete válido"
      })
    })
    return errors
  }

  const formik = useFormik({
    initialValues: initPedido,
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
      //console.log(modelos)
      setOptionsModelo(modelos.map(modelo => ({ value: modelo.idModelo, label: modelo.nombre })))
    } catch (e) {
      //console.log(e)
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
          "calidad": true,
          "corte": true,
          "empaque": true,
        },
        cantidades: [
          ...f.talla.split('/').map(t => ({
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
        className="relative w-full h-full overflow-y-scroll">
        <div id="tbl-page" className="relative flex flex-col w-full p-4 bg-slate-100">
          {/*  PAGE HEADER  */}
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/pedidos')}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {"Nuevo pedido"}
              </p>
            </div>
            <input
              //disabled={saving}
              className='w-40 p-1 text-white bg-teal-500 rounded-lg normal-button'
              type="submit"
              value="Agregar"
              form="frmPedido"
            />
          </div>
          {formik.values === null ? <Loader /> :
            <FormikProvider value={formik}>
              <form
                id='frmPedido'
                className='relative flex flex-col w-full h-full '
                onSubmit={formik.handleSubmit}>
                <div className="flex flex-col w-full">
                  {/* DATOS DEL PEDIDO */}
                  <div className="p-6 bg-white rounded-md shadow-md">

                    <div className="flex w-full">

                      <FieldsBox title="Datos del pedido">
                        <div className="flex flex-row gap-6">
                          <OptsInpt
                            label='Cliente'
                            name='modelo.cliente'
                            value={formik.values.modelo.cliente}
                            options={optionsCliente}
                            formik={formik}
                            placeholder='Seleccione'
                          />
                          <OptsInpt
                            loading={loadingModelos}
                            label='Modelo'
                            name='modelo.idModelo'
                            value={formik.values.modelo.idModelo}
                            options={optionsModelo}
                            formik={formik}
                            placeholder='Seleccione'
                          />
                        </div>
                        <div className='flex flex-row gap-6'>
                          <OptionsInpt
                            label="Tipo de pedido"
                            name='tipo'
                            options={optionsTipo}
                            formik={formik}
                          />
                          <Inpt
                            label='Orden de producción' type='text' name='ordenProduccion'
                            formik={formik}
                          />
                          <Inpt
                            name='fechaEntrega'
                            label='Fecha de Entrega'
                            type="date"
                            formik={formik}
                          />
                        </div>
                      </FieldsBox>
                    </div>
                  </div>
                  {/* Seleccion de Fichas */}
                  <div className="flex flex-col screen">
                    {/*  HEADER */}
                    <div className="flex justify-between pt-8 pb-4 ">
                      <div className="flex items-center">
                        <p className="pl-3 text-2xl font-bold text-teal-800/80">
                          Selección de fichas técnicas
                        </p>
                      </div>
                    </div>
                    {/*  SLIDER */}
                    <div className="relative flex flex-col h-full bg-white rounded-lg ">
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