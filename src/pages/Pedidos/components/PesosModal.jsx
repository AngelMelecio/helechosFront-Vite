import React, { useEffect, useRef, useState } from 'react'
import AbsScroll from '../../../components/AbsScroll'
import Table from '../../../components/Table'
import ShowTable from './ShowTable'
import { API_URL } from '../../../constants/HOSTS'
import Lupa from '../../../assets/lupa.png'
import { usePedidos } from "./../hooks/usePedidos";

const PesosModal = ({ idPedido }) => {

    const { getMaterialesByPedido } = usePedidos()
    const [data, setData] = useState([])
    const [tabs, setTabs] = useState()
    const [allPesos, setAllPesos] = useState([])
    const [selectedTab, setSelectedTab] = useState(1)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (idPedido) {
            getMaterialesByPedido(idPedido)
                .then((res) => {
                    setData(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [idPedido])

    useEffect(() => {
        if (data) {
            console.log(data)
            setTabs(data.map((ft, i) => ({
                id: i + 1,
                label: ft.fichaTecnica.nombre
            })))

            setAllPesos(data.map((ft, i) => ({
                ...ft,
                materiales: ft.fichaTecnica.materiales.map((mat, j) => ({
                    id: mat.id,
                    tipo: mat.material.tipo,
                    color: mat.material.color,
                    codigo: <div className='w-5 h-5 rounded-full total-center' style={{ backgroundColor: mat.material.codigoColor }}></div>,
                    proveedor: mat.material.proveedor.nombre,
                    peso: Number(mat.peso).toFixed(2),
                    pesoOrdinario: (Number(mat.peso) * ft.cantidades.ordinario * 2 / 1000).toFixed(2),
                    pesoReposicion: (Number(mat.peso) * ft.cantidades.reposicion * 2 / 1000).toFixed(2),
                    pesoExtra: (Number(mat.peso) * ft.cantidades.extra * 2 / 1000).toFixed(2),
                    total: (Number(mat.peso) * (ft.cantidades.ordinario + ft.cantidades.reposicion + ft.cantidades.extra) * 2 / 1000).toFixed(2)
                }))
            })))
        }
    }, [data])

    useEffect(() => {

    }, [idPedido])

    const handleSelectTab = (id) => {
        let tab = document.getElementById(`TAB_${id}`)
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        setSelectedTab(id)
    }

    const Tab = ({ id, label }) => {
        return (

            <div
                id={`TAB_${id}`}
                className="relative h-8 max-w-[15rem]">
                <button
                    onClick={() => handleSelectTab(id)}
                    type="button"
                    className={`w-full h-full rounded-md px-4  font-semibold text-gray-500
                        ${selectedTab === id ? "text-teal-800/80 bg-white shadow-md" : "hover:bg-white"}
                        duration-200 active:opacity-70 active:duration-0 
                        overflow-hidden text-ellipsis  whitespace-nowrap
                        //ellipsis
                    `}
                //data-tooltip={label}
                >
                    {label}

                </button>
            </div>

        )
    }

    return (


        <div className="flex flex-col h-full">
            <h1 className="py-2 text-xl font-bold text-center text-teal-800/80">
                Consumo de materiales
            </h1>

            <div className="flex flex-col w-full h-full sm:flex-row">
                {/* Navbar */}
                <div className="w-full p-2 sm:w-40">
                    <div
                        ref={scrollRef}
                        className={`flex flex-row sm:flex-col  w-full h-full gap-2 px-2 pt-4 pb-2 overflow-x-scroll bg-gray-100 rounded-md`}>
                        {tabs?.map((tab, index) =>
                            <Tab
                                key={index}
                                label={tab.label}
                                id={tab.id}
                            />)
                        }
                    </div>
                </div>
                {allPesos[selectedTab - 1] &&

                    <div className='flex flex-col flex-grow h-full '>
                        {/* Total de pares */}
                        <div className="w-full p-3 ">

                            <div className='flex flex-row'>
                                {/* Image */}
                                <div className='object-cover w-28 h-28'>
                                    <img src={
                                        //Lupa
                                        `${API_URL}${allPesos[selectedTab - 1].fichaTecnica.fotografia}`
                                    }
                                        alt="" />
                                </div>
                                <div className='flex justify-around flex-grow'>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab - 1].cantidades.ordinario}</p>
                                        <p className='font-semibold text-teal-800/80'>Pares ordinario</p>
                                    </div>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab - 1].cantidades.reposicion}</p>
                                        <p className='font-semibold text-teal-800/80'>Pares reposicion</p>
                                    </div>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab - 1].cantidades.extra}</p>
                                        <p className='font-semibold text-teal-800/80'>Pares extra</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* Tabla de Pesos */}
                        <AbsScroll vertical horizontal>
                            <ShowTable
                                columns={[
                                    { label: "Tipo", atr: "tipo" },
                                    { label: "Color", atr: "color" },
                                    { label: "Código", atr: "codigo" },
                                    { label: "Proveedor", atr: "proveedor" },
                                    { label: "Peso por chinela (gr)", atr: "peso", sum: true },
                                    { label: "Peso ordinario (kg)", atr: "pesoOrdinario", sum: true },
                                    { label: "Peso reposición (kg)", atr: "pesoReposicion", sum: true },
                                    { label: "Peso extra (kg)", atr: "pesoExtra", sum: true },
                                    { label: "Total", atr: "total", sum: true },
                                ]}
                                data={allPesos[selectedTab - 1].materiales}
                            />
                        </AbsScroll>
                    </div>
                }
            </div>

        </div>
    )
}

export default PesosModal