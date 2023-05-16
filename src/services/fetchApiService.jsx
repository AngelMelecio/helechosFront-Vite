import {API_URL} from "../constants/API_URL"

async function fetchAPI(path, options = {}) {
    const url = `${API_URL}/${path}`
    const response = await fetch(url, options)
    
    if (!response.ok) {
        const {message} = await response.json()
        throw message
    }
    const data = await response.json()
    return data
}

export { fetchAPI }