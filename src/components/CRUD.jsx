import { useEffect, useRef, useState } from "react"
import { ICONS } from "../constants/icons"
import Loader from "./Loader/Loader"
import { useNavigate } from "react-router-dom";

const CRUD = ({
  title,
  path,
  idName,
  loading,
  allElements,
  elements,
  setElements,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onPrint,
}) => {


  //const [loading, setLoading] = useState(true)

  const [searchText, setSearchText] = useState('')
  const [sortParams, setSortParams] = useState({ attribute: null, criteria: null })

  const searchRef = useRef()
  const someSelectedRef = useRef()
  const trashButtonRef = useRef()


  useEffect(() => {
    if (someSelectedRef.current){
      someSelectedRef.current.checked = elements.reduce( (or, e) => e.isSelected | or, false)
    }
  }, [elements])

  useEffect(() => {
    handleSearch()
  }, [sortParams])

  const isSelected = () => {
    let sel = false
    elements?.forEach(e => {
      if (e.isSelected) sel = true
    })
    return sel
  }

  const sortElements = () => {

    if (sortParams.criteria === 0 || sortParams.criteria === null) {
      return [...allElements]
    }
    else {
      let newOrder = ([...allElements].sort((a, b) => {
        let A = a[sortParams.attribute]
        if (A === null) A = ''
        if (A != true && A != false)
          A = A?.toLowerCase()
        let B = b[sortParams.attribute]
        if (B === null) B = ''
        if (B != true && B != false)
          B = B?.toLowerCase()

        if (A > B)
          return sortParams.criteria === 1 ? 1 : -1
        else if (A < B)
          return sortParams.criteria === 2 ? 1 : -1
        return 0
      }))
      return newOrder
    }
  }

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef?.current?.blur()
      setSearchText('')
      setElements(sortElements())
      return
    }
    searchRef?.current?.focus()
  }

  const handleSelection = (e) => {
    let c = e.target.checked
    let newElements = elements.map((element, indx) => (
      indx === Number(e.target.value) ?
        { ...element, isSelected: c } :
        { ...element }
    ))
    setElements(newElements)
    someSelectedRef.current.checked = newElements.reduce((or, e) => e.isSelected | or, 0)
  }

  const handleSearch = () => {
    let val = (searchRef?.current?.value)
    if (val) val = val.trim().toLowerCase()
    let sortedElements = sortElements()
    let newElements = [...sortedElements].filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })
    setElements(newElements)
  }

  const onSortCriteriaChange = (attr) => {
    let newC
    if (sortParams.attribute === attr)
      newC = { ...sortParams, criteria: (sortParams.criteria + 1) % 3 }
    else
      newC = { attribute: attr, criteria: 1 }
    setSortParams(newC)
    sortElements()
  }

  const handleSelectAll = (e) => {
    let c = e.target.checked;
    setElements(prev => prev.map(e => ({ ...e, isSelected: c })))
  }

  const CustomRow = ({ element, onClick }) => {
    return (
      <>
        {
          columns.map((c, i) => {

            let value = element[c.attribute] + ''
            let isBool = (value == 'true' || value == 'false' || value == '' || value == 'null')
            if (isBool) {
              if (value == 'true') value = 'Sí'
              else value = '--'
            }
            return <td
              className="px-4"
              key={'td' + i}
              onClick={onClick}>
              <p className="flex flex-row items-center">
                {value}
                {value === 'Activo' && <ICONS.Active className="ml-2 text-sm text-emerald-500" />}
                {value === 'Inactivo' && <ICONS.Ghost className="ml-2 text-lg text-gray-500" />}
              </p>
            </td>
          }
          )
        }
      </>
    )
  }

  const ThIcon = ({ attribute }) => {
    if (attribute === sortParams.attribute) {
      if (sortParams.criteria === 0)
        return <ICONS.Filter className="filter-button" />
      else if (sortParams.criteria === 1)
        return <ICONS.DownFill />
      else
        return <ICONS.UpFill />
    }
    else
      return <ICONS.Filter className="filter-button" />
  }

  const navigate = useNavigate();

  return (
    <div className="flex w-full h-full relative pl-18 bg-slate-100">
      <div id="tbl-page" className="flex flex-col h-full w-full absolute px-8 py-5 overflow-hidden">
        <h1 className="font-bold text-3xl pb-4 pl-3 text-teal-700">{title}</h1>
        <div className="h-full flex flex-col shadow-lg">
          <div
            className="flex flex-col bg-white py-4 px-5 rounded-t-lg"
            id="options-bar" >
            <div className="flex w-full justify-between">
              <div
                className="flex flex-row"
                id="butons">
                <button
                  onClick={() => navigate(`/${path}/0`)}
                  className='bg-teal-500 text-white w-8 h-8 total-center normal-button rounded-lg'>
                  <ICONS.Plus size='16px' />
                </button>
                {onPrint &&
                  <button onClick={onPrint}
                    disabled={!isSelected()}
                    className={'total-center ml-4 w-8 h-8 normal-button rounded-lg'}>
                    <ICONS.Print size='22px' />
                  </button>}
                <button
                  onClick={onDelete}
                  disabled={!isSelected()}
                  ref={trashButtonRef}
                  className={'total-center ml-4 w-8 h-8 trash-button rounded-lg'}>
                  <ICONS.Trash size='19px' />
                </button>
              </div>
              <div
                id="searchbar"
                className="flex relative w-80 items-center">
                <input
                  id='search-input'
                  className='w-full h-full pr-10 rounded-2xl py-1 pl-3 outline-none bg-slate-100'
                  ref={searchRef}
                  onChange={(e) => {
                    setSearchText(e.target.value)
                    handleSearch()
                  }}
                  value={searchText}
                  type="text"
                />
                <button
                  onClick={handleSearchButtonClick}
                  className='h-6 w-6 absolute right-1 total-center opacity-white rounded-2xl'>
                  {
                    searchText.length > 0 ?
                      <ICONS.Cancel size='18px' style={{ color: '#4b5563' }} /> :
                      <ICONS.Lupa size='13px' style={{ color: '#4b5563' }} />
                  }
                </button>
              </div>
            </div>
          </div>
          <div
            id="table-container"
            className=" flex w-full h-full relative bg-gray-50 overflow-x-scroll">
            {loading ?
              <div className="absolute w-full p-10 flex justify-center">
                <Loader />
              </div> :
              <div className="w-full">
                {
                  <table className="customTable bg-white  w-full">
                    <thead className='text-center'>
                      <tr>
                        <th className="px-7 w-10">
                          <div className="inp-container">
                            <input
                              onChange={(e) => handleSelectAll(e)}
                              ref={someSelectedRef}
                              type="checkbox"
                            />
                            <label className="check"></label>
                          </div>
                        </th>
                        {
                          columns.map((c, i) =>
                            <th className='p-2 font-medium text-teal-800' key={"C" + i} >
                              {<div className="flex flex-row relative total-center text-center">
                                <p className="px-6">{c.name} </p>
                                <button
                                  onClick={() => onSortCriteriaChange(c.attribute)}
                                  className="absolute right-0 h-4 w-4 total-center">
                                  <ThIcon attribute={c.attribute} />
                                </button>
                              </div>}
                            </th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        elements?.map((e, i) =>
                          <tr key={'C' + i}>
                            <td className="px-7" >
                              <div className="inp-container">
                                <input
                                  value={i}
                                  className='inp-check'
                                  type="checkbox"
                                  onChange={handleSelection}
                                  checked={e?.isSelected}
                                />
                                <label className="check"></label>
                              </div>
                            </td>
                            <CustomRow element={e} index={i} onClick={() => navigate(`/${path}/${e[idName]}`)} />
                          </tr>
                        )
                      }
                    </tbody>
                  </table>}
              </div>
            }

          </div>
        </div>
      </div>
    </div>

  )
}
export default CRUD