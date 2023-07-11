import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from "../constants/icons";
import LabelToPrint from './LabelToPrint';
import CustomSelect from './CustomSelect';

const Th = ({ children }) => <th className="sticky top-0 z-10 bg-slate-100">{children}</th>


const EtiquetasModal = ({ listaEtiquetas, onClose, title }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selecting, setSelecting] = useState(false);
    const [showLabelToPrint, setShowLabelToPrint] = useState(false);
    const optionsLabel = [
        { value: 'Impresa', label: 'Impresa' },
        { value: 'No impresa', label: 'No impresa' },
        { value: 'Todas', label: 'Todas' },
    ]

    useEffect(() => {
        (selectedItems.length > 0) ? setSelecting(true) : setSelecting(false);
    }, [selectedItems]);

    useEffect(() => {
        // Cuando el componente recibe una nueva lista de etiquetas, actualiza los elementos seleccionados
        setSelectedItems(listaEtiquetas.filter(etiqueta => etiqueta.isSelected));
    }, [listaEtiquetas]);

    const handleSelect = (item) => {
        if (selectedItems.some(i => i.idProduccion === item.idProduccion)) {
            setSelectedItems(selectedItems.filter(i => i.idProduccion !== item.idProduccion));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    const handleSelectAll = () => {
        const filteredItems = listaEtiquetas.filter(item => item.modelo.toLowerCase().includes(search.toLowerCase()) || item.color.toLowerCase().includes(search.toLowerCase()));
        if (selectedItems.length === filteredItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredItems);
        }
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
                    <div className="font-semibold text-2xl text-teal-700 ">
                        {title}
                    </div>
                    <div className='flex justify-end'>
                        <input
                            type='button'
                            disabled={!selecting}
                            className='bg-teal-500 p-1 w-28 text-white normal-button rounded-lg text-center'
                            value="Imprimir"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowLabelToPrint(true);
                            }}
                        />
                    </div>

                </div>
                <div className="flex flex-row my-3 justify-between">

                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="border rounded w-full outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                   

                </div>

                <div className='max-h-95 overflow-y-scroll'>
                    <table className="w-full">
                        <thead>
                            <tr className="font-medium text-teal-700">
                                <Th>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.length === listaEtiquetas.length}
                                    />
                                </Th>
                                <Th>ID</Th>
                                <Th>Talla</Th>
                                <Th>Cantidad</Th>
                                <Th>Número Etiqueta</Th>
                                <Th>Estado</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaEtiquetas.filter(item =>
                                item.idProduccion.toString().toLowerCase().includes(search.toLowerCase()) ||
                                item.talla.toString().toLowerCase().includes(search.toLowerCase()) ||
                                item.numEtiqueta.toLowerCase().includes(search.toLowerCase()))
                                .map((item, index) => (


                                    <tr key={'F' + index} className="array-row border-y-2 relative hover:bg-slate-200 duration-200">
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.some(i => i.idProduccion === item.idProduccion)}
                                                onChange={() => handleSelect(item)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                readOnly
                                                className="flex w-full p-1 outline-none bg-transparent text-center"
                                                value={item.idProduccion}
                                                type="text" />
                                        </td>
                                        <td>
                                            <input
                                                readOnly
                                                className="flex w-full p-1 outline-none bg-transparent text-center"
                                                value={item.talla}
                                                type="text" />
                                        </td>
                                        <td>
                                            <input
                                                readOnly
                                                className="flex w-full p-1 outline-none bg-transparent text-center"
                                                value={item.cantidad}
                                                type="text" />
                                        </td>
                                        <td>
                                            <input
                                                readOnly
                                                className="flex w-full p-1 outline-none bg-transparent text-center"
                                                value={item.numEtiqueta}
                                                type="text" />
                                        </td>
                                        <td>
                                            <input
                                                readOnly
                                                className="flex w-full p-1 outline-none bg-transparent text-center"
                                                value="Impresa"
                                                type="text" />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>


            </div>
            {showLabelToPrint && <LabelToPrint list={selectedItems} onCloseModal={setShowLabelToPrint} />}
        </div>

    )
}

export default EtiquetasModal;
