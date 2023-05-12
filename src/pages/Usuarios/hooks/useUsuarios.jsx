import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useContext } from "react";
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
  const [errors, setErrors] = useState(false)


  function getUsuario(id) {
    if(allUsuarios.length!==0){
        let usuario = allUsuarios.find(e => e.idUsuario + '' === id + '')
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
      console.log(err)
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
      console.log('err')
    } finally {
      setLoading(false)
    }
  }

  const postUsuario = async (values, method) => {
    console.log('POST: ', values)
    let Keys = [
        'nombre',
        'apellidos',
        'correo',
        'usuario',
        'estado',
        'tipo',
        'contrasenia',
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
    let { usuarios, message } = await fetchAPI(API_USUARIOS_URL + (method === 'PUT' ? values.idUsuario : ''), options)
    return { message }
    //return formatUsuarios(Usuarios)
}

const deleteUsuarios = async (listaUsuarios) => {
    for (let i = 0; i < listaUsuarios.length; i++) {
        let e = listaUsuarios[i]
        const options = {method: 'DELETE', headers: {'Authorization': 'Bearer ' + session.access}}
        if (e.isSelected) { 
            try {
                setLoading(true)
                const { message } = await fetchAPI(API_USUARIOS_URL + e.idUsuario, options)
                notify(message)
            } catch (err) {
                console.log(err)
                setErrors(err)
                notify('Error al eliminar el Usuario', true)
            } finally {
                setLoading(false)
            }
        }
    }
}


async function saveUsuario({ values, method }) {
    try {
        setLoading(true)
        const { message } = await postUsuario(values, method)
        notify(message)
    } catch (err) {
        console.log(err)
        setErrors(err)
        notify('Error al guardar usuario', true)
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
        getUsuario,
        setLoading
      }}
    >
      {children}
    </UsuariosContext.Provider>)
}