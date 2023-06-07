import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";

const API_PEDIDOS_URL = "api/pedidos/"

const PedidosContext = React.createContext('PedidosContext')

export function usePedidos() {
    return useContext(PedidosContext)
}

function formatPedidos(pedidos) {
    let formatData = pedidos.map((pedido) => ({
        ...pedido,
        isSelected: false,
    }))
    return formatData
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
            let pedido = await fetchAPI(API_PEDIDOS_URL + id, options)
            return formatPedidos([pedido])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el pedido', true)
        } finally {
            setLoading(false)
        }
    }

    async function getPedidos() {
        console.log('Getting 2')
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const pedidos = await fetchAPI(API_PEDIDOS_URL, options)
        console.table(pedidos)
        return formatPedidos(pedidos)
    }

    async function refreshPedidos() {
        try {
            console.log('Getting 1')
            setLoading(true)
            const pedidos = await getPedidos()
            setAllPedidos(pedidos)
        } catch (e) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    

    return (
        <PedidosContext.Provider
            value={{
                allPedidos,
                loading,
                errors,
                refreshPedidos,
                setLoading
            }}
        >
            {children}
        </PedidosContext.Provider>
    )
}
