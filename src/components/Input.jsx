
const Input = ({ label, type, name, value = "", onChange, Icon = null, onBlur, errores, onKeyDown, ...props }) => {

    let p = Icon !== null ? ' pl-9' : ''
    let cn_good = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700 h-10" + p;
    let cn_bad = "flex w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700 h-10" + p;


    let dis = props.disabled
    let labelColor = dis ? 'text-gray-800' : 'text-teal-700'
    let opacity = dis ? 'opacity-50' : ''
    let readOnly = props.readOnly ? 'bg-white border-0' : ''

    return (
        <div className={'flex flex-col w-full mx-2 mt-2' + opacity}>
            <p className={'font-medium text-sm ' + labelColor}>{label}</p>
            <div className="total-center relative">
                <input
                    onKeyDown={ onKeyDown}
                    type={type}
                    name={name}
                    value={!dis ? (value != null ? value : '') : ''}
                    onChange={onChange}
                    className={( errores ? cn_bad : cn_good) + ' ' + readOnly  }
                    onBlur={onBlur}
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
export default Input