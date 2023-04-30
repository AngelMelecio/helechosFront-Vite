import React, { useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import { API_URL } from "../../../constants/API_URL"
import { useEffect } from "react"
import { fetchAPI } from "../../../services/fetchApiService"
import { useContext } from "react"

const API_EMPLEADOS_URL = "api/empleados/"
const API_EMPLEADO_MAQUINAS_URL = "api/empleado_maquinas/"

const EmpleadosContext = React.createContext()

export function useEmpleados() {
    return useContext(EmpleadosContext)
}

function formatEmpleados(empleados) {
    let formatData = empleados.map((empl) => ({
        ...empl,
        isSelected: false,
        estado: empl.is_active ? "Activo" : 'Inactivo',
        fotografia: empl.fotografia ? API_URL + empl.fotografia : ''
    }))
    return formatData
}

export function EmpleadosProvider({ children }) {

    const { session, notify } = useAuth()

    const [allEmpleados, setAllEmpledos] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    function getEmpleado(id) {
        let empleado = allEmpleados.find(e => e.idEmpleado + '' === id + '')
        return empleado
    }

    async function getEmpleados() {
        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const empleados = await fetchAPI(API_EMPLEADOS_URL, options)
        return formatEmpleados(empleados)
    }

    async function refreshEmpleados() {
        try {
            setLoading(true)
            const empleados = await getEmpleados()
            setAllEmpledos(empleados)
        } catch (err) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }
    
    async function assignMaquinas(idEmpleado, maquinasIds) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify({ idEmpleado: idEmpleado, maquinas: maquinasIds }),
        }
        let { message } = await fetchAPI(API_EMPLEADO_MAQUINAS_URL, options)
        console.log(message)
    }
    
    async function postEmpleado(values, maquinas, method) {
        let Keys = [
            'nombre',
            'apellidos',
            'direccion',
            'telefono',
            'ns',
            'fotografia',
            'departamento',
            'is_active',
            'fechaEntrada',
            'fechaAltaSeguro',
        ]
        let formData = new FormData()
        Keys.forEach(k => {
            if (k === 'fotografia' && !(values[k] instanceof File)) return
            formData.append(k, values[k] ? values[k] : '')
        })
        const options = {
            method: method,
            headers: { 'Authorization': 'Bearer ' + session.access },
            body: formData
        }
        let { empleados, newId, message } = await fetchAPI(API_EMPLEADOS_URL + (method === 'PUT' ? values.idEmpleado : ''), options)
        console.log(message)
        if (maquinas.length > 0) {
            let maquinasIds = []
            maquinas.forEach(m => maquinasIds.push({ id: m.idMaquina }))
            await assignMaquinas(newId, maquinasIds)
        }
        return { message }
        //return formatEmpleados(empleados)
    }

    async function saveEmpleado({ values, maquinas = [], method = "POST" }) {
        try {
            setLoading(true)
            const { message } = await postEmpleado(values, maquinas, method)
            notify(message)
        } catch (err) {
            setErrors(err)
            notify('Error al guardar empleado', true)
        } finally {
            setLoading(false)
        }
    }
    


    return (
        <EmpleadosContext.Provider
            value={{
                allEmpleados,
                loading,
                errors,
                refreshEmpleados,
                getEmpleado,
                saveEmpleado,
            }}
        >
            {children}
        </EmpleadosContext.Provider>
    )
}
