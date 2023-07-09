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
    <div className=" w-full h-full absolute overflow-scroll ">
      <table
        className="table-auto w-full border-collapse:collapse ">
        <thead className='text-center'>
          <tr>
            {
              columns.map((c, i) =>
                <th
                  className="px-2 text-teal-700 whitespace-nowrap"
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
              <tr key={"E" + i} className="h-8 border-b-2" >
                {
                  columns.map((c, j) => <td key={'MD' + j}>
                    {m[c.atr]}
                  </td>)
                }
                <td className="total-center flex w-8 h-8 duration-150 text-gray-700 hover:bg-rose-400 hover:text-white  rounded-lg">
                  <button
                    onClick={() => onUnassing(i)}
                    type="button"
                    className="h-full w-full total-center">
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