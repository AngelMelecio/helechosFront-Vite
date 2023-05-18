import { ICONS } from "../constants/icons"
import { FieldArray } from "formik";
import React, { useState } from "react";


const DynamicInput = ({
  arrayName,
  columns,
  elements,
  handleChange,
  clearObject,
  setTheresChanges = null,
}) => {
  
  const [confirmationIndex, setConfirmationIndex] = useState(null);
  return (
    <FieldArray
      name={arrayName}
      render={(arrayHelpers) => (
        <div className="w-full">
          <table className="w-full">
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
                elements.map((element, index) => (
                  <tr key={'R' + index} className='array-row border border-transparent relative'>
                    {
                      columns.map((c, j) =>
                        <td key={'C' + j}>
                          <input
                            className="flex w-full p-1 outline-none  duration-300 border focus:border-teal-500 bg-gray-50 hover:bg-slate-200 border-gray-300 "
                            type="text"
                            value={elements[index][c.atr]}
                            name={`${arrayName}[${index}][${[c.atr]}]`}
                            onChange={(e) => {
                              setTheresChanges && setTheresChanges(true);
                              return handleChange(e)
                            }}
                          />
                        </td>)
                    }
                    <td>
                      
                      {<button
                        type="button"
                        onClick={() => {
                          if (confirmationIndex === index) {
                            setConfirmationIndex(null);
                          } else {
                            setConfirmationIndex(index);
                          }
                        }}
                        className="p-2 rounded-r-lg bg-gray-200 text-zinc-700	"
                      >
                        <ICONS.Trash />
                      </button>}

                      <div
                        className={`absolute bg-gray-100 min-w-0 shadow-lg z-10 ${confirmationIndex === index ? "block" : "hidden"}`}
                      >

                        <button
                          className="block w-full px-3 py-2 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-300"
                          onClick={(e) => {
                            e.preventDefault()
                            if (elements.length === 1) {
                              arrayHelpers.replace(index, clearObject);
                            } else {
                              arrayHelpers.remove(index);
                            }
                            setConfirmationIndex(null);
                            setTheresChanges(true);
                          }}
                        >
                          <ICONS.Done />
                        </button>
                        <button
                          className="block w-full px-3 py-2 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-300"
                          onClick={(e) => {
                            e.preventDefault()
                            if (confirmationIndex === index) {
                              setConfirmationIndex(null);
                            } else {
                              setConfirmationIndex(index);
                            }
                          }}
                        >
                          <ICONS.Cancel />
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-end py-1">
            <button
              type="button"
              onClick={() => arrayHelpers.push(clearObject)}
              className='bg-teal-500 text-white w-8 h-8 total-center normal-button rounded-lg'>
              <ICONS.Plus size='16px' />
            </button>
          </div>

        </div>
      )}
    />
  )
}
export default DynamicInput