import React,{ useEffect, useState } from "react"
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

  const { session } = useAuth()
  const [allModelos, setAllModelos] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  async function getModelos() {
    const options = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    const modelos = await fetchAPI(API_MODELOS_URL, options)
    return formatModelos(modelos)
  }

  async function postModelo({ values, method = 'POST' }) {
    let Keys = [
      'nombre',
      'cliente',
    ]
    let formData = new FormData()
    console.log(values)
    Keys.forEach(k => formData.append(k, values[k] ? values[k] : ''))
    const options = {
      method: method,
      body: formData,
      headers: { 'Authorization': 'Bearer ' + session.access }
    }
    let { modelos, message } = await fetchAPI(API_MODELOS_URL + (method === 'PUT' ? values.idModelo : ''), options)
    console.log(message)
    return formatModelos(modelos)
  }

  async function refreshModelos() {
    try {
      setLoading(true)
      const modelos = await getModelos()
      setAllModelos(modelos)
    } catch (err) {
      setErrors(err)
    } finally {
      setLoading(false)
    }
  }

  async function saveModelo(modelo, method) {
    try {
      setLoading(true)
      const modelos = await postModelo(modelo, method)
      setAllModelos(modelos)
    } catch (err) {
      console.log(err)
      setErrors(err)
    } finally {
      setLoading(false)
    }
  }

  /*useEffect(() => {
    refreshModelos()
  }, [])*/

  return (
    <ModelosContext.Provider value={{
      allModelos,
      loading,
      errors,
      refreshModelos,
      saveModelo

    }}>
      {children}
    </ModelosContext.Provider>
  )
}

export default useModelos