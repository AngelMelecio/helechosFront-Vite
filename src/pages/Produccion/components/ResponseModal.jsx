import { ICONS } from "../../../constants/icons"

const ResponseModal = ({ response, onClose }) => {
  return (
    <div className="flex grayTrans w-full h-full total-center">
      <div className='flex flex-col h-4/5 w-3/6 rounded-xl bg-white shadow-lg p-4 modal-box'>
        <div className='flex flex-row total-center relative'>
          <button
            className='normal-button total-center p-1 text-white h-8 w-8 rounded-lg absolute right-0'
            onClick={onClose}
          >
            <ICONS.Check className='m-0' size='18px' />
          </button>
          <div className="font-semibold text-xl text-teal-700">
            Resumen de la captura
          </div>
        </div>
        <div className="py-5">
          <table>
            <tbody>
              {
                [
                  { label: 'Empleado', atr: 'empleado' },
                  { label: 'Departamento', atr: 'departamento' },
                  { label: 'Fecha de captura', atr: 'fecha' },
                ].map((column, index) =>
                  <tr key={"ER" + index} className={(index ? "border-t" : "") + " h-7"}>
                    <td className="text-sm font-semibold text-teal-700 px-4"> {column.label}:</td>
                    <td className="text-base text-gray-800 w-full"> {response[column.atr]} </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
        <h3 className=" mt-2 relative h-7 border-t-2 total-center">
              <p className="absolute -top-4 bg-white font-medium px-2 text-center italic text-teal-700">
                Resultados
              </p>
        </h3>
        <div className="overflow-y-scroll h-full">
          <table className="customTable text-center">
            <thead>
              <tr>
                <th className="px-2">Modelo</th>
                <th className="px-2">Etiqueta</th>
                <th className="px-2">Resultado</th>
                <th className="px-2">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {
                response.registros.map((etiqueta, index) =>
                  <tr key={'etiqueta' + index} > {
                    ['modelo', 'numEtiqueta', 'ok', 'Detalles'].map((atr,j) => <td key={'D'+index +j}>
                      <div className="total-center">
                        {typeof etiqueta[atr] === 'boolean' ?
                          (etiqueta[atr] ?
                            <ICONS.Check size="18px" color="#14b8a6"/> :
                            <ICONS.Cancel size="18px" color="#e11d48" />)
                          :
                          etiqueta[atr]
                        }
                      </div>
                    </td>)
                  }
                  </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>)
}
export default ResponseModal