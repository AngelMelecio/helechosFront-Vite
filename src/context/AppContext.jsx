import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import {entorno} from "../constants/entornos.jsx"

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

const apiEmpleadosUrl = entorno+"/api/empleados/"
const apiMaquinasUrl = entorno+"/api/maquinas/"
const apiEmpleadoMaquinaUrl = entorno+"/api/empleados_maquina/"
const apiEmpleadoMaquinasUrl = entorno+"/api/empleado_maquinas/"
const imageEndPoint = entorno

const empleadosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Dirección', attribute: 'direccion' },
  { name: 'Seguro Social', attribute: 'ns' },
  { name: 'Fecha de Contratación', attribute: 'fechaEntrada' },
  { name: 'Fecha Alta de Seguro', attribute: 'fechaAltaSeguro' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Teléfono', attribute: 'telefono' },
  { name: 'Departamento', attribute: 'departamento' },
]

const maquinasColumns = [
  { name: 'Número', attribute: 'numero' },
  { name: 'Línea', attribute: 'linea' },
  { name: 'Marca', attribute: 'marca' },
  { name: 'Modelo', attribute: 'modelo' },
  { name: 'Número de Serie', attribute: 'ns' },
  { name: 'Otros', attribute: 'otros' },
  { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion' },
  { name: 'Detalle Adquisición', attribute: 'detalleAdquisicion' },
  { name: 'Departamento', attribute: 'departamento' },
]

export function AppProvider({ children }) {

  const { session, notify } = useAuth()

  const [fetchingEmpleados, setFetchingEmpleados] = useState(false)
  const [allEmpleados, setAllEmpleados] = useState([])

  const [fetchingMaquinas, setFetchingMaquinas] = useState(false)
  const [allMaquinas, setAllMaquinas] = useState([])


  const getEmpleados = async () => {
    setFetchingEmpleados(true)
    let response = await fetch(apiEmpleadosUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let data = await response.json()
      let formatData = data.map((empl) => ({
        ...empl,
        isSelected: false,
        estado: empl.is_active ? "Activo" : 'Inactivo',
        fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
      }))
      setAllEmpleados(formatData)
      setFetchingEmpleados(false)
      return formatData
    }
    setFetchingEmpleados(false)
  }

  const saveEmpleado = async (values, objEmpleado, maquinas, isEdit) => {    
    let formData = new FormData()
    formData.append('nombre', values.nombre)
    formData.append('apellidos', values.apellidos)
    formData.append('direccion', values.direccion)
    formData.append('telefono', values.telefono)
    formData.append('ns', values.ns)

    if ((objEmpleado.fotografia) instanceof File)
      formData.append('fotografia', objEmpleado.fotografia)
    formData.append('departamento', values.departamento)
    formData.append('is_active', values.is_active)
    values.fechaEntrada !== null && formData.append('fechaEntrada',values.fechaEntrada)
    values.fechaAltaSeguro !== null && formData.append('fechaAltaSeguro',values.fechaAltaSeguro)

    let maquinasIds = []
    maquinas.forEach(m => maquinasIds.push({ id: m.idMaquina }))

    if (!isEdit) {
      //    Creacion de un Nuevo Empleado 
      let response = await fetch(apiEmpleadosUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
      //    Espero la respuesta para obtener el nuevo Id 
      const { message, empleado } = await response.json()
      notify(message)
      if (maquinas.length === 0) return
      if (response.ok) {
        //    Asigno las Maquinas 
        let response2 = await fetch(apiEmpleadoMaquinasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.access
          },
          body: JSON.stringify({ idEmpleado: empleado.idEmpleado, maquinas: maquinasIds }),
        })
        let error = response2.ok ? false : true
        let data = await response2.json()
        notify(data.message, error)
      }
    }
    else {
      //    Actaulizo los datos del Empleado
      await fetch(apiEmpleadosUrl + values.idEmpleado, {
        method: 'PUT',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

      if (maquinas.length === 0) return

      //    Asigno Sus nuevas maquinas
      let response = await fetch(apiEmpleadoMaquinasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access
        },
        body: JSON.stringify({ idEmpleado: values.idEmpleado, maquinas: maquinasIds }),
      })
      let data = await response.json()
      notify(data.message)

    }
  }

  const deleteEmpleados = async (listaEmpleados) => {
    listaEmpleados.forEach(async (e) => {
      if (e.isSelected) {
        let response = await fetch(apiEmpleadosUrl + e.idEmpleado, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        }
        else
          notify(data.message, true)
      }
    })
  }

  const getEmpleadoMaquinas = async (empId) => {
    let response = await fetch(apiEmpleadoMaquinaUrl + empId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let assigned = await response.json()
      return assigned
    }
    return []
  }

  const getMaquinas = async () => {
    setFetchingMaquinas(true)
    let response = await fetch(apiMaquinasUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    //console.log( 'getting maquinas ',response )
    if (response.status === 200) {
      let maquinas = await response.json()
      let formatData = maquinas.map((mqna) => ({
        ...mqna,
        isSelected: false,
      }))
      setAllMaquinas(formatData)
      return formatData
    }
    setFetchingMaquinas(false)
  }

  const saveMaquina = async (values, isEdit) => {

    let formData = new FormData()
    formData.append('numero', values.numero)
    formData.append('linea', values.linea)
    formData.append('marca', values.marca)
    formData.append('modelo', values.modelo)
    formData.append('ns', values.ns)
    formData.append('otros', values.otros)
    formData.append('fechaAdquisicion', values.fechaAdquisicion)
    formData.append('detalleAdquisicion', values.detalleAdquisicion)
    formData.append('departamento', values.departamento)

    if (!isEdit) {
      //Creacion de un nueva maquina 
      await fetch(apiMaquinasUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

    } else {
      //Actualizando los datos de la maquina
      await fetch(apiMaquinasUrl + values.idMaquina, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))
    }
  }

  const deleteMaquinas = async (listaMaquinas) => {
    listaMaquinas.forEach(async (e) => {
      if (e.isSelected) {
        let response = await fetch(apiMaquinasUrl + e.idMaquina, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
          return
        }
        notify(data.message, true)
      }
    })
  }



  return (
    <AppContext.Provider
      value={{
        fetchingEmpleados,
        allEmpleados, getEmpleados, empleadosColumns,
        saveEmpleado, deleteEmpleados,

        fetchingMaquinas,
        allMaquinas, getMaquinas, maquinasColumns,
        saveMaquina, deleteMaquinas,
      
        getEmpleadoMaquinas,
        notify
      }}>

      {children}
    </AppContext.Provider>
  )
}