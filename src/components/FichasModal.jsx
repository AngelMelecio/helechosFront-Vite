import { ICONS } from "../constants/icons"

const FichasModal = (props) => {

  return (
    <div className="w-full h-full grayTrans total-center">
      <div className='h-30 w-2/6 rounded-lg bg-white shadow-lg flex flex-col p-4 text-gray-800 modal-box'>
        <div className="total-center">
          <ICONS.Alert size='45px' style={{ color: '#fde047' }} />
        </div>
        <div className='total-center'>
          <div>
            <p className='text-xl py-1 text-center'>
              ¿Estás Seguro?
            </p>
            <p className='text-gray-600'>
              {props.message}
            </p>
          </div>
        </div>

        <div className='flex mt-2 text-white font-bold px-5 py-2'>
          <button
            onClick={props.onCancel}
            className='neutral-button w-full py-1 mr-2'>
            {props.cancelText}
          </button>
          <button
            onClick={props.onDelete}
            className='bg-rose-500 w-full py-1 ml-2 rose-opacity'>
            {props.deleteText}
          </button>
        </div>
      </div>
    </div>
  )
}
export default FichasModal