import { useEffect, useRef, useState } from "react"
import { ICONS } from "../constants/icons"
import Loader from "./Loader/Loader"
import { useNavigate } from "react-router-dom";
import { get } from 'lodash'
import Btton from "./Buttons/Btton";

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
  //const trashButtonRef = useRef()


  useEffect(() => {
    if (someSelectedRef.current) {
      someSelectedRef.current.checked = elements.reduce((or, e) => e.isSelected | or, false)
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
        if (A != true && A != false && typeof A === 'string')
          A = A?.toLowerCase()
        let B = b[sortParams.attribute]
        if (B === null) B = ''
        if (B != true && B != false && typeof B === 'string')
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
            let value
            if (c.type && c.type === 'dateTime' && element[c.attribute] !== null)

              value = new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                hourCycle: 'h12',
                timeStyle: 'medium',
                timeZone: 'America/Mexico_City'

              }).format(new Date(element[c.attribute]));

            else if (c.type && c.type === 'date' && element[c.attribute] !== null) {

              value = new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                timeZone: 'UTC'
              }).format(new Date(element[c.attribute]));
            }

            else
              value = typeof c.attribute === 'function' ? c.attribute(element) : get(element, c.attribute) + '';
            let isBool = (value == 'true' || value == 'false' || value == '' || value == 'null')
            if (isBool) {
              if (value == 'true') value = 'Sí'
              else value = '--'
            }
            return typeof c.attribute !== 'function' ?
              <td
                className="px-4"
                key={'td' + i}
                onClick={onClick}>
                <p className="flex flex-row items-center">
                  {value}
                  {value === 'Activo' && <ICONS.Active className="ml-2 text-sm text-emerald-500" />}
                  {value === 'Inactivo' && <ICONS.Ghost className="ml-2 text-lg text-gray-500" />}
                </p>
              </td> :
              <td
                className="px-4"
                key={'td' + i}
                onClick={onClick}>
                <div className="flex flex-row justify-center">
                  {value}
                </div>
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
        return <ICONS.Filter size="20px" className="filter-button" />
      else if (sortParams.criteria === 1)
        return <ICONS.DownFill size="20px" />
      else
        return <ICONS.UpFill size="20px" />
    }
    else
      return <ICONS.Filter size="20px" className="filter-button" />
  }

  const navigate = useNavigate();

  return (
    <div className="relative flex w-full h-full pl-18 bg-slate-100">
      <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 overflow-hidden">
        <div className="flex flex-col h-full">
          <h1 className="pb-4 pl-3 text-2xl font-bold text-teal-800/80">{title}</h1>
          <div className="flex flex-col h-full overflow-hidden bg-white shadow-lg">
            <div className="flex flex-col px-5 py-4 rounded-t-lg" >
              <div className="flex justify-between w-full">
                <div
                  className="flex flex-row"
                  id="butons">

                  <Btton
                    onClick={() => navigate(`/${path}/0`)}
                    className='w-8 h-8 total-center'>
                    <ICONS.Plus size='19px' />
                  </Btton>
                  {onPrint &&
                    <Btton onClick={onPrint}
                      disabled={!isSelected()}
                      className={'total-center ml-4 w-8 h-8 '}>
                      <ICONS.Print size='22px' />
                    </Btton>}
                  <Btton
                    trash
                    onClick={onDelete}
                    disabled={!isSelected()}
                    //ref={trashButtonRef}
                    className={'total-center ml-4 w-8 h-8 '}>
                    <ICONS.Trash size='19px' />
                  </Btton>
                </div>
                {/* Search Bar */}
                <div
                  id="searchbar"
                  className="relative flex items-center w-80">
                  <input
                    id='search-input'
                    className='w-full h-full py-1 pl-3 pr-10 outline-none rounded-2xl bg-slate-100'
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
                    className='absolute w-6 h-6 right-1 total-center opacity-white rounded-2xl'>
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
              className="relative flex w-full h-full overflow-x-scroll bg-gray-50">
              {loading ?
                <div className="absolute flex justify-center w-full p-10">
                  <Loader />
                </div> :
                <div className="w-full">
                  {
                    <table className="w-full bg-white customTable clic-row">
                      <thead className='text-center'>
                        <tr>
                          <th className="w-10 px-7">
                            <div className="total-center">
                              <input
                                className='inpt-check'
                                onChange={(e) => handleSelectAll(e)}
                                ref={someSelectedRef}
                                type="checkbox"
                              />
                            </div>
                          </th>
                          {
                            columns.map((c, i) =>
                              <th className='p-2 font-medium text-teal-800/80' key={"C" + i} >
                                {<div className="relative flex flex-row text-center total-center">
                                  <p className="px-6">{c.name} </p>
                                  <button
                                    onClick={() => onSortCriteriaChange(c.attribute)}
                                    className="absolute right-0 w-6 h-6 total-center">
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
                                <div className="total-center">
                                  <input
                                    value={i}
                                    className='inpt-check'
                                    type="checkbox"
                                    onChange={handleSelection}
                                    checked={e?.isSelected}
                                  />

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
    </div>

  )
}
export default CRUD