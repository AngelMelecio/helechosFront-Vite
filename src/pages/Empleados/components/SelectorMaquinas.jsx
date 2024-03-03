import { useEffect } from "react"
import { useEmpleados } from "../hooks/useEmpleados"
import { useState } from "react"
import { useRef } from "react"
import { ICONS } from "../../../constants/icons"
import { sleep } from "../../../constants/functions"
import MaquinasTable from "./MaquinasTable"
import Btton from "../../../components/Buttons/Btton"

const SelectorMaquinas = ({
  idEmpleado,
  allMaquinas,
  assignedMaquinas,
  setAssignedMaquinas,
  setTheresChanges,
  departamentoEmpleado
}) => {

  const {
    getEmpleadoMaquinas,
    loadingEmpleadoMaquinas,
  } = useEmpleados()

  const [availableMaquinas, setAvailableMaquinas] = useState([])
  const [availableMaquinasList, setAvailableMaquinasList] = useState([])
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [maquinaSearchText, setMaquinaSearchText] = useState('')
  const [empleadoMaquinasIds, setEmpledoMaquinasIds] = useState([])

  const searchRef = useRef(null)
  const selectorContentRef = useRef(null)

  useEffect(async () => {
    if (idEmpleado === '0') return
    let empleadoMaquinas = await getEmpleadoMaquinas(idEmpleado)
    let ids = empleadoMaquinas.map(m => m.idMaquina)
    setEmpledoMaquinasIds(ids)
  }, [idEmpleado])

  useEffect(() => {
    setAssignedMaquinas(
      allMaquinas.filter(maquina => empleadoMaquinasIds.includes(maquina.idMaquina))
    )
    setAvailableMaquinas(
      allMaquinas.filter(maquina => !empleadoMaquinasIds.includes(maquina.idMaquina)).filter(m => m.departamento === departamentoEmpleado)
    )
    setAvailableMaquinasList(
      allMaquinas
        .filter(maquina => !empleadoMaquinasIds.includes(maquina.idMaquina)).filter(m => m.departamento === departamentoEmpleado)
        .map(maquina => ({ ...maquina, isSelected: false }))
    )
  }, [allMaquinas, departamentoEmpleado])

  const handleShowSelector = async () => {
    setSelectorVisible(true)
    await sleep(200)
    selectorContentRef.current.classList.add('visible')
  }
  const handleCloseSelector = async () => {
    selectorContentRef.current.classList.remove('visible')
    setAvailableMaquinasList(prev => prev.map(m => ({ ...m, isSelected: false })))
    await sleep(200)
    setSelectorVisible(false)
  }

  const handleSearchButtonClick = () => {
    if (maquinaSearchText.length > 0) {
      searchRef?.current?.blur()
      setMaquinaSearchText('')
      let newMaquinas = availableMaquinas.map(m => ({ ...m, isSelected: false }))
      setAvailableMaquinasList(newMaquinas)
      return
    }
    searchRef?.current?.focus()
  }

  const handleSelectMaquina = (e) => {
    let newAvailable = [...availableMaquinasList]
    newAvailable[e].isSelected = !newAvailable[e].isSelected
    setAvailableMaquinasList(newAvailable)
  }

  const handleUnassign = (indx) => {
    let newAssigned = [...assignedMaquinas]
    let newAvailable = [...availableMaquinasList]
    newAvailable.push(newAssigned[indx])
    newAssigned.splice(indx, 1)
    setAssignedMaquinas(newAssigned)
    setAvailableMaquinasList(newAvailable)
    setTheresChanges(true)
  }

  const handlePassMateriales = () => {
    setAssignedMaquinas(prev => [
      ...prev,
      ...(availableMaquinasList.filter(m => m.isSelected).map(m => ({ ...m, isSelected: false })))
    ])
    setAvailableMaquinasList(prev => [
      ...prev.filter(m => !m.isSelected)
    ])
    handleCloseSelector()
    setMaquinaSearchText('')
    setTheresChanges(true)
  }

  return (
    <>
      <div className="relative w-full h-full">
        <div className="absolute flex w-full h-full ">
          {/*
           * AvailableMaquinas
           */}
          <div className={`h-full flex flex-col duration-500 ${selectorVisible ? 'w-full' : 'w-10'}`}>
            {/**
             * Hide/show AvailableMaquinas Button
             */}
            <div className="relative flex flex-row items-center justify-between pb-2">
              <Btton
                type="button"
                neutral={selectorVisible}
                className={`total-center size-8`}
                onClick={() => !selectorVisible ? handleShowSelector() : handleCloseSelector()}>
                {!selectorVisible ? <ICONS.Plus size='20px' /> : <ICONS.Left size='22px' />}
              </Btton>
            </div>
            <div className="relative flex flex-col h-full overflow-hidden modal" ref={selectorContentRef}>
              {/**
               * Search bar and passButton
               */}
              <div className="relative flex items-center pb-2 pr-3 h-14 ">
                <div className="relative flex items-center flex-grow mr-2">
                  <input
                    className='w-full h-full py-1 pl-3 pr-10 bg-gray-100 outline-none rounded-2xl'
                    ref={searchRef}
                    onChange={(e) => {
                      setMaquinaSearchText(e.target.value)
                    }}
                    value={maquinaSearchText}
                    type="text"
                  />
                  <button
                    type="button"
                    onClick={handleSearchButtonClick}
                    className='absolute w-6 h-6 right-1 total-center opacity-white rounded-2xl'>
                    {
                      maquinaSearchText.length > 0 ?
                        <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                        <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
                    }
                  </button>
                </div>
                <Btton
                  neutral={!availableMaquinasList.some(m => m.isSelected)}
                  disabled={!availableMaquinasList.some(m => m.isSelected)}
                  onClick={handlePassMateriales}
                  type="button"
                  className={`total-center size-8 `} >
                  <ICONS.Right size="25px" />
                </Btton>
              </div>
              {/**
               * Available list
               */}
              <div className="flex-col h-full overflow-scroll bg-gray-50">
                <div className="flex flex-col">
                  {
                    // 
                    availableMaquinasList
                      .filter(m =>
                        Object.keys(m).some(k =>
                          m[k]?.toString().toLowerCase()
                            .includes(searchRef?.current?.value.trim().toLowerCase().toString().toLowerCase())
                        ))
                      .map((maquina, i) =>
                        <button
                          type='button'
                          onClick={() => handleSelectMaquina(i)}
                          key={"AM" + i}
                          className="flex items-center h-8 duration-200 bg-white border-b-2 hover:bg-gray-100"
                        >
                          <div className="flex h-full px-2 total-center">
                            <div className={`rounded-md duration-200 w-5 h-5 p-1 ${maquina.isSelected ? 'bg-teal-400' : 'bg-white'}`}>
                              <div className="w-full h-full bg-white palomita"></div>
                            </div>
                          </div>
                          <div className="w-full font-semibold text-gray-700 text-start" >
                            {((maquina.linea !== '0') ? 'L' + maquina.linea + ' - ' : '') + 'M' + maquina.numero + ' / ' + maquina.departamento}
                          </div>
                        </button>
                      )
                  }
                </div>
              </div>
            </div>
          </div>
          {/**
           * AssignedMaquinas 
           */}
          {assignedMaquinas.length > 0 ?
            <div className="w-full h-full">
              <div className="relative w-full h-full">
                <MaquinasTable
                  maquinas={assignedMaquinas}
                  onUnassing={handleUnassign}
                />
              </div>
            </div> :
            <div className="w-full h-full bg-gray-200 total-center">
              <p className="italic font-semibold text-gray-500">No hay maquinas asignadas</p>
            </div>

          }
        </div>
      </div>
    </>
  )
}
export default SelectorMaquinas