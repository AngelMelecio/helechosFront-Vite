import {API_URL} from "../constants/API_URL"

async function fetchAPI(path, options = {}) {
    const url = `${API_URL}/${path}`
    const response = await fetch(url, options)
    
    if (!response.ok) {
        //const error = new Error('Error en la solicitud a la API')
        //error.response = response
        throw await response.json()
    }
    const data = await response.json()
    return data
}

export { fetchAPI }