import React from 'react'
import { useEffect, useRef, useState } from "react"
import { ICONS } from "../../../constants/icons"
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import Progress from './Progress';
import AbsScroll from '../../../components/AbsScroll';
import Table from '../../../components/Table';
import { formatDate } from '../../../constants/functions';
import GroupTable from '../../../components/GroupTable';

const sumFraction = (data) => {
  return (`
    ${data.reduce((acc, curr) => {
    return acc + Number(curr.split('/')[0])
  }, 0)} / 
    ${data.reduce((acc, curr) => {
    return acc + Number(curr.split('/')[1])
  }, 0)}
  `)
}
const arrayAvg = (data) => {

  return Number((data.reduce((acc, curr) => {
    return acc + (Number(curr) || 0)
  }, 0) / data.length).toFixed(2))
}

const groupTabs = [
  { value: 0, label: 'Todos' },
  { value: 1, label: 'Pendientes' }
]

const mainRowsRef = 'cliente'
const subRowsRef = 'pedidos'

const clienteColumns = [
  { label: 'ID', atr: 'idCliente' },
  { label: 'Nombre', atr: 'nombreCliente', search: true },
  { label: 'Pares terminados', atr: 'fraccion' },
  { label: 'Progreso del cliente', atr: 'porcentaje', Component: Progress }
]

const pedidosColumns = [
  { label: 'ID', atr: 'idPedido' },
  { label: 'Orden de compra', atr: 'ordenCompra', search: true },
  { label: 'Cliente', atr: 'nombreCliente' },
  { label: 'Modelo', atr: 'nombreModelo', search: true },
  { label: 'Fecha de entrega', atr: 'fechaEntrega', Component: formatDate },
  { label: 'Días restantes', atr: 'diasRestantes', footLabel: "TOTAL:" },
  { label: 'Pares terminados', atr: 'fraccion', total: true, totalFunction: sumFraction },
  { label: 'Progreso del pedido', atr: 'porcentaje', total: true, totalFunction: arrayAvg, Component: Progress }
]

const Tab = ({ children, active, ...props }) => {
  return (
    <div
      className={`cursor-pointer hover:bg-white duration-100 rounded-md font-medium text-sm h-6 px-6 total-center ${active ? 'bg-white text-teal-700 shadow-md' : 'text-gray-600'}`}
      {...props}
    >
      {children}
    </div>
  )

}

const CrudPedidos = ({
  title,
  idName,
  path,
  loading,
  allElements,
}) => {

  const [elements, setElements] = useState(allElements)
  const [elementsGrouped, setElementsGrouped] = useState([])

  const searchRef = useRef()

  const controls = useFormik({
    initialValues: {

      groupByClient: false,
      vista: 0, // 0 todos, 1 pendientes
      searchText: ''
    },
    validate: (values) => {
      const errors = {}
      return errors
    },
    onSubmit: async (values) => {
      console.log('submit')
    }
  })

  // Cuando cambia algun control del CRUD
  useEffect(() => {

    let newElements = [...allElements]

    // Filtra los elementos segun la vista
    if (controls?.values?.vista === 1) {
      newElements = newElements.filter(e => e.estado === 'Pendiente')
    }
    // Filtrar por texto
    let searchText = controls?.values?.searchText?.toLowerCase()
    // Dependiendo si hay agrupacion por cliente, se filtra por diferentes columnas
    let cols = controls?.values?.groupByClient ? clienteColumns : pedidosColumns

    newElements = newElements.filter(e => {
      return cols.some(col => {
        return col.search && e[col.atr] && e[col.atr].toLowerCase().includes(searchText)
      })
    })

    // marks the idclient with the index in the list
    let mark = new Map()

    // the list of clientes
    let clientes = []

    // Gruping by client
    newElements.forEach(p => {
      if (!mark.has(p.idCliente)) {
        mark.set(p.idCliente, clientes.length)
        clientes.push({
          idCliente: p.idCliente,
          nombreCliente: p.nombreCliente,
          progreso: p.progreso,
          total: p.total,
          pedidos: [p]
        })
      } else {
        let cliente = clientes[mark.get(p.idCliente)]
        cliente.pedidos.push(p)
        cliente.progreso += p.progreso
        cliente.total += p.total
      }
    })
    // Calculando porcentaje de cada cliente
    clientes.forEach(c => {
      c.porcentaje = Number((Number(c.progreso) * 100 / Number(c.total)).toFixed(2))
      c.fraccion = `${c.progreso} / ${c.total}`
    })
    setElementsGrouped(clientes)
    setElements(newElements)

  }, [
    allElements,
    controls.values,
  ]
  )

  const handleSearchButtonClick = () => {
    if (controls?.values?.searchText?.length > 0) {
      searchRef?.current?.blur()
      controls.setFieldValue('searchText', "")
      return
    }
    searchRef?.current?.focus()
  }

  const navigate = useNavigate();

  return (
    <div className="relative flex w-full h-full pl-18 bg-slate-100">
      <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Page Header */}
          <div className="flex justify-between pb-2">
            <h1 className="pl-3 text-2xl font-bold text-teal-800/80">{title}</h1>
            <div className="flex flex-row" id="butons">
              <button
                onClick={() => navigate(`/${path}/0`)}
                className='h-10 px-8 font-medium text-white bg-teal-500 rounded-lg total-center normal-button'>
                Nuevo pedido
              </button>
            </div>
          </div>

          <div className="flex flex-col h-full overflow-hidden bg-white shadow-lg">
            <div className="flex flex-col px-5 py-4 rounded-t-lg" >
              <div className="flex justify-between w-full gap-4">

                {/* Botones */}
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium text-teal-800/80'>
                    Agrupar por cliente
                  </p>
                  <input
                    name="groupByClient"
                    onChange={controls.handleChange}
                    className='switch'
                    type="checkbox"
                    checked={controls.values.groupByClient}
                  />
                </div>
                {/* Filtros */}
                <div className='flex items-center flex-grow gap-6 p-1 px-2 rounded-md bg-slate-100'>
                  <div className='flex items-center gap-2'>
                    <p className=' total-center text-teal-800/80'>
                      <ICONS.Filter
                        onClick={() => console.log(controls.values)}
                        size="20px" />
                    </p>
                    {[groupTabs.map((tab, indx) =>
                      <Tab
                        key={indx}
                        active={controls.values.vista === tab.value}
                        onClick={() => controls.setFieldValue('vista', tab.value)}
                      >
                        {tab.label}
                      </Tab>)]
                    }
                  </div>
                </div>
                {/* Search Bar */}
                <div
                  id="searchbar"
                  className="relative flex items-center w-80">
                  <input
                    id='search-input'
                    name="searchText"
                    className='w-full h-full py-1 pl-3 pr-10 outline-none rounded-2xl bg-slate-100'
                    ref={searchRef}
                    onChange={controls.handleChange}
                    value={controls?.values?.searchText}
                    type="text"
                  />
                  <button
                    onClick={handleSearchButtonClick}
                    className='absolute w-6 h-6 right-1 total-center opacity-white rounded-2xl'>
                    {
                      controls?.values?.searchText?.length > 0 ?
                        <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                        <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
                    }
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full h-full ">
              <AbsScroll
                vertical
                horizontal
                loading={loading}
              >
                {
                  !controls?.values?.groupByClient ?
                    <Table
                      data={elements}
                      columns={pedidosColumns}
                      unique="idPedido"
                      search="off"
                      handleRowClick={(row) => navigate(`/${path}/${row[idName]}`)}
                    />
                    :
                    <GroupTable
                      data={elementsGrouped}
                      columns={clienteColumns}
                      unique="idCliente"
                      search="off"

                      subRowsRef={subRowsRef}
                      subRowsColumns={pedidosColumns}
                      subRowsUnique="idPedido"

                      handleSubRowClick={(row) => navigate(`/${path}/${row[idName]}`)}
                    />
                }
              </AbsScroll>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CrudPedidos