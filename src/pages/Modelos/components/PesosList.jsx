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
    <div className="w-100 flex justify-end pr-10">
      <div className="flex flex-col border mb-2">
        <div className="total-center font-bold text-teal-700 bg-slate-100">Peso</div>
        <div className="flex flex-row justify-between p-1">
          {
            variety.map((v, index) =>
              <div key={'W' + index} className="total-center flex flex-col px-2">
                <p className="font-semibold text-teal-700">{v.tipo}</p>
                <p>{v.peso}</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
export default PesosList