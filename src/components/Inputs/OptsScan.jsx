import React, { useEffect, useRef, useState } from 'react'
import AbsScroll from '../AbsScroll'
import { ICONS } from '../../constants/icons'
import Btton from '../Buttons/Btton'
import { useAuth } from '../../context/AuthContext'

const OptsScan = ({
    label,
    name,
    options,
    value = null,
    Icon = null,
    formik,
    fieldChange,
    space = null,
    unique,
    ...props
}) => {

    const { notify } = useAuth()

    const inptRef = useRef(null)
    const scanRef = useRef(null)

    const [scaning, setScaning] = useState(null)
    const [search, setSearch] = useState('')
    const [filteredOpts, setFilteredOpts] = useState([])
    const [showOpts, setShowOpts] = useState(false)

    useEffect(() => {
        setFilteredOpts([...options])
    }, [options])

    const handleOptClick = (e, option) => {
        inptRef.current.blur()
        formik?.setFieldValue(name, option.value)
        fieldChange && fieldChange(true)
    }

    const handleBlur = (e) => {
        setShowOpts(false);
        setSearch('')
        setFilteredOpts([...options])
        formik.handleBlur(e)
    }

    const handleInptChange = (e) => {
        let val = e.target.value
        setSearch(val)
        setFilteredOpts(
            options.filter(option =>
                option.label.toLowerCase().includes(val.toLowerCase())
            )
        )
    }
    const openScan = () => {
        setScaning(true)
        scanRef.current.focus()
    }
    const onScanRead = (e) => {
        if (e.key === "Enter") {
            try {
                let objScan = {}
                try {
                    objScan = JSON.parse(e.target.value)
                } catch (e) {
                    throw new Error('Error al leer el código QR')
                }
                if (!objScan[unique])
                    throw new Error('Código QR inválido')
                if (!options.some(e => e.value === objScan[unique]))
                    throw new Error('No se encontró')

                formik.setFieldValue(name, objScan[unique])
            } catch (e) {
                notify(e + "", true)
            } finally {
                e.target.value = ""
                e.target.blur()
            }
        }
    }

    let err = formik?.errors[name] && formik?.touched[name] ? formik?.errors[name] : null
    let defaultStyles = 'focus:border-teal-500 hover:border-teal-500 focus:ring-2 focus:ring-teal-200'

    let val = value || formik?.values[name]
    let valueDisplay = options.find(option => option.value === val)?.label
    let NULL = val === null || val === undefined

    return (
        <div className={`relative flex flex-col w-full ${props.disabled ? 'opacity-60' : ''}`}>
            <p className={`font-medium text-sm pb-0.5 ${props.disabled ? 'text-gray-800/85' : 'text-teal-800/80'}`}>
                {label}
            </p>
            <div className="relative gap-4 total-center">
                <div className='relative flex-grow'>
                    <input
                        ref={inptRef}
                        name={name}
                        readOnly={!NULL ? true : false}
                        autoComplete='off'
                        value={valueDisplay || search}
                        onChange={handleInptChange}
                        onBlur={handleBlur}
                        onFocus={() => setShowOpts(true)}
                        className={`flex w-full py-2 px-4 outline-none duration-150 border text-gray-800 h-10 font-semibold rounded-md cursor-pointer
                        ${props.readOnly ? 'bg-gray-100 border-gray-300 cursor-default hover:ring-2 hover:ring-gray-200' :
                                err ? 'border-rose-400 ring-2 ring-rose-200 bg-slate-100' :
                                    formik?.touched[name] ? 'bg-slate-100 border-slate-300 ' + defaultStyles :
                                        'border-gray-300 bg-gray-100 ' + defaultStyles}
                                        ${Icon !== null ? 'pl-9' : ''} `}
                        {...props}
                    />
                    {Icon !== null ?
                        <Icon
                            className='absolute text-gray-600 left-2'
                            size='20px'
                        /> : null}
                    {!NULL ?
                        <button type="button"
                            onClick={() => formik?.setFieldValue(name, null)}
                            className='absolute w-8 h-8 text-gray-600 -translate-y-1/2 rounded-md right-1.5 hover:bg-slate-200 total-center top-1/2'>
                            <ICONS.Cancel size="18px" />
                        </button>
                        :
                        <button
                            type="button"
                            onClick={(e) => inptRef.current.focus()}
                            className='absolute w-8 h-8 text-gray-600 -translate-y-1/2 rounded-md right-1.5 hover:bg-slate-200 total-center top-1/2'>
                            {showOpts ? <ICONS.Up size="18px" /> : <ICONS.Down size="18px" />}
                        </button>
                    }
                </div>
                <Btton
                    type="button"
                    neutral={scaning}
                    onClick={openScan}
                    className={(scaning ? " scan-icon pointer-events-none" : "") + " relative w-10 h-10 total-center "}>
                    <ICONS.Qr size="28px" />
                </Btton>
                <input
                    ref={scanRef}
                    name={name}
                    onBlur={() => setScaning(null)}
                    type="text"
                    className="absolute flex w-0"
                    onKeyDown={onScanRead}
                />

                {
                    showOpts &&
                    <ul
                        style={{ height: `${inptRef.current?.clientHeight * Math.min(filteredOpts.length, 4)}px` }}
                        className={`absolute z-20 top-full  w-full mt-1 bg-white border border-gray-200 divide-y divide-gray-100 max-h-40 rounded-md shadow-md`}>
                        <AbsScroll vertical >
                            {filteredOpts.map((option, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 duration-200 cursor-pointer hover:bg-gray-200"
                                    onMouseDown={(e) => handleOptClick(e, option)}>
                                    {option.label}
                                </li>
                            ))}
                        </AbsScroll>
                    </ul>
                }
            </div>
            <div className={`${space ? 'h-36' : 'h-8'}`}>
                {err ? <div className='text-sm italic text-rose-400'>
                    {err}
                </div> : null}
            </div>
        </div>
    )
}

export default OptsScan