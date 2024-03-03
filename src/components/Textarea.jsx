
const Textarea = ({
    label,
    type,
    name,
    formik,
    value = "",
    Icon = null,
    onBlur,
    errores,
    onKeyDown,
    resize,
    ...props }) => {

    let p = Icon !== null ? ' pl-9' : ''
    let cn_good = " w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700 " + p;
    let cn_bad = " w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700 " + p;


    let dis = props.disabled
    let labelColor = dis ? 'text-gray-800' : 'text-teal-800/80'
    let opacity = dis ? 'opacity-50' : ''
    let readOnly = props.readOnly ? 'bg-white border-0' : ''

    let err = formik?.errors[name] && formik?.touched[name] ? formik?.errors[name] : null
    let defaultStyles = 'focus:border-teal-500 hover:border-teal-500 focus:ring-2 focus:ring-teal-200'

    return (
        <div className={'flex flex-col w-full  mt-2' + opacity}>
            <p className={`font-medium text-sm pb-0.5 ${props.disabled ? 'text-gray-800/85' : 'text-teal-800/80'}`}>
                {label}
            </p>
            <div className="relative total-center">
                <textarea
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`flex w-full py-2 px-4 outline-none duration-150 border text-gray-800  font-semibold rounded-md
                    ${resize ? '' : 'resize-none'}
                    ${props.readOnly ? 'bg-gray-100 border-gray-300 cursor-default hover:ring-2 hover:ring-gray-200' :
                            err ? 'border-rose-400 ring-2 ring-rose-200 bg-slate-100' :
                                formik?.touched[name] ? 'bg-slate-100 border-slate-300 ' + defaultStyles :
                                    'border-gray-300 bg-gray-100 ' + defaultStyles}
                                    ${Icon !== null ? 'pl-9' : ''}
                    `}
                    {...props}
                />
                {Icon !== null ?
                    <Icon
                        className='absolute left-2'
                        style={{ color: '#374151' }}
                        size='20px'
                    /> : null}
            </div>
            {errores ? <div className='text-rose-500'>{errores}</div> : null}
        </div>
    )
}
export default Textarea