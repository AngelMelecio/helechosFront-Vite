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

    const { session } = useAuth()
    const [allMaquinas, setAllMaquinas] = useState([])
    const [loading, setLoading] = useState(true)

    async function getMaquina(id) {
        let options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + session.access
            }
        }
        try{
            setLoading(true)
            let maquina = await fetchAPI(API_MAQUINAS_URL + id, options)
            return formatMaquinas([maquina])[0]
        }catch(err){
            console.log(err)
        }
        finally{
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
                loading, setLoading,
                refreshMaquinas,
                getMaquina,
            }}
        >
            {children}
        </MaquinasContext.Provider>
    )
}