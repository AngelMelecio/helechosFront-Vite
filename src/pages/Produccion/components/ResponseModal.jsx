import { ICONS } from "../../../constants/icons"

const ResponseModal = ({ response, onClose }) => {
  return (
    <div className="flex w-full h-full grayTrans total-center">
      <div className='flex flex-col w-3/6 p-4 bg-white shadow-lg h-4/5 rounded-xl modal-box'>
        <div className='relative flex flex-row total-center'>
          <button
            className='absolute right-0 w-8 h-8 p-1 text-white rounded-lg normal-button total-center'
            onClick={onClose}
          >
            <ICONS.Check className='m-0' size='18px' />
          </button>
          <div className="text-xl font-semibold text-teal-800/80">
            Resumen de la captura
          </div>
        </div>
        <div className="py-5">
          <table>
            <tbody>
              {[
                { label: 'Empleado', atr: 'empleado' },
                { label: 'Departamento', atr: 'departamento' },
                { label: 'Fecha de captura', atr: 'fecha' },
              ].map((column, index) =>
                <tr key={"ER" + index} className={(index ? "border-t" : "") + " h-7"}>
                  <td className="px-4 text-sm font-semibold text-teal-800/80"> {column.label}:</td>
                  <td className="w-full text-base text-gray-800"> {response[column.atr]} </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <h3 className="relative mt-2 border-t-2 h-7 total-center">
          <p className="absolute px-2 italic font-medium text-center text-teal-800/80 bg-white -top-4">
            Resultados
          </p>
        </h3>
        <div className="h-full overflow-y-scroll">
          <table className="text-center customTable">
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
                  <tr key={'etiqueta' + index} >
                    {['modelo', 'numEtiqueta', 'ok', 'Detalles'].map((atr, j) => <td key={'D' + index + j}>
                      <div className="total-center">
                        {typeof etiqueta[atr] === 'boolean' ?
                          (etiqueta[atr] ?
                            <ICONS.Check size="18px" color="#14b8a6" /> :
                            <ICONS.Cancel size="18px" color="#e11d48" />)
                          :
                          <>
                            {etiqueta[atr]}
                          </>
                        }
                      </div>
                    </td>)}
                  </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>)
}
export default ResponseModal