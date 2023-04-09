import { useEffect, useRef, useState } from "react";
import { ICONS } from "../../constants/icons";
import { sleep } from "../../constants/sleep";
import { useApp } from "../../context/AppContext";
import Input from '../Input'
import Th from "../Th";

const SelectorMateriales = ({
  fichaTecnicaObj,
  setFichaTecnicaObj,
  onPassMateriales
}) => {

  const selectorContentRef = useRef()
  const searchRef = useRef()

  const { allMateriales, getMateriales } = useApp()

  const [availableMateriales, setAvailableMateriales] = useState([])
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [materialSearchText, setMaterialSearchText] = useState('')

  async function loadData() {
    await getMateriales()
  }

  useEffect(() => {
    loadData()
  }, [])


  useEffect(() => {
    let formated = allMateriales?.map(m => ({ ...m, count: 0 }))
    setAvailableMateriales(formated)
    setMaterialSearchText('')

    console.log(allMateriales)

  }, [selectorVisible])


  const handleSearch = () => {
    let val = searchRef.current.value.trim().toLowerCase()
    let newMateriales = allMateriales.filter(m =>
      Object.keys(m).some(k =>
        m[k].toString().toLowerCase().includes(val.toString().toLowerCase())
      )
    )
    newMateriales = newMateriales.map(m => ({ ...m, count: 0 }))
    setAvailableMateriales(newMateriales)
  }

  const handleShowSelector = async () => {
    setSelectorVisible(true)
    await sleep(150)
    selectorContentRef.current.classList.add('visible')
  }
  const handleCloseSelector = async () => {
    selectorContentRef.current.classList.remove('visible')
    await sleep(150)
    setSelectorVisible(false)
  }

  const handleSearchButtonClick = () => {
    if (materialSearchText.length > 0) {
      searchRef?.current?.blur()
      setMaterialSearchText('')
      let newMateriales = allMateriales.map(m => ({ ...m, count: 0 }))
      setAvailableMateriales(newMateriales)
      return
    }
    searchRef?.current?.focus()
  }

  const handleChangeMaterialCount = (e, indx) => {
    let newVal = [...availableMateriales]
    if (e == 'sub') {
      newVal[indx].count && newVal[indx].count--
      setAvailableMateriales(newVal)
    } else {
      newVal[indx].count++
      setAvailableMateriales(newVal)
    }
  }
  const handleChangeMaterial = (e, indx) => {
    let newMateriales = [...fichaTecnicaObj.materiales]
    newMateriales[indx][e.target.name] = e.target.value
    setFichaTecnicaObj(prev => ({ ...prev, materiales: newMateriales }))
  }

  const handleDeleteMaterial = (e, indx) => {
    e.preventDefault()

    let newMateriales = [...fichaTecnicaObj.materiales]
    newMateriales.splice(indx, 1)
    setFichaTecnicaObj(prev => ({ ...prev, materiales: newMateriales }))
  }


  let sel_width = selectorVisible ? 'w-full' : 'w-10'
  let addButtonClass = selectorVisible ? 'neutral-button' : 'normal-button'
  let someMaterialSelected = availableMateriales?.reduce((ans, m) => (m.count > 0) | ans, 0)

  return (
    <div className="flex w-full h-80 relative">
      <div className={"flex flex-row absolute w-full h-full"}>
        <div className={"flex flex-col  h-full duration-500 " + sel_width}>
          <div className="flex flex-row relative justify-between items-center">
            <button
              type="button"
              className={"flex items-center justify-center w-8 h-8 rounded-lg " + addButtonClass}
              onClick={() => !selectorVisible ? handleShowSelector() : handleCloseSelector()}>
              {!selectorVisible ? <ICONS.Plus /> : <ICONS.Cancel size='22px' />}
            </button>

          </div>
          <div ref={selectorContentRef} className="modal  w-full h-full overflow-scroll ">
            {selectorVisible &&
              <div>
                <div className={`flex flex-row py-2 modal w-full h-full ${selectorVisible ? "visible" : ""}`}>
                  <div className="flex relative w-full items-center">
                    <input
                      className='w-full h-full pr-10 rounded-2xl py-1 pl-3 outline-none bg-gray-100'
                      ref={searchRef}
                      onChange={(e) => {
                        setMaterialSearchText(e.target.value)
                        handleSearch()
                      }}
                      value={materialSearchText}
                      type="text"
                    />
                    <button
                      type="button"
                      onClick={handleSearchButtonClick}
                      className='h-6 w-6 absolute right-1 total-center opacity-white rounded-2xl'>
                      {
                        materialSearchText.length > 0 ?
                          <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                          <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
                      }
                    </button>
                  </div>
                  <button
                    disabled={!someMaterialSelected}
                    onClick={() => {onPassMateriales(availableMateriales); handleCloseSelector()}}
                    type="button"
                    className={`flex items-center justify-center normal-button w-8 h-8 rounded-lg duration-500 `} >
                    <ICONS.Right size="25px" />
                  </button>
                </div>
                {
                  availableMateriales?.map((m, i) =>
                    <div className={`w-full flex flex-row border border-transparent border-b-slate-300`} key={'M' + i}>
                      <div className={`duration-200 w-4 ${m.count && " bg-teal-400"}`}></div>
                      <div className="w-full flex flex-row p-2">
                        <div className="flex flex-row control items-center">
                          <button className="neutral-button rounded-full w-6 h-6" id='sub' type="button" onClick={(e) => handleChangeMaterialCount('sub', i)}> <ICONS.Minus /></button>
                          <p className="px-2 text-lg">{m.count}</p>
                          <button className="neutral-button rounded-full w-6 h-6" id='plus' type="button" onClick={(e) => handleChangeMaterialCount('plus', i)}> <ICONS.Plus size="11px" /></button>
                        </div>
                        <p className="pl-3">
                          {m.tipo} - {m.color} - {m.nombreProveedor}
                        </p>
                      </div>
                    </div>)

                }
              </div>

            }
          </div>
        </div>
        <div className={"flex h-full overflow-scroll duration-500 w-full"}>
          <div className="w-full" >
            <table className="w-full">
              <thead>
                <tr className="font-medium text-teal-800">
                  <Th>GUIA HILOS</Th>
                  <Th>CALIBRE</Th>
                  <Th>PROVEEDOR</Th>
                  <Th>COLORES</Th>
                  <Th>TEÑIDA</Th>
                  <Th>TIPO</Th>
                  <Th>HEBRAS</Th>
                  <Th>PESO</Th>
                </tr>
              </thead>
            <tbody>
                {
                  //  ASSIGNED MATERIALES 
                  fichaTecnicaObj?.materiales?.map((f, i) =>
                    <tr key={'F' + i} className="array-row border border-transparent relative hover:bg-slate-200 duration-200">
                      <td>
                        <input
                          name='guiaHilos'
                          value={f.guiaHilos ? f.guiaHilos : ''}
                          className="flex w-full p-1 outline-none  duration-300 border focus:border-teal-500"
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          type="text" />
                      </td>
                      <td>
                        <input
                          readOnly
                          className="flex w-full p-1 outline-none border-0 duration-300 bg-transparent focus:border-teal-500"
                          value={f.calibre}
                          type="text" />

                      </td>
                      <td>
                        <input
                          readOnly
                          className="flex w-full p-1 outline-none border-0 duration-300 bg-transparent focus:border-teal-500"
                          value={f.nombreProveedor}
                          type="text" />

                      </td>
                      <td className="flex">
                        <div className="flex flex-row items-center w-full ">
                          <input
                            readOnly
                            className="flex w-full p-1 outline-none border-0 duration-300 bg-transparent focus:border-teal-500"
                            value={f.color}
                            type="text" />
                          <div className="w-12 px-2">
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '10px',
                              backgroundColor: `${f.codigoColor}`
                            }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input
                          readOnly
                          value={f.tenida}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          className="flex w-full p-1 outline-none border-0 duration-300 bg-transparent focus:border-teal-500"
                          type="text" />
                      </td>
                      <td>
                        <input
                          readOnly
                          value={f.tipo}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          className="flex w-full p-1 outline-none border-0 duration-300 bg-transparent focus:border-teal-500"
                          type="text" />
                      </td>
                      <td>
                        <input
                          value={f.hebras}
                          name='hebras'
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          className="flex w-full p-1 outline-none  duration-300 border focus:border-teal-500"
                          type="text" />
                      </td>
                      <td>
                        <input
                          value={f.peso}
                          name='peso'
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          className="flex w-full p-1 outline-none  duration-300 border focus:border-teal-500"
                          type="text" />
                      </td>
                      <td className="bg-white">
                        <button
                          onClick={(e) => handleDeleteMaterial(e, i)}
                          className="p-1 opacity-0 trash-button rounded-md">
                          <ICONS.Trash />
                        </button>
                      </td>
                    </tr>)
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
export default SelectorMateriales