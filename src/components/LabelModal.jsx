import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from "../constants/icons";
import Input from './Input';
import CustomSelect from './CustomSelect';
import Btton from './Buttons/Btton';

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
    od: e.od,
    tipo: e.tipo,
    destino: e.destino,
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
        .forEach((e, i) => { if (i < cantidadLabels) e.isSelected = v })
      return newList
    })
  }

  return (
    <div className='absolute z-10 w-full h-screen total-center grayTrans'>
      <div className='flex flex-col w-2/3 p-4 bg-white shadow-lg h-4/5 rounded-xl modal-box'>
        <div className='relative flex flex-row justify-center'>
          <Btton
            neutral
            className='absolute left-0 w-8 h-8 p-1 total-center'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='19px' />
          </Btton>
          <div className="text-xl font-bold text-teal-800/80 ">
            {title}
          </div>
          <div className='absolute right-0 flex'>
            <Btton
              type='button'
              className='h-8 px-8 total-center '
              disabled={!list.some(e => e.isSelected)}
              onClick={() => onPrint(formatListToPrint(list))}
            >Imprimir</Btton>
          </div>
        </div>

        <div className="grid grid-cols-[25%_20%_auto] py-6 gap-4 items-end">
          <div className='w-full'>
            <CustomSelect
              label='Mostrar'
              options={optionsLabel}
              className='z-50 input'
              onChange={e => { setSelectedOption(e.value); e.value === 'Todas' && setCantidadLabels(list.length); unSelectAll() }}
              value={selectedOption}
              withoutMargin={true}
            />

          </div>
          <div className='w-full'>
            <Input
              label='Cantidad:'
              type={'number'}
              value={allEtiquetas.length > cantidadLabels ? cantidadLabels : allEtiquetas.length}
              onChange={(e) => { setCantidadLabels(e.target.value); unSelectAll() }}
              max={allEtiquetas.length}
              showErrors={false}
            />
          </div>
          <div className='w-full'>
            <div className="relative flex items-center flex-grow h-10 rounded-full shadow-sm">
              <input
                ref={searchRef}
                value={search}
                onChange={e => { setSearch(e.target.value); unSelectAll() }}
                className="w-full h-full py-1 pl-2 pr-10 rounded-full outline-none bg-slate-100" type="text" />
              <button
                type="button"
                onClick={() => search.length > 0 ? setSearch("") : searchRef?.current?.focus()}
                className="absolute w-8 h-8 rounded-full total-center neutral-button right-1">
                {search.length > 0 ? <ICONS.Cancel /> : <ICONS.Lupa />}
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-y-scroll max-h-95 '>
          {list.length > 0 && <table className="w-full bg-white customTable">
            <thead>
              <tr className="h-10 ">
                <th className="sticky top-0 z-10 px-2 bg-white">
                  <div className="total-center">
                    <input className="inpt-check" onChange={handleCheckAll} checked={list.some(e => e.isSelected)} type="checkbox" />
                  </div>
                </th>

                {columns.map((column, index) => (
                  <th className="sticky top-0 z-10 pl-2 pr-8 bg-white text-teal-800/80 hover-modal whitespace-nowrap" key={index}>
                    {column.name}
                    <div className="absolute top-0 right-0 w-8 h-8 p-1">
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
                    className="h-8 duration-200 cursor-pointer hover:bg-gray-100"
                    key={"R" + i}>
                    <td className="sticky px-2">
                      <div className='total-center'>
                        <input readOnly checked={row?.isSelected | false} className="pointer-events-none inpt-check" type="checkbox" />
                      </div>
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
