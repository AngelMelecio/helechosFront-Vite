import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from "../constants/icons";
import { utils, writeFile } from "xlsx";

const Th = ({ children }) => <th className="sticky top-0 z-10 bg-slate-100">{children}</th>


const EtiquetasModal = ({ listaEtiquetas, onClose, title }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selecting, setSelecting] = useState(false);

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
            <div className='flex flex-col h-4/5 w-2/6 rounded-xl bg-white shadow-lg p-4 modal-box'>
                <div className='flex flex-row justify-between'>
                    <p className="font-semibold text-2xl text-teal-700">
                        {title}
                    </p>
                    <button
                        className='neutral-button p-1 text-white rounded-lg'
                        onClick={onClose}
                    >
                        <ICONS.Cancel className='m-0' size='25px' />
                    </button>
                </div>
                <div className="mb-3 p-1">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="px-3 py-2 border rounded w-full outline-none"
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
                            </tr>
                        </thead>
                        <tbody>
                            {listaEtiquetas.filter(item =>
                                item.idProduccion.toString().toLowerCase().includes(search.toLowerCase()) ||
                                item.talla.toString().toLowerCase().includes(search.toLowerCase()) ||
                                item.numEtiqueta.toLowerCase().includes(search.toLowerCase()))
                                .map((item, index) => (


                                    <tr key={'F' + index} className="array-row border border-transparent relative hover:bg-slate-200 duration-200">
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

                                        {/*<QrCode value={JSON.stringify(item)} className='w-8 h-8'/>*/}

                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-end'>
                    <input
                        type='button'
                        disabled={!selecting}
                        className='bg-teal-500 p-1 w-40 text-white normal-button rounded-lg text-center'
                        value="Exportar"
                        onClick={(e) => {
                            e.preventDefault();
                            const dataToExport = [];
                            selectedItems.map(item => {
                                delete item.isSelected;
                                dataToExport.push({
                                    etiqueta: JSON.stringify(item)
                                })
                            });

                            const ws = utils.json_to_sheet(dataToExport);
                            const wb = utils.book_new();
                            utils.book_append_sheet(wb, ws, "Etiquetas");
                            writeFile(wb, "Etiquetas " + new Date().toLocaleDateString() + ".xlsx");
                            onClose();
                        }}
                    />
                </div>

            </div>

        </div>
    )
}

export default EtiquetasModal;
