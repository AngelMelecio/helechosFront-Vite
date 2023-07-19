import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";
import { entorno } from "../../../constants/entornos";
import { set } from "lodash";

const API_REGISTROS_URL = "api/registros/"

const ProduccionContext = React.createContext('ProduccionContext')

export function useProduccion() {
    return useContext(ProduccionContext)
}
  

export function ProduccionProvider({ children }) {

    const { session, notify } = useAuth()

    const [loading, setLoading] = useState(false)
  
    async function postProduccion(registros) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(registros)
        }
        try{
            setLoading(true)
            const response = await fetchAPI(API_REGISTROS_URL, options)
            return response
        }catch(e){
            console.log('error al crear registros: ', e)
        }finally{
            setLoading(false)
        }
    }
   

    return (
        <ProduccionContext.Provider
            value={{
                postProduccion,
                loading,
            }}
        >
            {children}
        </ProduccionContext.Provider>
    )
}
