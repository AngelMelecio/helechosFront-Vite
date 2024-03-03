import { ICONS } from '../constants/icons'
import Btton from './Buttons/Btton'


const DeleteModal = ({
  onCancel,
  onConfirm,
  elements,
  representation,
  message

}) => {
  return (
    <div id="delete-modal" className='absolute z-10 w-full h-screen total-center grayTrans'>
      <div className='flex flex-col p-4 text-gray-800 bg-white rounded-lg shadow-lg h-30 w-90 modal-box'>
        <div className="total-center">
          <ICONS.Alert size='45px' style={{ color: '#fde047' }} />
        </div>
        <div className='total-center'>
          <div>
            <p className='py-1 text-xl text-center'>
              ¿Estas seguro?
            </p>
            <p className='text-gray-600'>
              {message}
            </p>
          </div>
        </div>
        <div className='h-20 p-2 mt-2 overflow-y-scroll bg-slate-100' >
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
        <div className='flex px-5 py-2 mt-2 font-bold text-white'>
          <Btton
            neutral
            onClick={onCancel}
            className='w-full py-1 mr-2 '>
            Cancelar
          </Btton>
          <Btton
            trash
            onClick={() => onConfirm(elements)}
            className='w-full py-1 ml-2 '>
            Continuar
          </Btton>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal