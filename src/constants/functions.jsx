export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const toUrl = (file) => {
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  if (file === '') return null
  return file
}

export function formatDate({ data }) {
  // const { string } = data
  let value = ""
  if (data === null) return value
  if (data.length > 10)//type && type === 'dateTime')

    value = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      hourCycle: 'h12',
      timeStyle: 'medium',
      timeZone: 'America/Mexico_City'

    }).format(new Date(data));

  else { //if (type && type === 'date') {
    value = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeZone: 'UTC'
    }).format(new Date(data));
  }
  return value
}

export const calculateDiasRestantes = (fecha) => {
  let fechaActual = new Date()
  let fechaEntrega = new Date(fecha)
  let diff = fechaEntrega.getTime() - fechaActual.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}