import { ICONS } from '../constants/icons'


const DeleteModal = ({ onCancel, onConfirm, elements, representation, message }) => {

  return (
    <div id="delete-modal" className='z-10 total-center absolute h-screen w-full grayTrans modal'>
      <div className='h-30 w-90 rounded-lg bg-white shadow-lg flex flex-col p-4 text-gray-800 modal-box'>
        <div className="total-center">
          <ICONS.Alert size='45px' style={{ color: '#fde047' }} />
        </div>
        <div className='total-center'>
          <div>
            <p className='text-xl py-1 text-center'>
              ¿Estas seguro?
            </p>
            <p className='text-gray-600'>
              {message}
            </p>
          </div>
        </div>
        <div className='h-20 overflow-y-scroll bg-slate-100 mt-2 p-2' >
          {elements?.map((elmt, indx) => {
            if (elmt.isSelected) {
              let str = ""
              representation.map((atr, j) =>
                str += elmt[atr] + " ")
              
              return (
                <div key={indx}>
                  <p> {str} </p>
                </div>
              )
            }
          })}
        </div>
        <div className='flex mt-2 text-white font-bold px-5 py-2'>
          <button
            onClick={onCancel}
            className='neutral-button w-full py-1 mr-2 normalButton'>
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(elements)}
            className='bg-rose-500 w-full py-1 ml-2 rose-opacity'>
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal