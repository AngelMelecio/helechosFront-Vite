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
    let formatData = proveedores.map(([prov]) => ({
        ...prov,
        isSelected: false
    }))
    return formatData
}

export function ProveedoresProvider({ children }) {

    const { session, notify } = useAuth()

    const [allProveedores, setAllProveedores] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    function getProveedor(id) {
        let proveedor = allProveedores.find(e => e.idProveedor + '' === id + '')
        return proveedor
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
        } catch (e) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    const postProveedor = async (values, method) => {
        console.log('POST: ', values)
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
            if(k==="contactos")
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
            const options = {method: 'DELETE', headers: {'Authorization': 'Bearer ' + session.access}}
            if (e.isSelected) { 
                try {
                    setLoading(true)
                    const { message } = await fetchAPI(API_PROVEEDORES_URL + e.idProveedor, options)
                    notify(message)
                } catch (err) {
                    console.log(err)
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
            console.log(err)
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
                deleteProveedores
            }}
        >
            {children}
        </ProveedoresContext.Provider>
    )
}
