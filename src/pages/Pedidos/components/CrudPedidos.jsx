import React from 'react'
import { useEffect, useRef, useState } from "react"
import { ICONS } from "../../../constants/icons"
import { useNavigate } from "react-router-dom";
import { get, values } from 'lodash'
import Inpt from '../../../components/Inputs/Inpt';
import { useFormik } from 'formik';
import Progress from './Progress';
import AbsScroll from '../../../components/AbsScroll';
import Table from '../../../components/Table';
import { formatDate } from '../../../constants/functions';
import Loader from '../../../components/Loader/Loader';
import GroupTable from '../../../components/GroupTable';

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
  { label: 'Días restantes', atr: 'diasRestantes' },
  { label: 'Pares terminados', atr: 'fraccion' },
  { label: 'Progreso del pedido', atr: 'porcentaje', Component: Progress }
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

  //const [loading, setLoading] = useState(true)

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

    console.log(clientes)
    console.log(newElements)

    setElementsGrouped(clientes)
    setElements(newElements)

  }, [
    allElements,
    controls.values,
  ])

  const handleSearchButtonClick = () => {
    if (controls?.values?.searchText?.length > 0) {
      searchRef?.current?.blur()
      controls.setFieldValue('searchText', "")
      return
    }
    searchRef?.current?.focus()
  }

  /*
  const isSelected = () => {
    let sel = false
    elements?.forEach(e => {
      if (e.isSelected) sel = true
    })
    return sel
  }

  const sortElements = () => {

    if (controls?.values?.sortParams.criteria === 0 || controls?.values?.sortParams.criteria === null) {
      return [...elements]
    }
    else {
      let newOrder = ([...elements].sort((a, b) => {
        let A = a[controls?.values?.sortParams.attribute]
        if (A === null) A = ''
        if (A != true && A != false && typeof A === 'string')
          A = A?.toLowerCase()
        let B = b[controls?.values?.sortParams.attribute]
        if (B === null) B = ''
        if (B != true && B != false && typeof B === 'string')
          B = B?.toLowerCase()

        if (A > B)
          return controls?.values?.sortParams.criteria === 1 ? 1 : -1
        else if (A < B)
          return controls?.values?.sortParams.criteria === 2 ? 1 : -1
        return 0
      }))
      return newOrder
    }
  }

  

  const handleSearch = () => {
    let val = (searchRef?.current?.value)
    if (val) val = val.trim().toLowerCase()
    let sortedElements = sortElements()
    let newElements = [...sortedElements].filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })
    setElements(newElements)
  }

  const onSortCriteriaChange = (attr) => {
    let newC
    if (controls?.values?.sortParams.attribute === attr)
      newC = { ...controls?.values?.sortParams, criteria: (controls?.values?.sortParams.criteria + 1) % 3 }
    else
      newC = { attribute: attr, criteria: 1 }
    controls.setFieldValue('sortParams', newC)
    sortElements()
  }

  const handleSelectAll = (e) => {
    let c = e.target.checked;
    setElements(prev => prev.map(e => ({ ...e, isSelected: c })))
  }

  const CustomRow = ({ element, onClick }) => {
    return (
      <>
        {
          columns.map((c, i) => {
            let value
            if (c.type && c.type === 'dateTime' && element[c.attribute] !== null)

              value = new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                hourCycle: 'h12',
                timeStyle: 'medium',
                timeZone: 'America/Mexico_City'

              }).format(new Date(element[c.attribute]));

            else if (c.type && c.type === 'date' && element[c.attribute] !== null) {

              value = new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                timeZone: 'UTC'
              }).format(new Date(element[c.attribute]));
            }

            else
              value = typeof c.attribute === 'function' ? c.attribute(element) : get(element, c.attribute) + '';
            let isBool = (value == 'true' || value == 'false' || value == '' || value == 'null')
            if (isBool) {
              if (value == 'true') value = 'Sí'
              else value = '--'
            }
            return typeof c.attribute !== 'function' ?
              <td
                className="px-4"
                key={'td' + i}
                onClick={onClick}>
                <p className="flex flex-row items-center">
                  {value}
                  {value === 'Activo' && <ICONS.Active className="ml-2 text-sm text-emerald-500" />}
                  {value === 'Inactivo' && <ICONS.Ghost className="ml-2 text-lg text-gray-500" />}
                </p>
              </td> :
              <td
                className="px-4"
                key={'td' + i}
                onClick={onClick}>
                <div className="flex flex-row justify-center">
                  {value}
                </div>
              </td>
          }
          )
        }
      </>
    )
  }

  const ThIcon = ({ attribute }) => {
    if (attribute === controls?.values?.sortParams.attribute) {
      if (controls?.values?.sortParams.criteria === 0)
        return <ICONS.Filter size="20px" className="filter-button" />
      else if (controls?.values?.sortParams.criteria === 1)
        return <ICONS.DownFill size="20px" />
      else
        return <ICONS.UpFill size="20px" />
    }
    else
      return <ICONS.Filter size="20px" className="filter-button" />
  }

  */
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
                    onChange={(e) => {
                      controls.handleChange(e)
                      //handleSearch()
                    }}
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

                  /*
                   */
                }

              </AbsScroll>
            </div>
            {/*<div
              id="table-container"
              className="relative flex w-full h-full overflow-x-scroll bg-gray-50">
              {loading ?
                <div className="absolute flex justify-center w-full p-10">
                  <Loader />
                </div> :
                <div className="w-full">
                  {
                    <table className="w-full bg-white customTable clic-row">
                      <thead className='text-center'>
                        <tr>

                          {
                            columns.map((c, i) =>
                              <th className='p-2 font-medium text-teal-800/80' key={"C" + i} >
                                {<div className="relative flex flex-row text-center total-center">
                                  <p className="px-6">{c.name} </p>
                                  <button
                                    onClick={() => onSortCriteriaChange(c.attribute)}
                                    className="absolute right-0 w-6 h-6 total-center">
                                    <ThIcon attribute={c.attribute} />
                                  </button>
                                </div>}
                              </th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          elements?.map((e, i) =>
                            <tr key={'C' + i}>
                              <CustomRow element={e} index={i} onClick={() => navigate(`/${path}/${e[idName]}`)} />
                            </tr>
                          )
                        }
                      </tbody>
                    </table>}
                </div>
              }

            </div>*/}
          </div>
        </div>
      </div>
    </div>

  )
}

export default CrudPedidos