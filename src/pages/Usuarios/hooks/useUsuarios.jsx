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
    password: usr.password?'':'',
    estado: usr.is_active ? 'Activo' : 'Inactivo',
    tipo: usr.is_staff ? 'Administrador' : 'Encargado',
    isSelected: false,
  }))
}

export function UsuariosProvider({ children }) {

  const { session, notify } = useAuth()

  const [allUsuarios, setAllUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(null)


  function getUsuario(id) {
    if (allUsuarios.length !== 0) {
      let usuario = allUsuarios.find(e => e.id + '' === id + '')
      return usuario
    }

  }
  async function findUsuario(id) {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session?.access
      }
    }
    try {
      setLoading(true)
      let usuario = await fetchAPI(API_USUARIOS_URL + id, options)
      return formatUsuarios([usuario])[0]
    } catch (err) {
      setErrors(err)
      notify('Error al buscar al usuario', true)
    } finally {
      setLoading(false)
    }
  }

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
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUsuario = async ({ values, method, newPass }) => {
    const options = {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + session.access,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    }

    setLoading(true)
    try {
      if (method === 'POST') {
        const { message } = await fetchAPI(API_USUARIOS_URL, options)
        notify(message)

      } else {

        const { message } = await fetchAPI(API_USUARIOS_URL + values.id + '/', options)
        notify(message)
        if (newPass) {
          const options2 = {
            method: 'post',
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify({
              password: values.password,
              password2: values.password
            })
          }
          const {message} = await fetchAPI((API_USUARIOS_URL + values.id + '/set_password/'), options2)
          notify(message)
        }
      }
      return true
    } catch (e) {
      let { errors } = e
      if (errors.correo) notify(errors.correo[0], true)
      if (errors.usuario) notify(errors.usuario[0], true)
      setErrors(errors)
      return false
    } finally {
      setLoading(false)
    }
  }

  

  const deleteUsuarios = async (listaUsuarios) => {
    let ids = []
    listaUsuarios.forEach(usr => {
      if (usr.isSelected) ids.push({ id: usr.id })
    })
    const options = {
      method: 'DELETE',
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + session.access },
      body: JSON.stringify(ids)
    }

    try {
      setLoading(true)
      const { message } = await fetchAPI(API_USUARIOS_URL + "delete_user_apiView/", options)
      notify(message)
    } catch (err) {
      setErrors(err)
      notify('Error al eliminar el Usuario', true)
    } finally {
      setLoading(false)
    }


  }

  return (
    <UsuariosContext.Provider
      value={{
        allUsuarios,
        loading,
        errors,
        refreshUsuarios,
        getUsuario,
        handleSaveUsuario,
        deleteUsuarios,
        findUsuario,
        setLoading,
        setErrors
      }}
    >
      {children}
    </UsuariosContext.Provider>)
}