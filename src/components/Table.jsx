import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { ICONS } from "../constants/icons"

const Table = ({
  allItems,
  visibleItems, setVisibleItems,
  fetching,
  columns,
  onAdd,
  onDelete,
  onEdit,
  onPrint=false,
  filters = [{atr:'is_active'}]
}) => {


  const [searchText, setSearchText] = useState('')
  const [sortParams, setSortParams] = useState({ attribute: null, criteria: null })

  const searchRef = useRef()
  const someSelectedRef = useRef()
  const trashButtonRef = useRef()

  useEffect(() => {
    //console.log('CARGANDO TODO EN LA TABLA...  ')
    //console.log('fetching: ', fetching)
    setVisibleItems(allItems)
  }, [allItems])

  useEffect(() => {
    hideShowOptions(isSelected())
  }, [visibleItems])

  useEffect(() => {
    handleSearch()
  }, [sortParams])

  const isSelected = () => {
    let sel = false
    visibleItems?.forEach(e => {
      if (e.isSelected) sel = true
    })
    return sel
  }

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef?.current?.blur()
      setSearchText('')
      setVisibleItems(sortItems())
      return
    }
    searchRef?.current?.focus()
  }

  const handleSelection = (e) => {
    setVisibleItems(prev => prev.map((empl, indx) => (
      indx === Number(e.target.value) ?
        { ...empl, isSelected: e.target.checked } :
        { ...empl }
    )))
  }

  const hideShowOptions = (a) => {
    someSelectedRef.current.checked = a
    someSelectedRef.current.disabled = !a
  }

  const handleSearch = () => {
    let val = (searchRef?.current?.value).trim().toLowerCase()
    let sortedItems = sortItems()
    let newItems = [...sortedItems].filter(e => {
      let E = JSON.stringify(e).toLowerCase()
      return E.includes(val)
    })
    hideShowOptions(false)
    setVisibleItems(newItems)
  }



  const sortItems = () => {

    if (sortParams.criteria === 0 || sortParams.criteria === null) {
      return [...allItems]
    }
    else {
      let newOrder = ([...allItems].sort((a, b) => {
        let A = a[sortParams.attribute]
        if( A === null ) A = ''
        if (A != true && A != false)
          A = A?.toLowerCase()
        let B = b[sortParams.attribute]
        if( B === null ) B = ''
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


  const onSortCriteriaChange = (attr) => {
    let newC
    if (sortParams.attribute === attr)
      newC = { ...sortParams, criteria: (sortParams.criteria + 1) % 3 }
    else
      newC = { attribute: attr, criteria: 1 }
    setSortParams(newC)
    sortItems()
  }

  const unSelecAll = () => {
    setVisibleItems(prev => prev.map(item => ({ ...item, isSelected: false })))
    hideShowOptions(false)
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
        return <ICONS.Filter size="20px" className="filter-button" />
      else if (sortParams.criteria === 1)
        return <ICONS.DownFill size="20px" />
      else
        return <ICONS.UpFill size="20px" />
    }
    else
      return <ICONS.Filter size="20px" className="filter-button" />
  }

  return (
    <div id="tbl-page" className="flex flex-col h-full w-full bg-white">
      <div
        className="flex flex-row justify-between p-5"
        id="options-bar" >
        <div
          className="flex flex-row"
          id="butons">
          <button
            onClick={onAdd}
            className='bg-teal-500 text-white w-8 h-8 total-center normal-button rounded-lg'>
            <ICONS.Plus size='16px' />
          </button>
          { onPrint && 
          <button onClick={onPrint}
          disabled={!isSelected()}
          className={'total-center ml-4 w-8 h-8 normal-button rounded-lg'}>
            <ICONS.Print size='22px'/>
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
            className='w-full h-full pr-10 rounded-2xl py-1 pl-3 outline-none bg-gray-100'
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
      <div
        id="table-container"
        className=" flex w-full h-full relative bg-gray-200 overflow-x-scroll">
        <div className="w-full">
          <table className="customTable bg-white  w-full">
            <thead className='text-center'>
              <tr>
                <th className="px-7 w-10">
                  <div className="inp-container">
                    <input
                      onChange={unSelecAll}
                      ref={someSelectedRef}
                      type="checkbox"
                      disabled />
                    <label className="check"></label>
                  </div>
                </th>
                {
                  columns.map((c, i) =>
                    <th className='p-2 font-medium text-teal-700' key={"C" + i} >
                      {<div className="flex flex-row relative total-center text-center">
                        <p className="px-6">{c.name} </p>
                        <button
                          onClick={() => onSortCriteriaChange(c.attribute)}
                          className="absolute right-0 h-6 w-6 total-center">
                          <ThIcon attribute={c.attribute} />
                        </button>
                      </div>}
                    </th>)
                }
              </tr>
            </thead>
            <tbody>
              {
                visibleItems?.map((e, i) =>
                  <tr key={"E" + i} >
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
                    <CustomRow element={e} index={i} onClick={() => onEdit(e)} />
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table
