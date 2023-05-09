import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { fetchAPI } from '../../../services/fetchApiService'

const API_USUARIOS_URL = 'users/'

const UsuariosContext = React.createContext('UsuariosContext')

export function useUsuarios() {
  return React.useContext(UsuariosContext)
}

function formatUsuarios(usuarios) {
  return usuarios.map(usr => ({
    ...usr,
    estado: usr.is_active ? 'Activo' : 'Inactivo',
    tipo: usr.is_staff ? 'Administrador' : 'Encargado',
    isSelected: false,
  }))
}

export function UsuariosProvider({ children }) {

  const { session, notify } = useAuth()

  const [allUsuarios, setAllUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  async function getUsuarios() {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session?.access
      }
    }
    let usuarios = await fetchAPI(API_USUARIOS_URL, options)
    return formatUsuarios(usuarios)
  }

  async function refreshUsuarios() {
    try {
      setLoading(true)
      let usuarios = await getUsuarios()
      setAllUsuarios(usuarios)
    } catch (err) {
      console.log('err')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UsuariosContext.Provider
      value={{
        allUsuarios,
        loading,
        refreshUsuarios,
      }}
    >
      {children}
    </UsuariosContext.Provider>)
}