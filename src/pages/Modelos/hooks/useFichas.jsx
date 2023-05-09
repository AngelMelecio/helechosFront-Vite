import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchAPI } from "../../../services/fetchApiService";
import { API_URL } from "../../../constants/API_URL";
import { useContext } from "react";

const API_FICHAS_URL = "api/fichas_tecnicas/"
const API_FICHAS_MATERIALES_URL = "api/fichas_tecnicas_materiales/"
const API_FICHA_MATERIALES_URL = "api/fichas_tecnicas_materiales/"

const FichasContext = React.createContext('FichasContext')

export function useFichas() {
  return useContext(FichasContext)
}

function formatFichas(fichas) {
  let formatData = []
  fichas.forEach(f => {
    formatData.push({
      ...f,
      modelo: f.modelo.idModelo,
      maquinaTejido: f.maquinaTejido.idMaquina + '',
      maquinaPlancha: f.maquinaPlancha.idMaquina + '',
      fotografia: f.fotografia ? API_URL + f.fotografia : ''
    })
  })
  return formatData
}

export function FichasProvider({ children }) {

  const { session, notify } = useAuth()
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function getFichas(idModelo) {
    let options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + session.access
      }
    }
    const fichas = await fetchAPI(API_FICHAS_URL + idModelo, options)
    return formatFichas(fichas)
  }

  async function postFicha(values, materiales, method) {
    let keys = [
      'idFichaTecnica',
      'modelo',
      'nombre',
      'archivoPrograma',
      'fotografia',
      'talla',
      'maquinaTejido',
      'tipoMaquinaTejido',
      'galga',
      'velocidadTejido',
      'tiempoBajada',
      'maquinaPlancha',
      'velocidadPlancha',
      'temperaturaPlancha',
      'numeroPuntos',
      'jalones',
      'economisadores',
      'otros',
      'fechaCreacion',
      'fechaUltimaEdicion',
    ]
    let formData = new FormData()

    keys.forEach(key => {
      if (key === 'numeroPuntos' || key === 'jalones' || key === 'economisadores') {
        formData.append(key, JSON.stringify(values[key]))
      }
      else {
        if (key === 'fotografia' || key.includes('archivo')) {
          if (!(values[key] instanceof File)) return
        }
        formData.append(key, values[key] ? values[key] : '')
      }
    })

    let options = {
      method: method,
      body: formData,
      headers: {
        "authorization": "Bearer " + session.access
      }
    }
    const response = await fetchAPI(API_FICHAS_URL + (method === 'PUT' ? values.idFichaTecnica : ''), options)
    const { fichas, ficha, message } = response
    notify(message)

    const { message: message2 } = await saveFichaMateriales({
      idFichaTecnica: ficha.idFichaTecnica,
      materiales: materiales
    })
    notify(message2)
    return formatFichas(fichas)
  }

  async function saveFichaMateriales(fichaMateriales) {
    let options = {
      method: 'POST',
      body: JSON.stringify(fichaMateriales),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    }
    const response = await fetchAPI(API_FICHAS_MATERIALES_URL, options)
    return response
  }

  async function deleteFicha(idFicha) {
    let options = {
      method: 'DELETE',
      headers: {
        "authorization": "Bearer " + session.access
      }
    }
    try {
      setLoading(true)
      const { message } = await fetchAPI(API_FICHAS_URL + idFicha, options)
      notify(message)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }

  }

  async function refreshFichas({ idModelo }) {
    try {
      setLoading(true)
      if (idModelo !== '0') {
        const fichas = await getFichas(idModelo)
        setFichas(fichas)
      } else {
        setFichas([])
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  async function saveFicha({ values, materiales = [], method = "POST" }) {
    try {
      setLoading(true)
      const fichas = await postFicha(values, materiales, method)
      setFichas(fichas)
    } catch (err) {
      setError(err)
      console.log(err)
    } finally {
      setLoading(false)
    }
  }


  return (
    <FichasContext.Provider
      value={{
        fichas, saveFicha,
        loading, setLoading,
        error,
        refreshFichas,
        deleteFicha
      }}
    >
      {children}
    </FichasContext.Provider>
  )
}
