import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from "../constants/icons";
import LabelToPrint from './LabelToPrint';
import Input from './Input';
import CustomSelect from './CustomSelect';
import { usePedidos } from "../pages/Pedidos/hooks/usePedidos";
import { get } from 'lodash';

const optionsLabel = [
  { value: 'Impresa', label: 'Impresas' },
  { value: 'No impresa', label: 'No impresas' },
  { value: 'Todas', label: 'Todas' },
]

const formatListToPrint = (list) => {
  return list.filter(e => e.isSelected).map(e => ({
    idProduccion: e.idProduccion,
    idPedido: e.idPedido,
    modelo: e.modelo,
    color: e.color,
    talla: e.tallaReal,
    numEtiqueta: e.numEtiqueta,
    cantidad: e.cantidad,
  }))
}

const EtiquetasModal = ({ columns, allEtiquetas, unique, onClose, title, onPrint }) => {

  const [list, setList] = useState(allEtiquetas)

  useEffect(() => {
    setList(allEtiquetas.map(e => ({ ...e, isSelected: false })))
  }, [allEtiquetas])

  const [selectedOption, setSelectedOption] = useState('Todas');
  const [cantidadLabels, setCantidadLabels] = useState(allEtiquetas?.length);

  const searchRef = useRef(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState({ atr: unique, ord: 1 })

  const unSelectAll = () => { setList(prev => prev.map(d => ({ ...d, isSelected: false }))) }

  const handleCheck = (id) => {
    setList(prev => prev.map(e => e[unique] === id ? ({ ...e, isSelected: !e.isSelected }) : e))
  }
  const handleCheckAll = (e) => {
    let v = e.target.checked
    setList(prev => {
      let newList = [...prev]
      newList
      // filtro del searchBar
      .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(search.toLowerCase())))
      // filtro de estado
      .filter(d => selectedOption === 'Todas' ? true : d.estado === selectedOption)
      // ordenamiento
      .sort((a, b) => {
        if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
        if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
      })
      // subarray de cantidad
      .forEach( (e,i) => { if(i < cantidadLabels) e.isSelected = v })
      return newList
    })
  }

  return (
    <div className='z-10 total-center h-screen w-full grayTrans absolute'>
      <div className='flex flex-col h-4/5 w-3/6 rounded-xl bg-white shadow-lg p-4 modal-box'>
        <div className='flex flex-row justify-between'>
          <button
            className='neutral-button p-1 text-white rounded-lg'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='25px' />
          </button>
          <div className="font-semibold text-3xl text-teal-700 ">
            {title}
          </div>
          <div className='flex justify-end'>
            <input
              type='button'
              className='bg-teal-500 p-1 w-28 text-white normal-button rounded-lg text-center'
              value="Imprimir"
              disabled={!list.some(e => e.isSelected)}
              onClick={() => onPrint(formatListToPrint(list))}
            />
          </div>

        </div>
        <div className="flex flex-row my-3">

          <div className='flex w-2/4'>
            <CustomSelect
              className='input z-50'
              onChange={e => { setSelectedOption(e.value); e.value === 'Todas' && setCantidadLabels(list.length); unSelectAll() }}
              value={selectedOption}
              options={optionsLabel}
              label='Mostrando:'
              withoutMargin={true}
            />

          </div>
          <div className='flex w-1/4'>
            <Input
              label='Cantidad:'
              type={'number'}
              value={allEtiquetas.length > cantidadLabels ? cantidadLabels : allEtiquetas.length}
              onChange={(e) => {setCantidadLabels(e.target.value); unSelectAll()}}
              max={allEtiquetas.length}
            />
          </div>

        </div>
        <div className="flex flex-row my-3 ">
          <div className="flex-grow flex items-center h-full bg-gray-100 shadow-sm rounded-full border-2">
            <input
              ref={searchRef}
              value={search}
              onChange={e => { setSearch(e.target.value); unSelectAll() }}
              className="w-full h-full pl-2 pr-10 py-1 outline-none bg-transparent rounded-lg" type="text" />
            <button
              type="button"
              onClick={() => search.length > 0 ? setSearch("") : searchRef?.current?.focus()}
              className="total-center h-6 w-6 neutral-button right-2 rounded-full">
              {search.length > 0 ? <ICONS.Cancel /> : <ICONS.Lupa />}
            </button>
          </div>
        </div>
        <div className='max-h-95 overflow-y-scroll '>
          {list.length > 0 && <table className="w-full bg-white customTable">
            <thead>
              <tr className="h-8 shadow-sm">
                <th className="px-2 sticky top-0 z-10 bg-white">
                  <input onChange={handleCheckAll} checked={list.some(e => e.isSelected)} type="checkbox" /></th>

                {columns.map((column, index) => (
                  <th className="hover-modal text-teal-700 pl-2 pr-8 whitespace-nowrap sticky top-0 z-10 bg-white" key={index}>
                    {column.name}
                    <div className="absolute p-1 right-0 w-8 h-8 top-0">
                      <button type="button" onClick={() => { setFilter(prev => ({ atr: column.atr, ord: (prev.atr === column.atr ? (prev.ord + 1) % 3 : 1) })) }}
                        className={((filter.atr === column.atr && filter.ord !== 0) ? "" : "elmt ") + "h-full w-full flex items-center justify-center"} >
                        {filter.atr === column.atr ? (filter.ord === 1 ? <ICONS.Down /> : (filter.ord === 2 ? <ICONS.Up /> : <ICONS.Filter />)) : <ICONS.Filter />}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list
                //filtro del searchBar
                .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(search.toLowerCase())))
                // filtro de estado
                .filter(d => selectedOption === 'Todas' ? true : d.estado === selectedOption)
                // ordenamiento
                .sort((a, b) => {
                  if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                  if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                })
                // subarray de cantidad
                .slice(0, cantidadLabels)
                .map((row, i) => (
                  <tr
                    onClick={() => handleCheck(row[unique])}
                    className="cursor-pointer h-8 duration-200 hover:bg-gray-100"
                    key={"R" + i}>
                    <td className="px-2 sticky">
                      <input readOnly checked={row?.isSelected | false} className="pointer-events-none" type="checkbox" />
                    </td>
                    {columns.map((column, j) => (
                      <td className="px-2 whitespace-nowrap" key={j}>{row[column.atr]}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>}
        </div>
      </div>
      {/*showLabelToPrint && <LabelToPrint list={listToPrint} onCloseModal={setShowLabelToPrint} />*/}
    </div>

  )
}

export default EtiquetasModal;
