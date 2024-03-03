import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { ICONS } from "../../../constants/icons"

const ShowTable = ({
  data,
  columns,
  unique,
}) => {
  const [searchText, setSearchText] = useState('')
  const [sortParams, setSortParams] = useState({ attribute: null, criteria: null })
  const [filter, setFilter] = useState({ atr: unique, ord: 1 })

  const searchRef = useRef()
  const someSelectedRef = useRef()
  const trashButtonRef = useRef()

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef?.current?.blur()
      setSearchText('')
      //setVisibleItems(sortItems())
      return
    }
    searchRef?.current?.focus()
  }
  return (
    <div className="flex flex-col w-full h-full bg-white">
     
      <div
        id="table-container"
        className="relative flex w-full h-full bg-gray-200 ">
        <div className="w-full">
          <table className="w-full bg-white customTable">
            <thead className='text-center'>

              <tr className="h-10">
                {columns.map((column, index) => (
                  <th className="sticky top-0 z-[12] pl-2 pr-8 text-teal-800/80 bg-white hover-modal whitespace-nowrap" key={index}>
                    {column.label}
                    <div className="absolute top-0 right-0 w-8 h-8 p-1">
                      <button type="button" onClick={() => { setFilter(prev => ({ atr: column.atr, ord: (prev.atr === column.atr ? (prev.ord + 1) % 3 : 1) })) }}
                        className={((filter.atr === column.atr && filter.ord !== 0) ? "" : "elmt ") + "h-full w-full flex items-center justify-center"} >
                        {filter.atr === column.atr ? (filter.ord === 1 ? <ICONS.Down size="18px" /> : (filter.ord === 2 ? <ICONS.Up size="18px" /> : <ICONS.Filter size="18px" />)) : <ICONS.Filter size="18px" />}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              { data
                .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(searchText.toLowerCase())))
                .sort((a, b) => {
                  if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                  if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                })
                .map((row, i) => (
                  <tr
                    //onClick={() => handleCheck(row[unique])}
                    className="h-8 duration-200 hover:bg-gray-100"
                    key={"R" + i}>
                    {/*<td className="sticky px-2">
                      <input
                      readOnly checked={row?.isSelected | false} className="pointer-events-none" type="checkbox" />
                    </td>*/}
                    {columns.map((column, j) => (
                      <td className="px-4 text-center whitespace-nowrap" key={j}>{row[column.atr]}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-gray-200">
                  <tr className="h-8"> 
                    { columns.map((column, index) => <td className="font-semibold text-center bg-slate-100">
                      {column.sum && data.reduce((acc, item) => acc + Number(item[column.atr]), 0).toFixed(2)}
                    </td>)
                    }
                  </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ShowTable
