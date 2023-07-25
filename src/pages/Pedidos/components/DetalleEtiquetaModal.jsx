import { ICONS } from "../../../constants/icons"

const DetalleEtiquetaModal = ({ onClose, etiqueta }) => {
  return (
    <div className='total-center h-screen w-full grayTrans absolute'>
      <div className='flex flex-col h-4/5 w-3/6 rounded-xl bg-white shadow-lg p-4 modal-box'>
        <div className='flex flex-row total-center w-full relative'>
          <button
            className='neutral-button p-1 text-white rounded-lg absolute left-0 top-0'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='25px' />
          </button>
          <div className="font-semibold text-3xl text-teal-700 ">
            Detalles de la etiqueta
          </div>
        </div>
        <div>
          {JSON.stringify(etiqueta)}
        </div>
      </div>
    </div>

  )
}
export default DetalleEtiquetaModal