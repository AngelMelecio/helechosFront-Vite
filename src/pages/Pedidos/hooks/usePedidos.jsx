import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect} from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";
import { entorno } from "../../../constants/entornos";
import { set } from "lodash";

import useWebSocket from "../../../components/useWebSockets";
import { data } from "autoprefixer";
const WS_PEDIDOS_URL = "ws://localhost:8000/ws/pedidos/"

const API_PEDIDOS_URL = "api/pedidos/"
const API_PEDIDO_URL = "api/pedido/"
const API_FICHAS_MATERIALES = "/api/fichas_tecnicas_materiales/"
const API_FICHAS_BY_MODELO = "api/fichas_by_modelo/"
const API_GET_ETIQUETAS = "api/produccionByPedido/"
const API_IMPRESION_ETIQUETAS = "api/produccionPrint/"


const PedidosContext = React.createContext('PedidosContext')

export function usePedidos() {
    return useContext(PedidosContext)
}


function formatPedidos(pedidos) {
    let formatData = pedidos.map((pedido) => ({
        ...pedido,
        detalles: [...pedido.detalles.map((detalle) => ({
            ...detalle,
            cantidades: [...detalle.cantidades.map((cantidad) => ({
                ...cantidad,
                progreso: 
                    // Sacar las estaciones Unicas
                    [...new Set(cantidad.etiquetas.map(etiqueta => etiqueta.estacionActual))]
                        // Devolver una matris con el nombre de la estacion y la cantidad de etiquetas en esa estacion
                        .map(uniqueEstacion => [
                            uniqueEstacion,
                            [...cantidad.etiquetas.filter(et => et.estacionActual === uniqueEstacion)].length
                        ])
                
            }))]
        }))],
        isSelected: false,
        fechaRegistro: new Date(pedido.fechaRegistro).toLocaleString(),
        fechaEntrega: new Date(pedido.fechaEntrega).toLocaleDateString()
    }))
    return formatData
}

function formatFichas(fichas) {
    let formatedFichas = fichas.map((ficha) => ({
        ...ficha,
        fechaCreacion: new Date(ficha.fechaCreacion).toLocaleString(),
        fechaUltimaEdicion: new Date(ficha.fechaUltimaEdicion).toLocaleString(),
        fotografia: entorno + ficha.fotografia
    }))
    return formatedFichas
}

/*function formatEtiquetas(etiquetas) {
    let formatedEtiquetas = etiquetas.map((etiqueta) => ({
        ...etiqueta,
        isSelected: false
    }))
    return formatedEtiquetas
}*/

export function PedidosProvider({ children }) {

    const { session, notify } = useAuth()

    const [allPedidos, setAllPedidos] = useState([])
    const [allEtiquetas, setAllEtiquetas] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)
    const [dataPedido, setDataPedido] = useState(null)

    function formatPedidos(pedidos) {
        let formatData = pedidos.map((pedido) => ({
            ...pedido,
            isSelected: false,
            fechaRegistro: new Date(pedido.fechaRegistro).toLocaleString(),
            fechaEntrega: new Date(pedido.fechaEntrega).toLocaleDateString()
        }))
        return formatData
    }
    
    useEffect(() => {
        let etiquetasFormated=[]
        let modelo= dataPedido?.modelo.nombre
        let idPedido = dataPedido?.idPedido
        dataPedido?.detalles?.forEach((detalle) => {
            let colores ="";
            detalle?.fichaTecnica?.materiales.forEach((material) => {colores += material?.color+"\n"})
            detalle?.cantidades?.forEach((cantidad) => {
                cantidad?.etiquetas?.map((etiqueta) => {
                    etiquetasFormated.push({
                        ...etiqueta,
                        modelo: modelo,
                        idPedido: idPedido,
                        color: colores,
                        estado: etiqueta.fechaImpresion!==null?"Impresa":"No impresa",
                        isSelected: false,
                        talla: etiqueta.tallaReal,
                        numEtiqueta: Number(etiqueta.numEtiqueta)
                    })
                })
        
            })
        })
        setAllEtiquetas(etiquetasFormated)
    }, [dataPedido])
    


    async function findPedido(id) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            setLoading(true)
            let pedido = await fetchAPI(API_PEDIDO_URL + id, options)
            setDataPedido(pedido)
            return formatPedidos([pedido])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el pedido', true)
        } finally {
            setLoading(false)
        }
    }
    async function getPedidos() {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const pedidos = await fetchAPI(API_PEDIDOS_URL, options)
        return formatPedidos(pedidos)
    }
    /*async function getEtiquetas(idPedido) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            const etiquetas = await fetchAPI(API_GET_ETIQUETAS + idPedido, options)
            setAllEtiquetas(formatEtiquetas(etiquetas))
        } catch (e) {
            setErrors(e)
        }
    }*/
    async function refreshPedidos() {
        try {
            setLoading(true)
            const pedidos = await getPedidos()
            setAllPedidos(pedidos)
        } catch (e) {
            setErrors(e)
        } finally {
            setLoading(false)
        }
    }
    async function postPedido(pedido) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(pedido)
        }

        setLoading(true)
        const response = await fetchAPI(API_PEDIDOS_URL, options)
        return response
    }
    async function putProduccion(listIds) {
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(listIds)
        }

        setLoading(true)
        const response = await fetchAPI(API_IMPRESION_ETIQUETAS, options)
        return response
    }
    async function getFichas(idModelo) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const fichas = await fetchAPI(API_FICHAS_BY_MODELO + idModelo, options)
        return formatFichas(fichas)
    }

    return (
        <PedidosContext.Provider
            value={{
                allPedidos,
                allEtiquetas,
                loading,
                errors,
                refreshPedidos,
                setLoading,
                getFichas,
                postPedido,
                findPedido,
                putProduccion,
                setAllEtiquetas
            }}
        >
            {children}
        </PedidosContext.Provider>
    )
}
