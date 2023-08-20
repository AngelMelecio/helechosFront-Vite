
const Textarea = ({ label, type, name, value = "", Icon = null, onBlur, errores, onKeyDown, resize, ...props }) => {

    let p = Icon !== null ? ' pl-9' : ''
    let cn_good = " w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700 " + p;
    let cn_bad = " w-full p-1 outline-none bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700 " + p;


    let dis = props.disabled
    let labelColor = dis ? 'text-gray-800' : 'text-teal-700'
    let opacity = dis ? 'opacity-50' : ''
    let readOnly = props.readOnly ? 'bg-white border-0' : ''

    return (
        <div className={'flex flex-col w-full mx-2 mt-2' + opacity}>
            <p className={'font-medium text-sm ' + labelColor}>{label}</p>
            <div className="total-center relative">
                <textarea
                    value={!dis ? (value != null ? value : '') : ''}
                    className={(errores ? cn_bad : cn_good) + ' ' + readOnly + (resize && " resize-none")}
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