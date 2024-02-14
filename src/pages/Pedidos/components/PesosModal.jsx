import React, { useEffect, useRef, useState } from 'react'
import AbsScroll from '../../../components/AbsScroll'
import Table from '../../../components/Table'
import ShowTable from './ShowTable'
import { API_URL } from '../../../constants/HOSTS'
import Lupa from '../../../assets/lupa.png'


const data = [
    {
        "idDetallePedido": 83,
        "fichaTecnica": {
            "idFichaTecnica": 7,
            "nombre": "Primera version",
            "talla": "25/26.5/27",
            "fotografia": "/mediafiles/images/zp1.jpg",
            "materiales": [
                {
                    "id": 55,
                    "material": {
                        "idMaterial": 89,
                        "proveedor": {
                            "idProveedor": 16,
                            "nombre": "Consorcio Textil Universal"
                        },
                        "tipo": "Melting",
                        "color": "Gris",
                        "calibre": "300",
                        "tenida": "Tenido Natural",
                        "codigoColor": "#808080"
                    },
                    "peso": "123.0000"
                },
                {
                    "id": 56,
                    "material": {
                        "idMaterial": 90,
                        "proveedor": {
                            "idProveedor": 16,
                            "nombre": "Consorcio Textil Universal"
                        },
                        "tipo": "Lurex",
                        "color": "Plateado",
                        "calibre": "---",
                        "tenida": "Tenido Reactivo",
                        "codigoColor": "#C0C0C0"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 57,
                    "material": {
                        "idMaterial": 91,
                        "proveedor": {
                            "idProveedor": 10,
                            "nombre": "Hilos Maravilla S.A. de C.V."
                        },
                        "tipo": "Goma",
                        "color": "Blanco",
                        "calibre": "150",
                        "tenida": "Tenido Disperso",
                        "codigoColor": "#FFFFFF"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 58,
                    "material": {
                        "idMaterial": 92,
                        "proveedor": {
                            "idProveedor": 10,
                            "nombre": "Hilos Maravilla S.A. de C.V."
                        },
                        "tipo": "Licra desnuda",
                        "color": "Fucsia",
                        "calibre": "300",
                        "tenida": "Tenido Pigmentario",
                        "codigoColor": "#FF00FF"
                    },
                    "peso": "123.0000"
                },
                {
                    "id": 59,
                    "material": {
                        "idMaterial": 101,
                        "proveedor": {
                            "idProveedor": 12,
                            "nombre": "Retorcidos del Norte, S.L."
                        },
                        "tipo": "Goma",
                        "color": "Cian",
                        "calibre": "150",
                        "tenida": "Tenido Disperso",
                        "codigoColor": "#00FFFF"
                    },
                    "peso": "54.0000"
                },
                {
                    "id": 60,
                    "material": {
                        "idMaterial": 103,
                        "proveedor": {
                            "idProveedor": 11,
                            "nombre": "Textiles y Retorcidos S.A."
                        },
                        "tipo": "Poliester",
                        "color": "Naranja",
                        "calibre": "150",
                        "tenida": "Tenido Ácido",
                        "codigoColor": "#FFA500"
                    },
                    "peso": "144.0000"
                },
                {
                    "id": 61,
                    "material": {
                        "idMaterial": 104,
                        "proveedor": {
                            "idProveedor": 15,
                            "nombre": "Hilos y Colores del Mundo S.L."
                        },
                        "tipo": "Melting",
                        "color": "Verde Lima",
                        "calibre": "300",
                        "tenida": "Lavado Stone",
                        "codigoColor": "#32CD32"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 62,
                    "material": {
                        "idMaterial": 105,
                        "proveedor": {
                            "idProveedor": 15,
                            "nombre": "Hilos y Colores del Mundo S.L."
                        },
                        "tipo": "Lurex",
                        "color": "Rosa",
                        "calibre": "---",
                        "tenida": "Tenido Reactivo",
                        "codigoColor": "#FFC0CB"
                    },
                    "peso": "111.0000"
                },
                {
                    "id": 63,
                    "material": {
                        "idMaterial": 106,
                        "proveedor": {
                            "idProveedor": 14,
                            "nombre": "Entrelazados S.A. de C.V."
                        },
                        "tipo": "Goma",
                        "color": "Marfil",
                        "calibre": "150",
                        "tenida": "Tenido Natural",
                        "codigoColor": "#FFFFF0"
                    },
                    "peso": "100.0000"
                }
            ]
        },
        "cantidades": {
            "ordinario": 180,
            "reposicion": 0,
            "extra": 4
        }
    },
    {
        "idDetallePedido": 84,
        "fichaTecnica": {
            "idFichaTecnica": 8,
            "nombre": "Segunda version",
            "talla": "28/29/30",
            "fotografia": "/mediafiles/images/zp1_90pJxe8.jpg",
            "materiales": [
                {
                    "id": 64,
                    "material": {
                        "idMaterial": 89,
                        "proveedor": {
                            "idProveedor": 16,
                            "nombre": "Consorcio Textil Universal"
                        },
                        "tipo": "Melting",
                        "color": "Gris",
                        "calibre": "300",
                        "tenida": "Tenido Natural",
                        "codigoColor": "#808080"
                    },
                    "peso": "123.0000"
                },
                {
                    "id": 65,
                    "material": {
                        "idMaterial": 90,
                        "proveedor": {
                            "idProveedor": 16,
                            "nombre": "Consorcio Textil Universal"
                        },
                        "tipo": "Lurex",
                        "color": "Plateado",
                        "calibre": "---",
                        "tenida": "Tenido Reactivo",
                        "codigoColor": "#C0C0C0"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 66,
                    "material": {
                        "idMaterial": 91,
                        "proveedor": {
                            "idProveedor": 10,
                            "nombre": "Hilos Maravilla S.A. de C.V."
                        },
                        "tipo": "Goma",
                        "color": "Blanco",
                        "calibre": "150",
                        "tenida": "Tenido Disperso",
                        "codigoColor": "#FFFFFF"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 67,
                    "material": {
                        "idMaterial": 101,
                        "proveedor": {
                            "idProveedor": 12,
                            "nombre": "Retorcidos del Norte, S.L."
                        },
                        "tipo": "Goma",
                        "color": "Cian",
                        "calibre": "150",
                        "tenida": "Tenido Disperso",
                        "codigoColor": "#00FFFF"
                    },
                    "peso": "54.0000"
                },
                {
                    "id": 68,
                    "material": {
                        "idMaterial": 92,
                        "proveedor": {
                            "idProveedor": 10,
                            "nombre": "Hilos Maravilla S.A. de C.V."
                        },
                        "tipo": "Licra desnuda",
                        "color": "Fucsia",
                        "calibre": "300",
                        "tenida": "Tenido Pigmentario",
                        "codigoColor": "#FF00FF"
                    },
                    "peso": "123.0000"
                },
                {
                    "id": 69,
                    "material": {
                        "idMaterial": 104,
                        "proveedor": {
                            "idProveedor": 15,
                            "nombre": "Hilos y Colores del Mundo S.L."
                        },
                        "tipo": "Melting",
                        "color": "Verde Lima",
                        "calibre": "300",
                        "tenida": "Lavado Stone",
                        "codigoColor": "#32CD32"
                    },
                    "peso": "122.0000"
                },
                {
                    "id": 70,
                    "material": {
                        "idMaterial": 103,
                        "proveedor": {
                            "idProveedor": 11,
                            "nombre": "Textiles y Retorcidos S.A."
                        },
                        "tipo": "Poliester",
                        "color": "Naranja",
                        "calibre": "150",
                        "tenida": "Tenido Ácido",
                        "codigoColor": "#FFA500"
                    },
                    "peso": "144.0000"
                },
                {
                    "id": 71,
                    "material": {
                        "idMaterial": 105,
                        "proveedor": {
                            "idProveedor": 15,
                            "nombre": "Hilos y Colores del Mundo S.L."
                        },
                        "tipo": "Lurex",
                        "color": "Rosa",
                        "calibre": "---",
                        "tenida": "Tenido Reactivo",
                        "codigoColor": "#FFC0CB"
                    },
                    "peso": "111.0000"
                },
                {
                    "id": 72,
                    "material": {
                        "idMaterial": 106,
                        "proveedor": {
                            "idProveedor": 14,
                            "nombre": "Entrelazados S.A. de C.V."
                        },
                        "tipo": "Goma",
                        "color": "Marfil",
                        "calibre": "150",
                        "tenida": "Tenido Natural",
                        "codigoColor": "#FFFFF0"
                    },
                    "peso": "100.0000"
                }
            ]
        },
        "cantidades": {
            "ordinario": 270,
            "reposicion": 0,
            "extra": 5
        }
    }
]

const PesosModal = ({ idPedido }) => {

    const [tabs, setTabs] = useState()
    const [allPesos, setAllPesos] = useState([])
    const [selectedTab, setSelectedTab] = useState(1)
    const scrollRef = useRef(null)


    useEffect(() => {
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
                        ${selectedTab === id ? "text-teal-700 bg-white shadow-md" : "hover:bg-white"}
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
            <h1 className="py-2 text-xl font-bold text-center text-teal-700">
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
                                        Lupa
                                        //`${API_URL}${allPesos[selectedTab-1].fichaTecnica.fotografia}`
                                    }
                                        alt="" />
                                </div>
                                <div className='flex justify-around flex-grow'>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab-1].cantidades.ordinario}</p>
                                        <p className='font-semibold text-emerald-700'>Pares ordinario</p>
                                    </div>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab-1].cantidades.reposicion}</p>
                                        <p className='font-semibold text-emerald-700'>Pares reposicion</p>
                                    </div>
                                    <div className='flex-col total-center'>
                                        <p className='text-xl font-bold text-gray-600'>{allPesos[selectedTab-1].cantidades.extra}</p>
                                        <p className='font-semibold text-emerald-700'>Pares extra</p>
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