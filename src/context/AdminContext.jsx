import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { GiConsoleController } from "react-icons/gi";
import { toast } from "react-toastify";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";
import {entorno} from "../constants/entornos.jsx"


const apiUsersUrl = entorno+"/users/"

const ct_JSON = { "Content-Type": "application/json" }

const UsuariosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Usuario', attribute: 'usuario' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Tipo', attribute: 'tipo' },
]

const AdminContext = React.createContext()
export function useAdmin() {
  return useContext(AdminContext)
}

export function AdminProvider({ children }) {

  const { session, setSession } = useAuth()
  const { notify } = useAuth()

  const [fetchingUsuarios, setFetchingUsuarios] = useState(false)
  const [allUsuarios, setAllUsuarios] = useState([])

  const getUsuarios = async () => {
    setFetchingUsuarios(true)
    let response = await fetch(apiUsersUrl, {
      method: 'GET',
      headers: {
        ...ct_JSON,
        'Authorization': 'Bearer ' + session?.access
      }
    })
    if (response.status === 200) {
      let data = await response.json()
      let formatData = data.map((usr) => ({
        ...usr,
        estado: usr.is_active ? 'Activo' : 'Inactivo',
        tipo: usr.is_staff ? 'Administrador' : 'Encargado',
        isSelected: false,
      }))
      setAllUsuarios(formatData)
      setFetchingUsuarios(false)
      return formatData
    }
    setFetchingUsuarios(false)
  }

  const saveUser = async (values) => {
    let response = await fetch(apiUsersUrl, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    let data = await response.json()
    if (response.ok) {
      notify(data.message)
    } else {
      throw data
    }
  }

  const updateUser = async (id, value) => {
    const response = await fetch(apiUsersUrl + id + '/', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      },
      body: JSON.stringify(value)
    })
    let data = await response.json()
    if (response.status === 200) {
      notify(data.message)
    } else {
      throw data
    }
  }

  const deleteUsuarios = async (listaUsuarios) => {
    let ids = []
    listaUsuarios.forEach(usr => {
      if (usr.isSelected) ids.push({ id: usr.id })
    })
    let response = await fetch(apiUsersUrl + "delete_user_apiView/", {
      method: 'DELETE',
      headers: { ...ct_JSON, 'Authorization': 'Bearer ' + session.access },
      body: JSON.stringify(ids)
    })
    let data = await response.json()
    if (response.ok) {
      notify(data.message)
      await getUsuarios()
    }
    else
      notify(data.message, true)
  }

  const updatePassword = async (id, value) => {
    await fetch(apiUsersUrl + id + '/set_password/', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      },
      body: JSON.stringify({
        password: value,
        password2: value
      })
    })
  }

  return (
    <AdminContext.Provider
      value={{

        fetchingUsuarios,
        allUsuarios, getUsuarios, UsuariosColumns,

        updateUser, saveUser,
        updatePassword, deleteUsuarios
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}