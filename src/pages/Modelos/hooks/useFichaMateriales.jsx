import React from 'react';
import { useState } from 'react';
import { fetchAPI } from '../../../services/fetchApiService';
import { useAuth } from '../../../context/AuthContext';


const FichaMaterialesContext = React.createContext()

export function useFichaMateriales() {
    return React.useContext(FichaMaterialesContext)
}

const API_FICHA_MATERIALES_URL = "/api/materiales_by_fichaTecnica/"

function formatFichaMateriales(asigandos) {
    console.log(asigandos)   
    let formatData = asigandos.map((asig) => ({
        ...asig,
        id: asig.id,
        peso: asig.peso,
        tipo: asig.material.tipo,
        color: asig.material.color,
        codigoColor: asig.material.codigoColor,
        tenida: asig.material.tenida,
        hebras: asig.hebras,
        calibre: asig.material.calibre,
        guiaHilos: asig.guiaHilos,
        nombreProveedor: asig.material.proveedor.nombre,
        idMaterial: asig.material.idMaterial
    }))
    return formatData
}


export function FichaMaterialesProvider({ children }) {

    const [allFichaMateriales, setAllFichaMateriales] = useState([])
    const [fetchingFichaMateriales, setFetchingFichaMateriales] = useState(true)

    const {session} = useAuth()

    async function refreshFichaMateriales(idFicha) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            setFetchingFichaMateriales(true)
            if (idFicha === undefined) return []
            const { materiales, message } = await fetchAPI(API_FICHA_MATERIALES_URL + idFicha, options)
            setAllFichaMateriales(formatFichaMateriales(materiales))
        } catch (e) {
            console.log(e)
        } finally {
            setFetchingFichaMateriales(false)
        }
    }


    return <FichaMaterialesContext.Provider
        value={{
            allFichaMateriales,
            refreshFichaMateriales,
            fetchingFichaMateriales
        }}>
        {children}
    </FichaMaterialesContext.Provider>
}