import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"

const columns = [
  { name: "Numero" },
  { name: "Linea" },
  { name: "Marca" },
  { name: "No. serie" },
  { name: "Fecha de Adquisicion" },
  { name: "Otros" },
  { name: "Departamento" }
]

const MaquinasTable = ({ list, setList, onSomeSelected }) => {

  const tableRef = useRef()

  const [someSelected, setSomeSelected] = useState(false)

  useEffect(() => {
    let sel = isSelected()
    setSomeSelected(sel)
    onSomeSelected(!sel)
  }, [ list ])

  const handleChange = (e) => {
    setList(prev => prev.map((m, i) => (
      Number(e.target.value) === i ?
        { ...m, isChecked: e.target.checked } :
        { ...m }
    )))
  }

  const isSelected = () => {
    let inps = tableRef.current.querySelectorAll('.checkbox')
    let sel = false;
    inps.forEach(inp => {
      if (inp.checked) sel = true
    })
    return sel
  }

  const unSelectAll = () => {
    setList(prev => prev.map(m => ({
      ...m, isChecked: false
    })))
  }

  const CustomRow = ({ element, indx }) => {
    const { numero, linea, marca, ns, fechaAdquisicion, otros, departamento, isChecked } = element
    return (
      <>
        <td className='px-1'>
          <input
            value={indx}
            onChange={handleChange}
            className='checkbox'
            type="checkbox"
            checked={isChecked}
          />
        </td>
        <td className='m-2'>
          {numero}
        </td>
        <td className='m-2'>
          {linea}
        </td>
        <td className='m-2'>
          {marca}
        </td>
        <td className='m-2'>
          {ns}
        </td>
        <td className='m-2'>
          {fechaAdquisicion}
        </td>
        <td className='m-2'>
          {otros}
        </td>
        <td className='m-2'>
          {departamento}
        </td>
      </>
    )
  }

  return (
    <div className=" w-full h-full absolute overflow-scroll customTable">
      <table ref={tableRef} className="table-auto  border-collapse:collapse ">
        <thead className='text-center'>
          <tr>
            <th>
              <div className='px-1'>
                <input
                  onChange={unSelectAll}
                  type="checkbox"
                  checked={someSelected}
                  disabled={!someSelected}
                />
              </div>
            </th>
            
          </tr>
        </thead>
        <tbody>
          {
            list.map((m, i) =>
              <tr key={"E" + i}  >
                <CustomRow
                  element={m}
                  indx={i}
                />
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}
export default MaquinasTable