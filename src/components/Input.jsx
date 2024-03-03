
const Input = ({
    label,
    type,
    name,
    value = "",
    onChange,
    Icon = null,
    onBlur,
    errores,
    showErrors = true,
    onKeyDown,
    ...props
}) => {

    let p = Icon !== null ? ' pl-9' : ''
    let cn_good = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700 h-10" + p;
    let cn_bad = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700 h-10" + p;


    let dis = props.disabled
    let labelColor = dis ? 'text-gray-800/85' : 'text-teal-800/80'
    let opacity = dis ? 'opacity-50' : ''
    let readOnly = props.readOnly ? 'bg-white border-0' : ''

    return (
        <div className={'flex flex-col w-full' + opacity}>
            <p className={'font-medium text-sm pb-0.5 ' + labelColor}>{label}</p>
            <div className="relative total-center">
                <input
                    onKeyDown={onKeyDown}
                    type={type}
                    name={name}
                    value={!dis ? (value != null ? value : '') : ''}
                    onChange={onChange}
                    className={`
                        flex w-full py-2 px-4 outline-none duration-150 border  text-gray-800 h-10 font-semibold rounded-md
                        ${props.touched ? 'bg-slate-100' : 'bg-gray-100'}
                        ${errores ? 'border-rose-400 ring-2 ring-rose-200'
                            :
                            props.readOnly ? 'bg-gray-100 border-gray-300 cursor-default'
                                :
                                'border-gray-300 focus:border-teal-500 hover:border-teal-500 focus:ring-2 ring-teal-200'
                        }
                    ${Icon !== null ? 'pl-9' : ''}
                    `}
                    onBlur={onBlur}
                    {...props}
                />
                {Icon !== null ?
                    <Icon
                        className='absolute text-gray-600 left-2'
                        size='20px'
                    /> : null}
            </div>
            {
                showErrors &&
                <div className="h-8">
                    {errores ? <div className='text-sm italic text-rose-400'>{errores}</div> : null}
                </div>
            }
        </div>
    )
}
export default Input