import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from "../constants/icons";
import LabelToPrint from './LabelToPrint';
import Input from './Input';
import CustomSelect from './CustomSelect';
import { usePedidos } from "../pages/Pedidos/hooks/usePedidos";
import { get } from 'lodash';

const EtiquetasModal = ({ columns, list, unique, onClose, title }) => {

    const {putProduccion} = usePedidos();

    const [selectedItems, setSelectedItems] = useState([]);

    const [showLabelToPrint, setShowLabelToPrint] = useState(false);
    const optionsLabel = [
        { value: 'Impresa', label: 'Impresas' },
        { value: 'No impresa', label: 'No impresas' },
        { value: 'Todas', label: 'Todas' },
    ]

    const [listToPrint, setListToPrint] = useState([]);

    async function getListToPrint() {
        const listToPrint = list.filter(item => selectedItems.includes(item.idProduccion));
        listToPrint.forEach(element => {
            delete element.isSelected;
            delete element.estado;
            element.estado='Impresa';
        });
        setListToPrint(listToPrint);
    }

    async function getListToUpdete() {
        const listToUpdete = []
        selectedItems.forEach(id => {
            listToUpdete.push({idProduccion: id});
        });
        return listToUpdete;
    }

    const [selectedOption, setSelectedOption] = useState('Todas');
    const [cantidadLabels, setCantidadLabels] = useState(list?.length);

    /***   Table Controls  ***/
    const [data, setData] = useState([])

    useEffect(() => {
        let updatedData = [...list];
        data.map(item => {
            const index = updatedData.findIndex(i => i.idProduccion === item.idProduccion);
            if (index !== -1) {
                updatedData[index] = item;
                list[index] = item;
            }
        });
        
        if (selectedOption !== 'Todas') {
            updatedData = updatedData.filter(item => item.estado === selectedOption);
        }

        if (cantidadLabels <=updatedData.length) {
            updatedData = updatedData.slice(0, cantidadLabels);
        }

        setData(updatedData);
    }, [list, selectedOption, cantidadLabels]);


    useEffect(() => setData(list), [list])

    const searchRef = useRef(null)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState({ atr: unique, ord: 1 })

    const unSelectAll = () => { setData(data.map(d => ({ ...d, isSelected: false }))); setSelectedItems([]) }

    const handleCheck = (id) => {
        let i = data.findIndex(e => e[unique] === id)
        let c = [...data]
        c[i].isSelected = !c[i].isSelected
        setData(c)
        setSelectedItems(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])

    }
    const handleCheckAll = (e) => {
        let v = e.target.checked
        setData(prev => prev.map(e => ({ ...e, isSelected: v })))
        setSelectedItems(v ? data.map(e => e[unique]) : [])
    }

    let someSelected = data.some(d => d.isSelected)

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
                            disabled={selectedItems.length === 0}
                            onClick={async (e) => {
                                e.preventDefault();
                                await getListToPrint();
                                setShowLabelToPrint(true);
                                putProduccion(await getListToUpdete());
                            }}
                        />
                    </div>

                </div>
                <div className="flex flex-row my-3">

                    <div className='flex w-2/4'>
                        <CustomSelect
                            className='input z-50'
                            onChange={option =>{ setSelectedOption(option.value); option.value === 'Todas' && setCantidadLabels(list.length)}}
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
                            value={data.length > cantidadLabels ? cantidadLabels : data.length}
                            onChange={(e) => setCantidadLabels(e.target.value)}
                            max={data.length}
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
                    {data.length > 0 && <table className="w-full bg-white customTable">
                        <thead>
                            <tr className="h-8 shadow-sm">
                                <th className="px-2 sticky top-0 z-10 bg-white">
                                    <input onChange={handleCheckAll} checked={someSelected} type="checkbox" /></th>

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
                            {data.filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(search.toLowerCase())))
                                .sort((a, b) => {
                                    if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                                    if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                                })
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
            {showLabelToPrint && <LabelToPrint list={listToPrint} onCloseModal={setShowLabelToPrint} />}
        </div>

    )
}

export default EtiquetasModal;
