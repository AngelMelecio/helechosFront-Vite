import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";

const API_MATERIALES_URL = "api/materiales/"
//const API_FICHA_MATERIALES_URL = "/api/fichas_tecnicas_materiales/"

const MaterialesContext = React.createContext('MaterialesContext')

export function useMateriales() {
    return useContext(MaterialesContext)
}

function formatMateriales(materiales) {
    let formatData = materiales.map((mate) => ({
        ...mate,
        isSelected: false,
        count: 0,
        idProveedor: mate.proveedor.idProveedor.toString(),
        nombreProveedor: mate.proveedor.nombre
    }))
    return formatData
}

/*
function formatMaterialesFicha(asigandos) {
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
*/

export function MaterialesProvider({ children }) {

    const { session, notify } = useAuth()

    const [allMateriales, setAllMateriales] = useState([])
    const [loading, setLoading] = useState(true)
    //const [loadingFichaMateriales, setLoadingFichaMateriales] = useState(true)
    const [errors, setErrors] = useState(false)

    function getMaterial(id) {
        if (allMateriales.length !== 0) {
            let material = allMateriales.find(e => e.idMaterial + '' === id + '')
            return material
        }
    }
    async function findMaterial(id) {

        try {
            setLoading(true)
            let options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + session.access }
            }
            let mat = await fetchAPI(API_MATERIALES_URL + id, options)
            return formatMateriales([mat])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el material', true)

        } finally {
            setLoading(false)
        }
    }

    async function getMateriales() {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const materiales = await fetchAPI(API_MATERIALES_URL, options)
        return formatMateriales(materiales)
    }

    /*async function getFichaMateriales(idFicha) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try{
            setLoadingFichaMateriales(true)
            if( idFicha === undefined ) return []
            const {materiales, message} = await fetchAPI(API_FICHA_MATERIALES_URL+idFicha, options)
            return formatMaterialesFicha(materiales)
        }catch(e){
        }finally{
            setLoadingFichaMateriales(false)
        }
    }*/

    async function refreshMateriales() {
        try {
            setLoading(true)
            const materiales = await getMateriales()
            setAllMateriales(materiales)
        } catch (e) {
            setErrors(err)
        } finally {
            setLoading(false)
        }
    }

    const postMaterial = async (values, method) => {
        let Keys = [
            'tipo',
            'color',
            'calibre',
            'proveedor',
            'tenida',
            'codigoColor',
        ]
        let formData = new FormData()
        Keys.forEach(k => {
            if (k === "proveedor")
                formData.append(k, values["idProveedor"] ? values["idProveedor"] : '')
            else
                formData.append(k, values[k] ? values[k] : '')

        })
        let options = {
            method: method,
            headers: { 'Authorization': 'Bearer ' + session.access },
            body: formData
        }
        let { materiales, message } = await fetchAPI(API_MATERIALES_URL + (method === 'PUT' ? values.idMaterial : ''), options)
        return { message }
    }

    const deleteMateriales = async (listaMateriales) => {
        for (let i = 0; i < listaMateriales.length; i++) {
            let e = listaMateriales[i]
            const options = { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + session.access } }
            if (e.isSelected) {
                try {
                    setLoading(true)
                    const { message } = await fetchAPI(API_MATERIALES_URL + e.idMaterial, options)
                    notify(message)
                } catch (err) {
                    setErrors(err)
                    notify('Error al eliminar el material', true)
                } finally {
                    setLoading(false)
                }
            }
        }
    }

    async function saveMaterial({ values, method }) {
        try {
            setLoading(true)
            const { message } = await postMaterial(values, method)
            notify(message)
        } catch (err) {
            setErrors(err)
            notify('Error al guardar el material', true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MaterialesContext.Provider
            value={{
                allMateriales,
                loading,
                errors,
                refreshMateriales,
                getMaterial,
                //getFichaMateriales, loadingFichaMateriales,
                saveMaterial,
                deleteMateriales,
                findMaterial,
                setLoading
            }}
        >
            {children}
        </MaterialesContext.Provider>
    )
}
