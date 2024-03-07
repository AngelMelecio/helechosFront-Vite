import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";

const API_PROVEEDORES_URL = "api/proveedores/"

const ProveedoresContext = React.createContext('ProveedoresContext')

export function useProveedores() {
    return useContext(ProveedoresContext)
}

function formatProveedores(proveedores) {
    let formatData = proveedores.map((prov) => ({
        ...prov,
        isSelected: false
    }))
    console.log('pedidos -> ',formatData)
    return formatData
}

export function ProveedoresProvider({ children }) {

    const { session, notify } = useAuth()

    const [allProveedores, setAllProveedores] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    function getProveedor(id) {
        if (allProveedores.length !== 0) {
            let proveedor = allProveedores.find(e => e.idProveedor + '' === id + '')
            return proveedor
        }
    }

    async function findProveedor(id) {

        try {
            setLoading(true)
            let options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + session.access }
            }
            let prov = await fetchAPI(API_PROVEEDORES_URL + id, options)
            return formatProveedores([prov])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el proveedor', true)
        } finally {
            setLoading(false)
        }
    }

    async function getProveedores() {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const proveedores = await fetchAPI(API_PROVEEDORES_URL, options)
        return formatProveedores(proveedores)
    }



    async function refreshProveedores() {
        try {
            setLoading(true)
            const proveedores = await getProveedores()
            setAllProveedores(proveedores)
        } catch (err) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    const postProveedor = async (values, method) => {
        let Keys = [
            'nombre',
            'rfc',
            'direccion',
            'telefono',
            'correo',
            'departamento',
            "contactos",
            "otro"
        ]
        let formData = new FormData()
        Keys.forEach(k => {
            if (k === "contactos")
                formData.append(k, values[k] ? JSON.stringify(values[k]) : '')
            else
                formData.append(k, values[k] ? values[k] : '')

        })
        const options = {
            method: method,
            headers: { 'Authorization': 'Bearer ' + session.access },
            body: formData
        }
        let { proveedores, message } = await fetchAPI(API_PROVEEDORES_URL + (method === 'PUT' ? values.idProveedor : ''), options)
        return { message }
    }

    const deleteProveedores = async (listaProveedores) => {
        for (let i = 0; i < listaProveedores.length; i++) {
            let e = listaProveedores[i]
            const options = { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + session.access } }
            if (e.isSelected) {
                try {
                    setLoading(true)
                    const { message } = await fetchAPI(API_PROVEEDORES_URL + e.idProveedor, options)
                    notify(message)
                } catch (err) {
                    setErrors(err)
                    notify('Error al eliminar el proveedor', true)
                } finally {
                    setLoading(false)
                }
            }
        }
    }

    async function saveProveedor({ values, method }) {
        try {
            setLoading(true)
            const { message } = await postProveedor(values, method)
            notify(message)
        } catch (err) {
            setErrors(err)
            notify('Error al guardar el proveedor', true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProveedoresContext.Provider
            value={{
                allProveedores,
                loading,
                errors,
                refreshProveedores,
                getProveedor,
                saveProveedor,
                deleteProveedores,
                findProveedor,
                setLoading
            }}
        >
            {children}
        </ProveedoresContext.Provider>
    )
}
