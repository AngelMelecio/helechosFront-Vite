import { ICONS } from "../constants/icons"
import Btton from "./Buttons/Btton"

const FichasModal = (props) => {

  return (
    <div className="w-full h-full grayTrans total-center">
      <div className='flex flex-col w-2/6 p-4 text-gray-800 bg-white rounded-lg shadow-lg h-30 modal-box'>
        <div className="total-center">
          <ICONS.Alert size='45px' style={{ color: '#fde047' }} />
        </div>
        <div className='total-center'>
          <div>
            <p className='py-1 text-xl text-center'>
              ¿Estás Seguro?
            </p>
            <p className='text-gray-600'>
              {props.message}
            </p>
          </div>
        </div>

        <div className='flex px-5 py-2 mt-2 font-bold text-white'>
          <Btton
            neutral
            onClick={props.onCancel}
            className='w-full py-1 mr-2'>
            {props.cancelText}
          </Btton>
          <Btton
            trash
            onClick={props.onDelete}
            className='w-full py-1 ml-2 trash'>
            {props.deleteText}
          </Btton>
        </div>
      </div>
    </div>
  )
}
export default FichasModal