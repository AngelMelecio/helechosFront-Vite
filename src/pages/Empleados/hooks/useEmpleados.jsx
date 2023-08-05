import React, { useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import { API_URL } from "../../../constants/HOSTS"
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
  const [loadingEmpleadoMaquinas, setLoadingEmpleadoMaquinas] = useState(true)
  const [errors, setErrors] = useState(false)

  async function getEmpleado(id) {
    const options = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    try {
      setLoading(true)
      const empleado = await fetchAPI(API_EMPLEADOS_URL + id, options)
      return formatEmpleados([empleado])[0]
    } catch (err) {
      setErrors(err)
      notify('Error al obtener el empleado', true)
    } finally {
      setLoading(false)
    }
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

  async function getEmpleadoMaquinas(idEmpleado) {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    }
    try {
      setLoadingEmpleadoMaquinas(true)
      const maquinas = await fetchAPI(API_EMPLEADO_MAQUINAS_URL + idEmpleado, options)
      return maquinas
    } catch (err) {
    } finally {
      setLoadingEmpleadoMaquinas(false)
    }
  }

  async function assignMaquinas({ idEmpleado, maquinasIds }) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access
      },
      body: JSON.stringify({ idEmpleado: idEmpleado, maquinas: maquinasIds }),
    }
    let { message } = await fetchAPI(API_EMPLEADO_MAQUINAS_URL, options)
    return { message }
  }

  async function postEmpleado(values, method) {
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
      if (values[k] !== null && values[k] !== '') formData.append(k, values[k])
    })
    const options = {
      method: method,
      headers: { 'Authorization': 'Bearer ' + session.access },
      body: formData
    }
    let { empleado, message } = await fetchAPI(API_EMPLEADOS_URL + (method === 'PUT' ? values.idEmpleado : ''), options)
    //await assignMaquinas(empleado.idEmpleado, maquinas)
    return { empleado, message }
  }

  async function deleteEmpleados(ids) {
    let options = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + session.access
      }
    }
    try {
      for (let id of ids) {
        let { message } = await fetchAPI(API_EMPLEADOS_URL + id, options)
        notify(message)
      }
    } catch (err) {
      setErrors(err)
      notify('Error al eliminar empleado', true)
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

        postEmpleado,
        assignMaquinas,

        deleteEmpleados,

        getEmpleadoMaquinas,
        loadingEmpleadoMaquinas,
      }}
    >
      {children}
    </EmpleadosContext.Provider>
  )
}
