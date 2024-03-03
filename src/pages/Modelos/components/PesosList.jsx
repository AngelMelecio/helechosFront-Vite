import { useEffect } from "react"
import { useState } from "react"

const PesosList = ({ materiales }) => {

  const [variety, setVariety] = useState([])

  useEffect(() => {
    let diferent = []
    materiales?.forEach(material => {
      if (!diferent.includes(material.tipo)) {
        diferent.push(material.tipo)
      }
    });

    let newVariety = []
    diferent.forEach(material => {
      let sum = materiales.reduce((acc, curr) => {
        return curr.tipo === material ? (acc + Number(curr.peso)) : acc
      }, 0)
      newVariety.push({ tipo: material, peso: sum })
    })

    setVariety(newVariety)

  }, [materiales])

  return (
    <div className="flex justify-center mb-4">
      <div className="flex flex-col p-2 mb-4 border rounded-md">
        <div className="pb-2 text-sm font-semibold border-b text-teal-800/80 total-center">Peso (g)</div>
        <div className="flex flex-row justify-between p-1">
          {
            variety.map((v, index) =>
              <div key={'W' + index} className="flex flex-col px-2 total-center">
                <p className="font-semibold text-gray-700">{v.peso}</p>
                <p className="font-semibold text-teal-800/80">{v.tipo}</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
export default PesosList