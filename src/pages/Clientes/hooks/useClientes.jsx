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

function formatClientes(clientes) {
    let formatData = clientes.map((clie) => ({
        ...clie,
        isSelected: false,
    }))
    return formatData
}

export function ClientesProvider({ children }) {

    const { session, notify } = useAuth()

    const [allClientes, setAllClientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    function getCliente(id) {
        let cliente = allClientes.find(e => e.idCliente + '' === id + '')
        return cliente
    }

    async function getClientes() {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const clientes = await fetchAPI(API_CLIENTES_URL, options)
        return formatClientes(clientes)
    }

    async function refreshClientes() {
        try {
            setLoading(true)
            const clientes = await getClientes()
            setAllClientes(clientes)
        } catch (e) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    const postCliente = async (values, method) => {
        console.log('POST: ', values)
        let Keys = [
            'nombre',
            'direccion',
            'rfc',
            'telefono',
            'correo',
            'contactos',
            'otros',
        ]
        let formData = new FormData()
        Keys.forEach(k => {
            if (k === 'contactos') 
                formData.append(k, values[k] ? JSON.stringify(values[k]) : '')
            else
                formData.append(k, values[k] ? values[k] : '')
        })
        const options = {
            method: method,
            headers: { 'Authorization': 'Bearer ' + session.access },
            body: formData
        }
        let { clientes, message } = await fetchAPI(API_CLIENTES_URL + (method === 'PUT' ? values.idCliente : ''), options)
        return { message }
        //return formatClientes(clientes)
    }



    async function saveCliente({ values, method }) {
        try {
            setLoading(true)
            const { message } = await postCliente(values, method)
            notify(message)
        } catch (err) {
            console.log(err)
            setErrors(err)
            notify('Error al guardar cliente', true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ClientesContext.Provider
            value={{
                allClientes,
                loading,
                errors,
                refreshClientes,
                getCliente,
                saveCliente
            }}
        >
            {children}
        </ClientesContext.Provider>
    )
}
