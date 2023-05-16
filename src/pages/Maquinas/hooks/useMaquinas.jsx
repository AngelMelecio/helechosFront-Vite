import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchAPI } from "../../../services/fetchApiService";
import { useContext } from "react";

const MaquinasContext = React.createContext('MaquinasContext')

const API_MAQUINAS_URL = "api/maquinas/"

export function useMaquinas() {
  return useContext(MaquinasContext)
}

function formatMaquinas(maquinas) {
  return maquinas.map((mqna) => ({
    ...mqna,
    isSelected: false,
  }))
}

export function MaquinasProvider({ children }) {

  const { session, notify } = useAuth()
  const [allMaquinas, setAllMaquinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  async function findMaquina(id) {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    }
    try {
      setLoading(true)
      let maquina = await fetchAPI(API_MAQUINAS_URL + id, options)
      return formatMaquinas([maquina])[0]
    } catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }

  async function getMaquinas() {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    }
    let maquinas = await fetchAPI(API_MAQUINAS_URL, options)
    return formatMaquinas(maquinas)
  }

  async function refreshMaquinas() {
    try {
      setLoading(true)
      let maquinas = await getMaquinas()
      setAllMaquinas(maquinas)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const postMaquina = async (values, method) => {
    let Keys = [
      'numero',
      'linea',
      'marca',
      'modelo',
      'ns',
      'otros',
      'fechaAdquisicion',
      'detalleAdquisicion',
      'departamento'
    ]
    let formData = new FormData()
    Keys.forEach(k => {
      formData.append(k, values[k] ? values[k] : '')
    })
    const options = {
      method: method,
      headers: { 'Authorization': 'Bearer ' + session.access },
      body: formData
    }
    let { maquina, message } = await fetchAPI(API_MAQUINAS_URL + (method === 'PUT' ? values.idMaquina : ''), options)
    return { message }
    //return formatMaquinas(maquina)
  }

  const deleteMaquinas = async (listaMaquinas) => {
    for (let i = 0; i < listaMaquinas.length; i++) {
      let e = listaMaquinas[i]
      const options = { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + session.access } }
      if (e.isSelected) {
        try {
          setLoading(true)
          const { message } = await fetchAPI(API_MAQUINAS_URL + e.idMaquina, options)
          notify(message)
        } catch (err) {
          //console.log('Error al eliminar la maquina', err)
          setErrors(err)
          notify(err, true)
        } finally {
          setLoading(false)
        }
      }
    }
  }

  async function saveMaquina({ values, method }) {
    try {
      setLoading(true)
      const { message } = await postMaquina(values, method)
      notify(message)
    } catch (err) {
      console.log(err)
      setErrors(err)
      notify('Error al guardar la maquina', true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MaquinasContext.Provider
      value={{
        allMaquinas,
        loading,
        errors,
        refreshMaquinas,
        saveMaquina,
        deleteMaquinas,
        findMaquina,
        setLoading
      }}
    >
      {children}
    </MaquinasContext.Provider>
  )
}