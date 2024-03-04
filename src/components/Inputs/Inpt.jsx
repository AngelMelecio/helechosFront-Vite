import React from 'react'

const Inpt = ({
  label,
  name,
  Icon = null,
  formik,
  ...props
}) => {

  let err = formik?.errors[name] && formik?.touched[name] ? formik?.errors[name] : null
  let defaultStyles = 'focus:border-teal-500 hover:border-teal-500 focus:ring-2 focus:ring-teal-200'

  return (
    <div className={`flex flex-col w-full ${props.disabled ? 'opacity-60' : ''}`}>
      <p className={`font-medium text-sm pb-0.5 ${props.disabled ? 'text-gray-800/85' : 'text-teal-800/80'}`}>
        {label}
      </p>
      <div className="relative total-center">
        <input
          name={name}
          value={formik?.values[name] || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`flex w-full py-2 px-4 outline-none duration-150 border text-gray-800 h-10 font-semibold rounded-md
              ${props.readOnly ? 'bg-gray-100 border-gray-300 cursor-default hover:ring-2 hover:ring-gray-200' :
              err ? 'border-rose-400 ring-2 ring-rose-200 bg-slate-100' :
                formik?.touched[name] ? 'bg-slate-100 border-slate-300 ' + defaultStyles :
                  'border-gray-300 bg-gray-100 ' + defaultStyles}
              
              ${Icon !== null ? 'pl-9' : ''}
          `}
          onWheel={(e) => e.target.blur()}
          {...props}
        />
        {Icon !== null ?
          <Icon
            className='absolute text-gray-600 left-2'
            size='20px'
          /> : null}
      </div>
      <div className="h-8">
        {err ? <div className='text-sm italic text-rose-400'>
          {err}
        </div> : null}
      </div>
    </div>
  )
}

export default Inpt