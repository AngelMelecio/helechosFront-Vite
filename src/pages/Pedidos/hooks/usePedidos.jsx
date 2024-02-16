import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { fetchAPI } from "../../../services/fetchApiService";
import { API_URL } from "../../../constants/HOSTS";

const API_PEDIDOS_URL = "api/pedidos/"
const API_PEDIDO_URL = "api/pedido/"
const API_FICHAS_BY_MODELO = "api/fichas_by_modelo/"
const API_GET_ETIQUETAS = "api/produccionByPedido/"
const API_IMPRESION_ETIQUETAS = "api/produccionPrint/"
const API_PROGRESS_ETIQUETA = "api/progresoByEtiqueta/"
const API_REPOSICION_URL = "api/reposicion/"
const API_PRODUCCION_MODELO_EMPLEADO_ALL = "api/produccion_por_modelo_y_empleado/"
const API_PRODUCCION_MAQUINA_TURNO_ALL = "api/produccion_por_maquina_y_turno/"
const API_PRODUCCION_POST_REPOSICION_OR_EXTRA = "api/produccionReposicionExtra/"
const API_MATERIALES_BY_PEDIDO = "api/materiales_by_pedido/"

const PedidosContext = React.createContext('PedidosContext')

export function usePedidos() {
    return useContext(PedidosContext)
}

function formatReposiciones(reposiciones) {
    return reposiciones.map((rp, indx) => ({
        ...rp,
        indx: indx + 1,
        empleadoFalla: rp.empleadoFalla !== null ? rp.empleadoFalla.nombre + " " + rp.empleadoFalla.apellidos + " - " + rp.empleadoFalla.departamento : "---",
        empleadoReponedor: rp.empleadoReponedor.nombre + " " + rp.empleadoReponedor.apellidos + " - " + rp.empleadoReponedor.departamento,
        maquina: rp.maquina !== null ? "L" + rp.maquina.linea + " - " + "M" + rp.maquina.numero : "---",
        fecha: new Date(rp.fecha).toLocaleString()
    }))
}

function formatPedidos(pedidos) {
    let formatData = pedidos.map((pedido) => {
        return ({
            ...pedido,
            detalles: [...pedido.detalles.map((detalle) => ({
                ...detalle,
                cantidades: [...detalle.cantidades.map((cantidad) => ({
                    ...cantidad,
                    progreso:
                        // Sacar las estaciones Unicas
                        [...new Set(cantidad.etiquetas.map(etiqueta => etiqueta.estacionActual))]
                            // Devolver una matris con el nombre de la estacion y la cantidad de etiquetas en esa estacion
                            .map(uniqueEstacion => [
                                uniqueEstacion,
                                [...cantidad.etiquetas.filter(et => et.estacionActual === uniqueEstacion)].length
                            ])

                }))]
            }))],
            fechaRegistro: new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'full',
                hourCycle: 'h12',
                timeStyle: 'short',
                timeZone: 'America/Mexico_City'

            }).format(new Date(pedido.fechaRegistro)),
            fechaEntrega: new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                timeZone: 'UTC'
            }).format(new Date(pedido.fechaEntrega))
        })
    }
    )
    return formatData
}

function formatPedidosListar(pedidos) {
    return pedidos.map(p => {
        let fch = p.fechaEntrega.split('-')
        return ({
            ...p,
            //fechaRegistro: new Date(p.fechaRegistro),
            //fechaEntrega: new Date(fch[0], fch[1], fch[2]),
            isSelected: false
        })
    })
}

function formatFichas(fichas) {
    let formatedFichas = fichas.map((ficha) => ({
        ...ficha,
        fechaCreacion: new Date(ficha.fechaCreacion).toLocaleString(),
        fechaUltimaEdicion: new Date(ficha.fechaUltimaEdicion).toLocaleString(),
        fotografia: `${API_URL}${ficha.fotografia}`
    }))
    return formatedFichas
}

export function PedidosProvider({ children }) {

    const { session, notify } = useAuth()

    const [allPedidos, setAllPedidos] = useState([])
    const [allEtiquetas, setAllEtiquetas] = useState([])
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    async function findPedido(id) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            setLoading(true)
            let pedido = await fetchAPI(API_PEDIDO_URL + id, options)
            return formatPedidos([pedido])[0]
        } catch (err) {
            setErrors(err)
            notify('Error al buscar el pedido', true)
        } finally {
            setLoading(false)
        }
    }
    async function getPedidos() {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const pedidos = await fetchAPI(API_PEDIDOS_URL, options)
        return formatPedidosListar(pedidos)
    }

    async function refreshPedidos() {
        try {
            setLoading(true)
            const pedidos = await getPedidos()
            setAllPedidos(pedidos)
        } catch (e) {
            setErrors(e)
        } finally {
            setLoading(false)
        }
    }
    async function postPedido(pedido) {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(pedido)
        }

        setLoading(true)
        const response = await fetchAPI(API_PEDIDOS_URL, options)
        return response
    }
    async function produccion_por_modelo_y_empleado(restricciones) {
        let fechaInicio = restricciones.fechaInicio
        let fechaFin = restricciones.fechaFinal
        let departamento = restricciones.departamento

        let options = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + session.access
            },
        }
        const response = await fetchAPI(API_PRODUCCION_MODELO_EMPLEADO_ALL + fechaInicio + "/" + fechaFin + "/" + departamento, options)
        return response
    }

    async function produccion_por_maquina_y_turno(restricciones) {
        let fechaInicio = restricciones.fechaInicio
        let fechaFin = restricciones.fechaFinal
        let departamento = restricciones.departamento

        let options = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + session.access
            },
        }
        const response = await fetchAPI(API_PRODUCCION_MAQUINA_TURNO_ALL + fechaInicio + "/" + fechaFin + "/" + departamento, options)
        return response
    }

    async function putProduccion(listIds) {

        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(listIds)
        }

        setLoading(true)
        const response = await fetchAPI(API_IMPRESION_ETIQUETAS, options)
        return response
    }
    async function getFichas(idModelo) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const fichas = await fetchAPI(API_FICHAS_BY_MODELO + idModelo, options)
        return formatFichas(fichas)
    }

    async function getMaterialesByPedido(idPedido) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        try {
            const materiales = await fetchAPI(API_MATERIALES_BY_PEDIDO + idPedido, options)
            return materiales
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async function getRegistrosByIdProduccion(idProduccion) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const registros = await fetchAPI(API_PROGRESS_ETIQUETA + idProduccion, options)
        return registros
    }
    const deletePedidos = async (listaPedidos) => {
        for (let i = 0; i < listaPedidos.length; i++) {
            let e = listaPedidos[i]
            const options = { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + session.access } }
            if (e.isSelected) {
                try {
                    setLoading(true)
                    const { message } = await fetchAPI(API_PEDIDO_URL + e.idPedido, options)
                    notify(message)
                } catch (err) {
                    setErrors(err)
                    notify('Error al eliminar el pedido', true)
                } finally {
                    setLoading(false)
                }
            }
        }
    }

    async function saveReposicion(values) {
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(values)
        }
        const response = await fetchAPI(API_REPOSICION_URL, options)
        return ({
            message: response.message,
            reposiciones: formatReposiciones(response.reposiciones)
        })
    }

    //Crear reposicion o extra
    async function saveReposicionOrExtra(values) {
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.access
            },
            body: JSON.stringify(values)
        }
        const response = await fetchAPI(API_PRODUCCION_POST_REPOSICION_OR_EXTRA, options)
        return ({ message: response.message })
    }

    async function getReposiciones(idProduccion) {
        let options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + session.access }
        }
        const { reposiciones } = await fetchAPI(API_REPOSICION_URL + idProduccion, options)
        return formatReposiciones(reposiciones)
    }



    return (
        <PedidosContext.Provider
            value={{
                allPedidos,
                allEtiquetas,
                loading,
                errors,
                refreshPedidos,
                setLoading,
                getFichas,
                postPedido,
                findPedido,
                putProduccion,
                setAllEtiquetas,
                getRegistrosByIdProduccion,
                deletePedidos,
                saveReposicion,
                getReposiciones,
                produccion_por_modelo_y_empleado,
                produccion_por_maquina_y_turno,
                saveReposicionOrExtra,
                getMaterialesByPedido
            }}
        >
            {children}
        </PedidosContext.Provider>
    )
}
