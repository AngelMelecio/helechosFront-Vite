import React, { useRef, useState } from 'react'
import Select from 'react-select';
import { ICONS } from '../constants/icons';
import { useAuth } from '../context/AuthContext';
const ScanSelect = ({
    options,
    formik,
    label,
    name,
    unique,
    loading,
    ...props
}) => {

    const { notify } = useAuth()
    const [scaning, setScaning] = useState(null)
    const scanRef = useRef(null)

    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : "";
    };

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

    let cn_good = props.className + " center relative" + "bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700";
    let cn_bad = props.className + " center relative" + "bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700";
    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? "#fff" : "#000",
            backgroundColor: state.isSelected ? "#e5e7eb" : "#fff",
            select: "#14B8A6"
        }),

        control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: props.readOnly ? "#fff" : "#F3F4F6",
            border: props.readOnly ? "#fff" : "#14B8A6",
            boxShadow: "#14B8A6",
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#374151" }),
    };

    return (
        <div className={`flex flex-col w-full mt-2`}>
            <p className='text-sm font-medium text-teal-700'>{label}</p>
            <div className="relative flex w-full">
                <div className={(formik?.errors[name] ? cn_bad : cn_good) + ' bg-gray-100 flex-1'}>
                    {loading ? <Loader /> :
                        <Select
                            isDisabled={props.readOnly}
                            name={name}
                            value={defaultValue(options, formik.values[name])}
                            onChange={e => {
                                formik.setFieldValue(name, e.value)
                            }}
                            options={options}
                            onBlur={props.onBlur}
                            styles={customStyles} />
                    }
                </div>
                <div className={(formik?.errors[name] ? "mb-[24px]" : "") + " self-end relative ml-2"}>
                    <button
                        type="button"
                        onClick={openScan}
                        className={(scaning ? "text-teal-700 scan-icon pointer-events-none" : "normal-button") + " relative w-10 h-10 total-center rounded-md"}>
                        <ICONS.Qr size="28px" />
                    </button>
                    <input
                        ref={scanRef}
                        name={name}
                        onBlur={() => setScaning(null)}
                        type="text"
                        className="absolute flex w-0"
                        onKeyDown={onScanRead}
                    />
                </div>
            </div>
            {formik?.errors[name] ? <div className='text-rose-500'>{formik.errors[name]}</div> : null}
        </div>
    )
}

export default ScanSelect