import React, { useEffect, useState } from "react"
import { entorno } from "../../../constants/entornos"
import { useAuth } from "../../../context/AuthContext"
import { sleep } from "../../../constants/functions"
import { fetchAPI } from "../../../services/fetchApiService"
import { useContext } from "react"

const API_MODELOS_URL = "api/modelos/"

const ModelosContext = React.createContext('ModelosContext')

export function useModelos() {
  return useContext(ModelosContext)
}

function formatModelos(modelos) {
  let formatData = []
  modelos.forEach(m => {
    formatData.push({
      ...m,
      idCliente: m?.cliente?.idCliente + '',
      isSelected: false,
    })
  })
  return formatData
}

export function ModelosProvider({ children }) {

  const { session, notify } = useAuth()
  
  const [allModelos, setAllModelos] = useState([])
  const [fetchingModelos, setFetchingModelos] = useState(true)
  const [fetchingOneModelo, setFetchingOneModelo] = useState(true)

  const [errors, setErrors] = useState(false)

  async function getModelo(id) {
    const options = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    try {
      setFetchingOneModelo(true)
      const modelo = await fetchAPI(API_MODELOS_URL + id, options)
      let modelos = formatModelos([modelo])
      return modelos[0]
    } catch (err) {
      setErrors(err)
    } finally {
      setFetchingOneModelo(false)
    }
  }

  async function getModelos() {
    const options = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    const modelos = await fetchAPI(API_MODELOS_URL, options)
    return formatModelos(modelos)
  }

  async function postModelo(values, method = 'POST') {
    let formData = new FormData()
    formData.append('nombre', values.nombre ? values.nombre : '')
    formData.append('cliente', values.idCliente ? values.idCliente : '')
    const options = {
      method: method,
      body: formData,
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    let { modelos, message } = await fetchAPI(API_MODELOS_URL + (method === 'PUT' ? values.idModelo : ''), options)
    notify(message)
    return formatModelos(modelos)
  }

  async function deleteModelos(ids) {
    let options = {
      method: 'DELETE',
      headers: { "authorization": "Bearer " + session.access }
    }
    try {
      setFetchingModelos(true)
      for (let id of ids) {
        let { message } = await fetchAPI(API_MODELOS_URL + id, options)
        notify(message)
      }
    } catch (err) {
      setErrors(err)
      console.log(err)
    } finally {
      setFetchingModelos(false)
    }
  }

  async function refreshModelos() {
    try {
      setFetchingModelos(true)
      const modelos = await getModelos()
      setAllModelos(modelos)
    } catch (err) {
      setErrors(err)
    } finally {
      setFetchingModelos(false)
    }
  }

  async function saveModelo({ modelo, method = "POST" }) {
    try {
      console.log('savingAPI', modelo, method)
      setFetchingModelos(true)
      const modelos = await postModelo(modelo, method)
      setAllModelos(modelos)
    } catch (err) {
      console.log(err)
      setErrors(err)
    } finally {
      setFetchingModelos(false)
    }
  }

  /*useEffect(() => {
    refreshModelos()
  }, [])*/

  return (
    <ModelosContext.Provider value={{
      allModelos,
      refreshModelos,
      saveModelo,
      deleteModelos,
      fetchingModelos, setFetchingModelos,

      getModelo,
      fetchingOneModelo,

      errors,
    }}>
      {children}
    </ModelosContext.Provider>
  )
}

export default useModelos