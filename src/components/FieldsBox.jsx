import React from 'react'

const FieldsBox = ({ title, children, vertical = false, className }) => {
    return (
        <>
            <div className='relative w-full m-4 border rounded-md border-slate-300'>
                <div className="absolute z-10 -translate-x-1/2 -top-3 left-1/2">
                    <div className='px-3 text-base italic font-medium bg-white rounded-md text-teal-800/80' >
                        {title}
                    </div>
                </div>
                <div className={`px-8 py-6  ${className} ${vertical ? 'overflow-y-scroll' : ''}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default FieldsBox