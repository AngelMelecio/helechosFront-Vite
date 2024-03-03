import { useEffect, useRef, useState } from "react";
import { useMateriales } from '../../Materiales/hooks/useMateriales'
import Loader from '../../../components/Loader/Loader'
import { ICONS } from "../../../constants/icons";
import { sleep } from "../../../constants/functions";
import { useDetailModelos } from "../hooks/useDetailModelos";

const Th = ({ children }) => <th className="sticky top-0 z-10 font-medium bg-white">{children}</th>
const TableInpt = ({ value, name, onChange, ...props }) => {
  return (
    <input
      name={name}
      value={value}
      className="flex w-full h-8 px-2 font-medium text-gray-700 duration-300 border rounded-md outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 hover:border-teal-500 "
      onChange={onChange}
      {...props}
    />
  )
}

const SelectorMateriales = ({
  fichaTecnicaObj,
  onPassMateriales,
  setTheresChanges,
}) => {

  const selectorContentRef = useRef()
  const searchRef = useRef()

  const {
    allMateriales,
    refreshMateriales,
    loading,
  } = useMateriales()

  const [availableMateriales, setAvailableMateriales] = useState([])
  const [selectorVisible, setSelectorVisible] = useState(false)
  const [materialSearchText, setMaterialSearchText] = useState('')

  async function loadData() {
    await refreshMateriales()
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let formated = allMateriales?.map(m => ({ ...m, count: 0 }))
    setAvailableMateriales(formated)
    setMaterialSearchText('')
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
    let newMateriales = [...fichaTecnicaObj.values.materiales]
    newMateriales[indx][e.target.name] = e.target.value
    fichaTecnicaObj.setValues(prev => ({ ...prev, materiales: newMateriales }))
    setTheresChanges(true)
  }

  const handleDeleteMaterial = (e, indx) => {
    e.preventDefault()
    let newMateriales = [...fichaTecnicaObj.values.materiales]
    newMateriales.splice(indx, 1)
    fichaTecnicaObj.setValues(prev => ({ ...prev, materiales: newMateriales }))
    setTheresChanges(true)
  }
  const swapMaterials = (index1, index2) => {
    const newMateriales = [...fichaTecnicaObj.values.materiales];
    const temp = newMateriales[index1];
    newMateriales[index1] = newMateriales[index2];
    newMateriales[index2] = temp;
    fichaTecnicaObj.setValues(prev => ({ ...prev, materiales: newMateriales }));
    setTheresChanges(true)
  };

  let sel_width = selectorVisible ? 'w-full' : 'w-10'
  let addButtonClass = selectorVisible ? 'neutral-button' : 'normal-button'
  let someMaterialSelected = availableMateriales?.reduce((ans, m) => (m.count > 0) | ans, 0)

  return (
    <div className="relative flex w-full h-80">
      <div className={"flex flex-row absolute w-full h-full"}>
        <div className={"flex flex-col  h-full duration-500 " + sel_width}>
          <div className="relative flex flex-row items-center justify-between">
            <button
              type="button"
              className={"flex items-center justify-center w-8 h-8 rounded-lg " + addButtonClass}
              onClick={() => !selectorVisible ? handleShowSelector() : handleCloseSelector()}>
              {!selectorVisible ? <ICONS.Plus /> : <ICONS.Cancel size='22px' />}
            </button>

          </div>
          <div ref={selectorContentRef} className="w-full h-full overflow-scroll modal ">
            {loading ? <Loader /> :
              <>
                {
                  selectorVisible &&
                  <div>
                    <div className={`flex flex-row py-2 modal w-full h-full ${selectorVisible ? "visible" : ""}`}>
                      <div className="relative flex items-center w-full">
                        <input
                          className='w-full h-full py-1 pl-3 pr-10 bg-gray-100 outline-none rounded-2xl'
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
                          className='absolute w-6 h-6 right-1 total-center opacity-white rounded-2xl'>
                          {
                            materialSearchText.length > 0 ?
                              <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                              <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
                          }
                        </button>
                      </div>
                      <button
                        disabled={!someMaterialSelected}
                        onClick={() => {
                          onPassMateriales(availableMateriales); setTheresChanges(true); handleCloseSelector();
                        }}
                        type="button"
                        className={`flex items-center justify-center normal-button w-8 h-8 rounded-lg duration-500 `} >
                        <ICONS.Right size="25px" />
                      </button>
                    </div>
                    {
                      availableMateriales?.map((m, i) =>
                        <div className={`w-full flex flex-row border border-transparent border-b-slate-300`} key={'M' + i}>
                          <div className={`duration-200 w-4 ${m.count && " bg-teal-400"}`}></div>
                          <div className="flex flex-row w-full p-2">
                            <div className="flex flex-row items-center control">
                              <button className="w-6 h-6 rounded-full neutral-button" id='sub' type="button" onClick={(e) => handleChangeMaterialCount('sub', i)}> <ICONS.Minus /></button>
                              <p className="px-2 text-lg">{m.count}</p>
                              <button className="w-6 h-6 rounded-full neutral-button" id='plus' type="button" onClick={(e) => handleChangeMaterialCount('plus', i)}> <ICONS.Plus size="11px" /></button>
                            </div>
                            <p className="pl-3">
                              {m.tipo} - {m.color} - {m.nombreProveedor}
                            </p>
                          </div>
                        </div>)

                    }
                  </div>
                }
              </>
            }
          </div>
        </div>
        {
          fichaTecnicaObj?.values?.materiales?.length > 0 ?
        <div className={"flex h-full overflow-scroll duration-500 w-full"}>
          <div className="w-full" >
            <table className="w-full">
              <thead>
                <tr className="h-8 text-sm text-teal-800/80">
                  <Th></Th>
                  <Th>Guía Hilos</Th>
                  <Th>calibre</Th>
                  <Th>Proveedor</Th>
                  <Th>Colores</Th>
                  <Th>Teñida</Th>
                  <Th>Tipo</Th>
                  <Th>Hebras</Th>
                  <Th>Peso</Th>
                </tr>
              </thead>
              <tbody>
                {
                  //  ASSIGNED MATERIALES 
                  fichaTecnicaObj?.values?.materiales?.map((f, i) =>
                    <tr key={'F' + i} className="relative duration-200 border border-transparent array-row hover:bg-gray-100">
                      <td className="flex bg-white justify-self-auto">
                        <div className="flex justify-between">
                          {/*Implementa en estos botones el swap*/}
                          <button
                            onClick={(e) => { e.preventDefault(); i > 0 && swapMaterials(i, i - 1) }}
                            className="neutral-button mr-0.5 mb-1 rounded-full w-8 h-8 bg-gray-300 text-zinc-800 opacity-0 flex justify-center ">
                            <ICONS.Up />
                          </button>

                          <button
                            onClick={(e) => { e.preventDefault(); i < fichaTecnicaObj.values.materiales.length - 1 && swapMaterials(i, i + 1) }}
                            className="neutral-button ml-0.5 mb-1 rounded-full w-8 h-8 bg-gray-300 text-zinc-800 opacity-0 flex justify-center">
                            <ICONS.Down />
                          </button>

                        </div>
                      </td>
                      <td>
                        <TableInpt
                          name="guiaHilos"
                          value={f.guiaHilos ? f.guiaHilos : ''}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          type="text"
                        />

                      </td>
                      <td>
                        <input
                          readOnly
                          className="flex w-full p-1 font-normal text-gray-500 duration-300 bg-transparent border-0 outline-none focus:border-teal-500"
                          value={f.calibre}
                          type="text" />
                      </td>
                      <td>
                        <input
                          readOnly
                          className="flex w-full p-1 font-normal text-gray-500 duration-300 bg-transparent border-0 outline-none focus:border-teal-500"
                          value={f.nombreProveedor}
                          type="text" />

                      </td>
                      <td className="flex">
                        <div className="flex flex-row items-center w-full ">
                          <input
                            readOnly
                            className="flex w-full p-1 font-normal text-gray-500 duration-300 bg-transparent border-0 outline-none focus:border-teal-500"
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
                          className="flex w-full p-1 font-normal text-gray-500 duration-300 bg-transparent border-0 outline-none focus:border-teal-500"
                          type="text" />
                      </td>
                      <td>

                        <input
                          readOnly
                          value={f.tipo}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          className="flex w-full p-1 font-normal text-gray-500 duration-300 bg-transparent border-0 outline-none focus:border-teal-500"
                          type="text" />
                      </td>
                      <td>
                        <TableInpt
                          name="hebras"
                          value={f.hebras}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          type="text"
                        />

                      </td>
                      <td>
                        <TableInpt
                          name="peso"
                          value={f.peso}
                          onChange={(e) => { handleChangeMaterial(e, i) }}
                          type="text"
                        />

                      </td>
                      <td className="bg-white">
                        <button
                          onClick={(e) => handleDeleteMaterial(e, i)}
                          className="p-1 rounded-md opacity-0 trash-button">
                          <ICONS.Trash />
                        </button>
                      </td>
                    </tr>)
                }
              </tbody>
            </table>
          </div>
        </div> :
        <div className="italic font-semibold text-gray-500 bg-gray-200 size-full total-center">
          Asigne materiales ...
        </div>
        }
      </div>
    </div>
  )
}
export default SelectorMateriales