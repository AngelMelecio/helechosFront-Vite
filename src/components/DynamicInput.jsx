import { ICONS } from "../constants/icons"
import Th from "./Th"

const DynamicInput = ({
  arrayName,
  columns,
  elements,
  setElements,
  handleFocus,
  handleDeleteRow,
}) => {
  return (
    <table >
      <thead >
        <tr className="font-medium text-teal-800">
          {
            columns.map((c, i) =>
              <th key={'H' + i}>
                {c.name}
              </th>)
          }
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          elements.map((e, i) =>
            <tr key={'R' + i} className="array-row border border-transparent relative hover:bg-slate-200 duration-200">
              {
                columns.map((c, j) =>
                  <td key={'C' + j}>
                    <input
                      className="flex w-full p-1 outline-none  duration-300 border focus:border-teal-500"
                      onFocus={() => handleFocus(i, arrayName)}
                      type="text"
                      value={e[c.atr]}
                      name={c.atr}
                      onChange={(ev) => {
                        setElements(ev, i, arrayName)
                      }}
                    />
                  </td>)
              }
              <td>
                <button
                  onClick={() => handleDeleteRow(i, arrayName)}
                  type="button"
                  className="p-1 opacity-0 trash-button rounded-md">
                  <ICONS.Trash />
                </button>
              </td>
            </tr>)
        }
      </tbody>
    </table>
  )
}
export default DynamicInput