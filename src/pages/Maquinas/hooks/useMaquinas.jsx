import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchAPI } from "../../../services/fetchApiService";
import { useContext } from "react";

const MaquinasContext = React.createContext('MaquinasContext')

const API_MAQUINAS_URL = "api/maquinas/"

export function useMaquinas() {
    return useContext(MaquinasContext)
}

export function MaquinasProvider({ children }) {

    const { session } = useAuth()
    const [allMaquinas, setAllMaquinas] = useState([])
    const [loading, setLoading] = useState(true)

    async function getMaquinas() {
        let options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        }
        let maquinas = await fetchAPI(API_MAQUINAS_URL, options)
        let formatData = maquinas.map((mqna) => ({
            ...mqna,
            isSelected: false,
        }))
        return formatData
    }

    async function refreshMaquinas() {
        try{
            setLoading(true)
            let maquinas = await getMaquinas()
            setAllMaquinas(maquinas)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <MaquinasContext.Provider
            value={{
                allMaquinas,
                loading,
                refreshMaquinas,
            }}
        >
            {children}
        </MaquinasContext.Provider>
    )
}