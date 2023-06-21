import { useEffect, useRef, useState } from "react"
import { sleep } from "../constants/functions"
import { ICONS } from "../constants/icons"

const Slider = ({
  columns, list, unique, onPass,
  right
}) => {

  /***   Slider Controls  ***/
  const [leftShow, setLeftShow] = useState(false)
  const leftRef = useRef(null)

  const openSlider = async () => {
    setLeftShow(prev => !prev)
    await sleep(120)
    leftRef.current.classList.toggle('visible')
  }

  const closeSlider = async () => {
    leftRef.current.classList.toggle('visible')
    await sleep(250)
    setLeftShow(prev => !prev)

    //unSelectAll()
    //setSearch("")
  }


  /***   Table Controls  ***/
  const [data, setData] = useState([])

  useEffect(() => { console.log('llega:', list); setData(list) }, [list])

  const searchRef = useRef(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState({ atr: unique, ord: 1 })

  const unSelectAll = () => { setData(data.map(d => ({ ...d, isSelected: false }))) }

  const handleCheck = (id) => {
    let i = data.findIndex(e => e[unique] === id)
    let c = [...data]
    c[i].isSelected = !c[i].isSelected
    setData(c)
  }
  const handleCheckAll = (e) => {
    let v = e.target.checked
    setData(prev => prev.map(e => ({ ...e, isSelected: v })))
  }

  let someSelected = data.some(d => d.isSelected)
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex absolute">

        {/*  Left Side  */}
        <div className={(leftShow ? "w-full " : "w-10 ") + " bg-gray-50 pt-1 h-full flex duration-500"}>
          <div className={"flex h-full w-full relative "}>

            {/*  Search & Table  */}
            <div ref={leftRef} className="h-full w-full modal">
              {leftShow && <div className=" h-full flex flex-col">

                {/*  Slide Header  */}
                <div className="h-10 w-full mb-2 pt-1 flex px-10 flex-row ">

                  {/*  Search Bar  */}
                  <div className="flex-grow flex items-center h-full bg-white shadow-sm relative rounded-full">
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={e => { setSearch(e.target.value); unSelectAll() }}
                      className="w-full h-full pl-2 pr-10 outline-none absolute bg-transparent" type="text" />
                    <button
                      type="button"
                      onClick={() => search.length > 0 ? setSearch("") : searchRef?.current?.focus()}
                      className="absolute total-center h-6 w-6 neutral-button right-2 rounded-full">
                      {search.length > 0 ? <ICONS.Cancel /> : <ICONS.Lupa />}
                    </button>
                  </div>

                  {/*  Pass Button  */}
                  <div className="absolute w-10 h-10 p-1 top-0 right-0">
                    <button
                      disabled={!someSelected}
                      onClick={() => { onPass(data.filter(d => d.isSelected).map(d => d[unique])); closeSlider() }}
                      type="button"
                      className={"normal-button shadow-sm w-8 h-8 rounded-md total-center"}>
                      {<ICONS.Right />}
                    </button>
                  </div>

                </div>

                {/*  TABLE  */}
                <div className="w-full h-full relative overflow-scroll bg-white shadow-md">
                  {data.length > 0 && <table className="absolute w-full bg-white">
                    <thead><tr className="h-8 shadow-sm">
                      <th className="px-2 sticky top-0 z-10 bg-white">
                        <input onChange={handleCheckAll} checked={someSelected} type="checkbox" /></th>

                      {columns.map((column, index) => (
                        <th className="hover-modal text-teal-800 pl-2 pr-8 whitespace-nowrap sticky top-0 z-10 bg-white" key={index}>
                          {column.name}
                          <div className="absolute p-1 right-0 w-8 h-8 top-0">
                            <button type="button" onClick={() => { setFilter(prev => ({ atr: column.atr, ord: (prev.atr === column.atr ? (prev.ord + 1) % 3 : 1) })) }}
                              className={((filter.atr === column.atr && filter.ord !== 0) ? "" : "elmt ") + "h-full w-full flex items-center justify-center"} >
                              {filter.atr === column.atr ? (filter.ord === 1 ? <ICONS.Down /> : (filter.ord === 2 ? <ICONS.Up /> : <ICONS.Filter />)) : <ICONS.Filter />}
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {data.filter(d => Object.keys(d).some(k => d[k]?.toString().toLowerCase().includes(search.toLowerCase())))
                        .sort((a, b) => {
                          if (filter.ord === 1) return a[filter.atr] > b[filter.atr] ? 1 : -1
                          if (filter.ord === 2) return a[filter.atr] < b[filter.atr] ? 1 : -1
                        })
                        .map((row, i) => (
                          <tr
                            onClick={() => handleCheck(row[unique])}
                            className="cursor-pointer h-8 duration-200 hover:bg-gray-100"
                            key={"R" + i}>
                            <td className="px-2 sticky">
                              <input readOnly checked={row?.isSelected | false} className="pointer-events-none" type="checkbox" />
                            </td>
                            {columns.map((column, j) => (
                              <td className="px-2 whitespace-nowrap" key={j}>{row[column.atr]}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>}
                </div>
              </div>}
            </div>

            {/*  Pass Button  */}
            <div className="absolute w-10 h-10 p-1 top-0 left-0">
              <button
                type="button"
                onClick={leftShow ? closeSlider : openSlider}
                className={(leftShow ? "neutral-button " : "normal-button ") + " total-center shadow-sm rounded-md w-full h-full"}>
                {leftShow ? <ICONS.Left /> : <ICONS.Plus />}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-full relative bg-gray-50">
          {right}
        </div>
      </div>
    </div>
  )
}
export default Slider