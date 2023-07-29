import { useState } from "react"
import { useEffect } from "react"

const Progreso = ({ estacion, ruta, last }) => {

  const [estaciones, setEstaciones] = useState([])

  useEffect(() => {
    let pos = "creada"
    let est = []
    let f = true
    while (pos != "entregado") {
      if (pos === estacion) {
        f = false
      }
      est.push({
        estacion: pos,
        completada: f
      })
      pos = ruta[pos]
    }
    setEstaciones(est)
  }, [estacion])

  return (
    <div className="w-full flex  total-center">
      {
        estaciones.map((estacion, indx) =>
          <div key={'E' + indx} className="flex flex-col flex-1 py-2">
            <div className="flex flex-1 items-center  relative">
              {/* Circulo */}
              <div style={{
                backgroundColor: estacion.completada ? "#6ee7b7" : "#e5e7eb",
                transition: '0.5s ease',
                //                                boxShadow: (indx && estaciones[indx - 1].completada && !estacion.completada) ? '0 0 5px 0.5px #34d399' : 'none'
              }}
                className={"h-5 w-5 rounded-full peer " + ((indx && estaciones[indx - 1].completada && !estacion.completada) || !indx && !estacion.completada ? "twinkling border-2 border-emerald-300" : "")}></div>
              {/* Raya */}
              {indx < estaciones.length - 1 &&
                <div
                  //style={{ flex: indx === 2 ? 1 : 2 }}
                  className={"h-1 mx-1 flex-1 relative bg-gray-200 "}>
                  <div style={{ width: estacion.completada ? '100%' : '0%', transition: '0.5s ease' }}
                    className="absolute h-full bg-emerald-300"></div>
                </div>
              }

              {/* INFO */}
              <div className={"hidden peer-hover:flex text-white flex-col absolute z-10 py-2 rounded-md  px-3 grayTrans text-start " + (last ? "bottom-[100%]" : "top-[100%]")}>
                <p className="font-base text-xs ">
                  {estacion.completada ? "Completada" : (indx && estaciones[indx - 1].completada && !estacion.completada ? "En Progreso" : "Pendiente")}
                </p>
                <p className="font-medium ">
                  {estacion.estacion[0].toUpperCase()}{estacion.estacion.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )

      }
    </div>
  )
}
export default Progreso