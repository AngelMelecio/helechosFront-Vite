import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";

const API_CLIENTES_URL = "api/clientes/"

const ClientesContext = React.createContext('ClientesContext')

export function useClientes() {
    return useContext(ClientesContext)
}

export function ClientesProvider({ children }) {

    const { session } = useAuth()
    const [allClientes, setAllClientes] = useState([])
    const [loading, setLoading] = useState(true)

    async function getClientes() {
        let options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        }
        const clientes = await fetchAPI(API_CLIENTES_URL, options)
        let formatData = clientes.map((cliente) => ({
            ...cliente,
            isSelected: false,
        }))
        return formatData
    }

    async function refreshClientes() {
        try {
            setLoading(true)
            let clientes = await getClientes()
            setAllClientes(clientes)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ClientesContext.Provider
            value={{
                allClientes,
                loading,
                refreshClientes
            }}
        >
            {children}
        </ClientesContext.Provider>
    )
}