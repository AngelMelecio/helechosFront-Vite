import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { GiConsoleController } from "react-icons/gi"
import { ICONS } from "../constants/icons"
import MaquinasTable from "./MaquinasTable"


const SelectorMaquinas = ({
  availableMaquinas, setAvailableMaquinas,
  assignedMaquinas, setAssignedMaquinas
}) => {

  const upButtonRef = useRef()
  const downButtonRef = useRef()

  const someSelected = (list) => {
    let sel = false
    list.map(m => {
      if (m.isChecked) sel = true
    })
    return sel
  }

  const handleDownButtonDisable = (dis) => {
    downButtonRef.current.disabled = dis
  }
  const handleUpButtonDisable = (dis) => {
    upButtonRef.current.disabled = dis
  }

  const passMaquinasDown = () => {
    let newAssigned = assignedMaquinas
    availableMaquinas.forEach(m => {
      m.isChecked && newAssigned.push({ ...m, isChecked: false })
    })
    setAssignedMaquinas(newAssigned)
    setAvailableMaquinas(prev => prev.filter(m => !m.isChecked))
  }

  const passMaquinasUp = () => {
    let newAvailable = availableMaquinas
    assignedMaquinas.forEach(m => {
      m.isChecked && newAvailable.push({ ...m, isChecked: false })
    })
    setAvailableMaquinas(newAvailable)
    setAssignedMaquinas(prev => prev.filter(m => !m.isChecked))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex justify-center w-full">
          <p className="font-medium text-teal-800">Disponibles</p>
        </div>
        <div className="flex justify-center w-full">
          <p className="font-medium text-teal-800">Asignadas</p>
        </div>
      </div>
      <div className='flex flex-row h-full '>
        <div className='flex relative w-full h-full border-2 border-slate-200 bg-white'>
          {availableMaquinas?.length > 0 ?
            <MaquinasTable
              list={availableMaquinas}
              setList={setAvailableMaquinas}
              onSomeSelected={handleDownButtonDisable}
            /> :
            <div className="bg-slate-100 text-gray-600 total-center w-full">
              <div className="text-center text-sm font-semibold p-2">
                NO HAY MAQUINAS DISPONIBLES
              </div>
            </div>
          }
        </div>
        <div className='flex flex-col w-14 p-1 total-center bg-white'>
          <button
            disabled={!someSelected(availableMaquinas)}
            onClick={passMaquinasDown}
            ref={downButtonRef}
            className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg m-1'
          >
            <ICONS.Right size='22px' />
          </button>
          <button
            disabled={!someSelected(assignedMaquinas)}
            onClick={passMaquinasUp}
            ref={upButtonRef}
            className='bg-teal-500 text-white w-8 h-8 total-center normalButton rounded-lg m-1'>
            <ICONS.Left size='22px' />
          </button>
        </div>
        <div className='flex relative w-full h-full border-2 border-slate-200 bg-white'>
          {assignedMaquinas.length > 0 ?
            <MaquinasTable
              list={assignedMaquinas}
              setList={setAssignedMaquinas}
              onSomeSelected={handleUpButtonDisable}
            /> :
            <div className="bg-slate-100 text-gray-600 total-center w-full">
              <div className="text-center text-sm font-semibold p-2">
                ASIGNA ALGUNA MAQUINA A ESTE EMPLEADO
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
export default SelectorMaquinas