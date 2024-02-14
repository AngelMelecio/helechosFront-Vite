import React from 'react'
import { ICONS } from '../constants/icons'

const Modal = ({ onClose, component }) => {
    return (
        <div className='absolute z-10 w-full h-screen total-center grayTrans'>
            <div className='relative flex flex-col w-full h-full mt-20 bg-white shadow-lg sm:w-2/3 sm:mt-0 sm:h-4/5 rounded-xl modal-box'>
                <div className='flex flex-row justify-center '>
                    <button
                        className='absolute w-8 h-8 p-1 text-white rounded-lg left-2 top-2 neutral-button'
                        onClick={onClose}
                    >
                        <ICONS.Cancel className='m-0' size='25px' />
                    </button>
                </div>
                <div className="w-full h-full">
                    {component}
                </div>
            </div>
        </div>
    )
}

export default Modal