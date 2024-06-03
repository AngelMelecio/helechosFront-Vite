import { useEffect, useRef, useState } from "react"
import Loader from './Loader/Loader'
import { ICONS } from '../constants/icons'
import Btton from './Buttons/Btton'

const Modal = ({ onClose, component }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (component!==null) setLoading(false)
    }, [component])

    return (
        <div className='absolute z-10 w-full h-screen total-center grayTrans'>
            <div className='relative flex flex-col w-full h-full mt-20 bg-white shadow-lg sm:w-2/3 sm:mt-0 sm:h-4/5 rounded-xl modal-box'>
                <div className='flex flex-row justify-end p-3'>
                    <Btton
                        neutral
                        className='absolute p-1.5 rounded-full shadow-lg w-9 h-9 bg-slate-200'
                        onClick={onClose}
                    >
                        <ICONS.Cancel className='' size='26px' />
                    </Btton>
                </div>
                <div className="w-full h-full">
                    {
                        loading ?
                            <div className="relative flex flex-col justify-center w-full h-full total-center">
                                <Loader />
                            </div>
                            :
                            component
                    }
                </div>
            </div>
        </div>
    )
}

export default Modal