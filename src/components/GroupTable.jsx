import { useEffect, useRef } from "react"
import { useState } from "react"
import { ICONS } from "../constants/icons"
import Table from "./Table"
import AbsScroll from "./AbsScroll"
import { flushSync } from "react-dom"
import { sleep } from "../constants/functions"

const Empty = ({ children }) => {
  return (
    <>
      {children}
    </>
  )
}

const GroupTable = ({
  data,
  columns,
  unique,
  search = "on",

  subRowsRef,
  subRowsColumns,
  subRowsUnique,

  footers,

  handleSubRowClick,

}) => {

  const [focusRow, setFocusRow] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [sortParams, setSortParams] = useState({ atr: unique, ord: 2 })

  const searchRef = useRef()
  const subTableRef = useRef()

  const handleSearchButtonClick = () => {
    if (searchText.length > 0) {
      searchRef?.current?.blur()
      setSearchText('')
      setVisibleItems(sortItems())
      return
    }
    searchRef?.current?.focus()
  }
  const handleMainRowClick = (id) => () => {
    setFocusRow(prev => prev === id ? null : id)
  }


  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      {
        search === "on" &&
        <div className="flex flex-row justify-end pb-2 ">
          {/* Search */}
          <div
            className="relative flex items-center w-1/3">
            <input
              className='w-full h-full py-1 pl-3 pr-10 bg-gray-100 outline-none rounded-2xl'
              ref={searchRef}
              onChange={(e) => { setSearchText(e.target.value) }}
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
      }
      <div
        id="table-container"
        className="relative flex w-full h-full bg-gray-200 ">
        <div className="w-full">
          <table className="w-full bg-white customTable">
            <thead className='text-center'>
              <tr className="h-8">
                {columns.map((column, index) => (
                  <th className="sticky top-0 z-10 pl-2 pr-8 bg-white text-teal-800/80 hover-modal whitespace-nowrap" key={index}>
                    {column.label}
                    <div className="absolute top-0 right-0 w-8 h-8 p-1">
                      <button
                        type="button"
                        onClick={() => { setSortParams(prev => ({ atr: column.atr, ord: (prev.atr === column.atr ? (prev.ord + 1) % 3 : 1) })) }}
                        className={((sortParams.atr === column.atr && sortParams.ord !== 0) ? "" : "elmt ") + "h-full w-full flex items-center justify-center"} >
                        {
                          sortParams.atr === column.atr ?
                            (sortParams.ord === 1 ?
                              <ICONS.Down size="18px" /> :
                              (sortParams.ord === 2 ?
                                <ICONS.Up size="18px" /> :
                                <ICONS.Filter size="18px" />
                              )
                            ) :
                            <ICONS.Filter size="18px" />
                        }
                      </button>
                    </div>
                  </th>
                ))}
                <th>-</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(searchText.toLowerCase())))
                .sort((a, b) => {
                  if (sortParams.ord === 1) return a[sortParams.atr] > b[sortParams.atr] ? 1 : -1
                  if (sortParams.ord === 2) return a[sortParams.atr] < b[sortParams.atr] ? 1 : -1
                })
                .map((row, i) => (
                  <Empty key={"R" + i}>
                    <tr
                      onClick={handleMainRowClick(row[unique])}
                      className={`group h-8 duration-200 cursor-pointer active:opacity-70 active:duration-0
                    ${focusRow === row[unique] ? 'bg-slate-200/50  ' : 'hover:bg-gray-100/80'} `}>
                      {/*<td className="sticky px-2">
                        <input
                        readOnly checked={row?.isSelected | false} className="pointer-events-none" type="checkbox" />
                      </td>*/}
                      {columns.map((column, j) => (
                        <td key={j}>
                          {column.Component ?
                            <column.Component data={row[column.atr]} /> :
                            <p className="flex items-center px-2">
                              {row[column.atr]}
                            </p>
                          }
                        </td>
                      ))}
                      {/* Control arrow */}
                      <td className={`duration-150 ${row[unique] !== focusRow ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                        <div className="total-center">
                          {focusRow === row[unique] ? <ICONS.Up size="18px" /> : <ICONS.Down size="18px" />}
                        </div>
                      </td>
                    </tr>
                    {
                      focusRow === row[unique] &&
                      <tr>
                        <td colSpan={columns.length + 1} className="px-2 bg-white">
                          <div ref={subTableRef} className="w-full shadow-md h-60">
                            <AbsScroll vertical horizontal>
                              <Table
                                data={row[subRowsRef]}
                                columns={subRowsColumns}
                                unique={subRowsUnique}
                                search="off"
                                handleRowClick={handleSubRowClick}

                                footers={row.footers}
                              />
                            </AbsScroll>
                          </div>
                        </td>
                      </tr>
                    }
                  </Empty>
                ))}
            </tbody>
            <tfoot className="sticky bottom-0 ">
              <tr className="h-8 bg-white ring-2 ring-slate-200">
                {columns.map((column, index) => <td key={`TF_${index}`} className="font-semibold">
                  {column.foot && (
                    column.Component ?
                      <column.Component
                        data={footers[column.atr]}
                      />
                      :
                      footers[column.atr] && footers[column.atr]
                  )}
                </td>)
                }
                <td><p className="total-center text-teal-700/80">-</p></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GroupTable