import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchAPI } from "../../../services/fetchApiService";
import { API_URL } from "../../../constants/API_URL";
import { useContext } from "react";

const API_FICHAS_URL = "api/fichas_tecnicas/"
const API_FICHAS_MATERIALES_URL = "api/fichas_tecnicas_materiales/"

const FichasContext = React.createContext('FichasContext')

export function useFichas() {
    return useContext(FichasContext)
}

export function FichasProvider({ children }) {

    const { session } = useAuth()
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
        let formatData = []
        fichas.forEach(f => {
            formatData.push({
                ...f,
                maquinaTejido: f.maquinaTejido + '',
                maquinaPlancha: f.maquinaPlancha + '',
                fotografia: f.fotografia ? API_URL + f.fotografia : ''
            })
        })
        return formatData
    }

    async function postFicha(values, materiales, method) {
        let formData = new FormData()

        Object.keys(values).forEach(key => {
            if (key === 'fotografia' || key.includes('archivo')) {
                if (!(values[key] instanceof File)) return
            }
            if (values[key] !== '' && values[key] !== null && values[key] !== undefined)
                formData.append(key, values[key])
        })

        let options = {
            method: method,
            body: formData,
            headers: {
                "authorization": "Bearer " + session.access
            }
        }
        const { ficha, message } = fetchAPI(API_FICHAS_URL + method === 'PUT' ? values.idFichaTecnica : '', options)
        notify(message)
        await saveFichaMateriales({
            idFichaTecnica: method === 'POST' ? values.idFichaTecnica : ficha.idFichaTecnica,
            materiales: materiales
        })
        return ficha
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


    async function refreshFichas({idModelo}) {
        try {
            setLoading(true)
            if( idModelo !== '0' ){
                const fichas = await getFichas(idModelo)
                setFichas(fichas)
            }
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <FichasContext.Provider
            value={{
                fichas,
                loading,
                error,
                refreshFichas
            }}
        >
            {children}
        </FichasContext.Provider>
    )
}
