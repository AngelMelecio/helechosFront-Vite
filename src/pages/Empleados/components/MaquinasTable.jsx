import { ICONS } from "../../../constants/icons"

const columns = [
  { name: "Numero", atr: 'numero' },
  { name: "Linea", atr: 'linea' },
  { name: "Marca", atr: 'marca' },
  { name: "No. serie", atr: 'ns' },
  { name: "Fecha de Adquisicion", atr: 'fechaAdquisicion' },
  { name: "Otros", atr: 'otros' },
  { name: "Departamento", atr: 'departamento' },
]

const MaquinasTable = ({
  maquinas,
  onUnassing
}) => {
  return (
    <div className="absolute w-full h-full px-3 overflow-scroll ">
      <table
        className="w-full table-auto border-collapse:collapse ">
        <thead className='text-center'>
          <tr>
            {
              columns.map((c, i) =>
                <th
                  className="px-2 text-sm font-semibold text-teal-800/80 whitespace-nowrap"
                  key={'MH' + i}>
                  {c.name}
                </th>)
            }
            <th>

            </th>
          </tr>
        </thead>
        <tbody>
          {
            maquinas.map((m, i) =>
              <tr key={"E" + i} className="h-10 font-semibold text-center text-gray-700 border-b-2" >
                {
                  columns.map((c, j) => <td key={'MD' + j}>
                    {m[c.atr]}
                  </td>)
                }
                <td className="sticky right-0 ">
                  <button
                    onClick={() => onUnassing(i)}
                    type="button"
                    className="flex w-8 h-8 text-gray-700 duration-150 bg-gray-200 rounded-lg total-center active:bg-rose-500 active:duration-0 active:text-white hover:bg-rose-400 hover:text-white">
                    <ICONS.Trash size='16px' />
                  </button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default MaquinasTable