import React, { useEffect, useState } from 'react'

const formatEstacion = (nombre) => {
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
}

const RutaSelect = ({
  formik,
  name,
  estacionFinal,
  rutaBase,
}) => {

  const [estaciones, setEstaciones] = useState([])

  const [hoverIndex, setHoverIndex] = useState(null)

  useEffect(() => {
    console.log('rutaBase', rutaBase)
    let ets = []
    let pos = "tejido"
    let disable = false
    do {
      ets.push({
        estacion: pos,
        disabled: disable,
        checked: !disable
      })
      if (pos === estacionFinal) disable = true
      pos = rutaBase[pos]
      console.log(pos)
    } while (pos !== "empacado")

    setEstaciones(ets)
  }, [])

  const handleMouseEnter = (index) => {
    setHoverIndex(index)
  }
  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  const handleCkeck = (index) => {
    if (estaciones[index].disabled) return
    let ets = [...estaciones]
    for (let i = 0; i < ets.length; i++) {
      if (i <= index) {
        ets[i].checked = true
      } else {
        ets[i].checked = false
      }
    }
    formik.setFieldValue(name, estaciones[index].estacion)
    setEstaciones(ets)
  }

  return (
    <div>
      {
        estaciones.map((e, i) => (
          <button
            key={`st_${i}`}
            type="button"
            onClick={() => handleCkeck(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            className={`flex duration-150 px-2 items-center w-full h-8 
            ${e.disabled ? 'pointer-events-none opacity-70' : ''}
            ${hoverIndex !== null && hoverIndex >= i ? 'bg-gray-100' : ''}
            `}
          >
            <input
              className='w-5 h-5 pointer-events-none'
              type="checkbox"
              readOnly
              checked={e.checked}
              disabled={e.disabled} />
            <p className={`pl-2 font-semibold ${e.disabled ? 'text-gray-500' : 'text-gray-800'}`}>
              {formatEstacion(e.estacion)}
            </p>
          </button>
        ))
      }
    </div>
  )
}

export default RutaSelect