import {API_URL} from "../constants/HOSTS"

async function fetchAPI(path, options = {}) {
    const url = `${API_URL}/${path}`
    const response = await fetch(url, options)
    
    if (!response.ok) {
        throw await response.json()
    }
    const data = await response.json()
    return data
}

export { fetchAPI }