import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchAPI } from "../../../services/fetchApiService";
import { API_URL } from "../../../constants/HOSTS";
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
      fotografia: f.fotografia ? API_URL + f.fotografia : '',
      fechaCreacion: new Date(f.fechaCreacion).toLocaleString(),
      fechaUltimaEdicion: new Date(f.fechaUltimaEdicion).toLocaleString(),
    })
  })
  return formatData
}

export function FichasProvider({ children }) {

  const {session, notify } = useAuth()
  const [allFichasModelo, setAllFichasModelo] = useState([])
  const [fetchingFichas, setFetchingFichas] = useState(true);

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

  async function postFicha({values, method}) {
    let keys = [
      'idFichaTecnica',
      'modelo',
      'nombre',
      'nombrePrograma',
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
    setAllFichasModelo(formatFichas(fichas))
   
    return { ficha, message }

    //notify(message)
    /*const { message: message2 } = await saveFichaMateriales({
      idFichaTecnica: ficha.idFichaTecnica,
      materiales: materiales
    })
    notify(message2)*/
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
    const {message} = await fetchAPI(API_FICHAS_MATERIALES_URL, options)
    return {message}
  }

  async function deleteFicha(idFicha) {
    let options = {
      method: 'DELETE',
      headers: {
        "authorization": "Bearer " + session.access
      }
    }
    try {
      setFetchingFichas(true)
      const { message } = await fetchAPI(API_FICHAS_URL + idFicha, options)
      notify(message)
    } catch (err) {
      setError(err)
    } finally {
      setFetchingFichas(false)
    }

  }

  async function refreshFichas({ idModelo }) {
    try {
      setFetchingFichas(true)
      if (idModelo !== '0') {
        const fichas = await getFichas(idModelo)
        setAllFichasModelo(fichas)
      } else {
        setAllFichasModelo([])
      }
    } catch (err) {
      console.log('error al refrescar las fichas')
      setError(err)
    } finally {
      setFetchingFichas(false)
    }
  }

  async function saveFicha({ values, materiales = [], method = "POST" }) {
    try {
      setFetchingFichas(true)
      const fichas = await postFicha(values, materiales, method)
      setAllFichasModelo(fichas)
    } catch (err) {
      setError(err)
    } finally {
      setFetchingFichas(false)
    }
  }


  return (
    <FichasContext.Provider
      value={{
        allFichasModelo, 
        fetchingFichas, setFetchingFichas,
        error,
        //saveFicha,

        postFicha,
        saveFichaMateriales,

        refreshFichas,
        deleteFicha
      }}
    >
      {children}
    </FichasContext.Provider>
  )
}
