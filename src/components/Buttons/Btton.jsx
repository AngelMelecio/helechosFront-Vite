import React from 'react'

const Btton = ({ children, onClick, className, neutral, trash, ...props }) => {
    return (
        <button
            className={`
            rounded-md font-semibold text-gray-500 duration-150 shadow-md
            ${props.disabled ? 'bg-gray-100 opacity-60' : 
            neutral ? 'bg-gray-100 text-gray-700 hover:bg-slate-200 active:opacity-75 active:duration-0' :
            trash ? 'bg-rose-500 text-white hover:bg-rose-600/80 hover:shadow-rose-400/50 active:opacity-75 active:duration-0' :
            'cursor-pointer bg-teal-500 text-white hover:bg-teal-600/80  hover:shadow-teal-400/50 active:opacity-75 active:duration-0 '} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default Btton