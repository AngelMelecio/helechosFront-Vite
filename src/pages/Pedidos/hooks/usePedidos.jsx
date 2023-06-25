import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";
import { entorno } from "../../../constants/entornos";

const API_PEDIDOS_URL = "api/pedidos/"
const API_PEDIDO_URL = "api/pedido/"
const API_FICHAS_MATERIALES = "/api/fichas_tecnicas_materiales/"
const API_FICHAS_BY_MODELO = "/api/fichas_by_modelo/"

const PedidosContext = React.createContext('PedidosContext')

export function usePedidos() {
    return useContext(PedidosContext)
}

function formatPedidos(pedidos) {
    let formatData = pedidos.map((pedido) => ({
        ...pedido,
        isSelected: false,
        fechaRegistro: new Date(pedido.fechaRegistro).toLocaleString(),
        fechaEntrega: new Date(pedido.fechaEntrega).toLocaleDateString()
    }))
    return formatData
}

function formatFichas(fichas){
    let formatedFichas = fichas.map((ficha) => ({
        ...ficha,
        fechaCreacion: new Date(ficha.fechaCreacion).toLocaleString(),
        fechaUltimaEdicion: new Date(ficha.fechaUltimaEdicion).toLocaleString(),
        fotografia: entorno + ficha.fotografia
    }))
    return formatedFichas
}

export function PedidosProvider({ children }) {

    const { session, notify } = useAuth()

    const [allPedidos, setAllPedidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    function getPedido(id) {
        if(allPedidos.length!==0){
            let pedido = allPedidos.find(e => e.idPedido + '' === id + '')
            return pedido
        }
        
    }

    async function findPedido(id) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            setLoading(true)
            let pedido = await fetchAPI(API_PEDIDO_URL + id, options)
            return formatPedidos([pedido])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el pedido', true)
        } finally {
            setLoading(false)
        }
    }

    async function getPedidos() {
        //console.log('Getting 2')
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const pedidos = await fetchAPI(API_PEDIDOS_URL, options)
        //console.table(pedidos)
        return formatPedidos(pedidos)
    }

    async function refreshPedidos() {
        try {
            //console.log('Getting 1')
            setLoading(true)
            const pedidos = await getPedidos()
            setAllPedidos(pedidos)
        } catch (e) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    async function postPedido(pedido)
    {
        let options = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access },
            body: JSON.stringify(pedido)
        }
      
        setLoading(true)
        const response = await fetchAPI(API_PEDIDOS_URL, options)
        return response
        
    }

    async function getFichas(idModelo)
    {
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
                loading,
                errors,
                refreshPedidos,
                setLoading,
                getFichas,
                postPedido,
                findPedido,
            }}
        >
            {children}
        </PedidosContext.Provider>
    )
}
