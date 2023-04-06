import React from 'react';
import Select from 'react-select';

const CustomSelect = ({ name, className, onChange, value, onBlur, options, label, errores }) => {

    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : "";
    };
    let cn_good = className + " center relative" + "bg-gray-100 duration-300 border focus:border-teal-500 ";
    let cn_bad = className + " center relative" + "bg-gray-100 duration-300 border focus:border-red-600 border-red-600 ";
    const customStyles = {
        option: (defaultStyles, state) => ({
          ...defaultStyles,
          color: state.isSelected ? "#fff" : "#000",
          backgroundColor: state.isSelected ? "#14B8A6" : "#fff",
          select:"#14B8A6"
        }),
    
        control: (defaultStyles) => ({
          ...defaultStyles,
          backgroundColor: "#F3F4F6",
          border: "#14B8A6",
          boxShadow: "#14B8A6"
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#000" }),
      };
    
    return (
        <div className="flex flex-col w-full mx-2">
            <p className='text-teal-800 font-medium'>{label}</p>
            <div className={errores ? cn_bad : cn_good}>
                <Select
                    name={name}
                    value={defaultValue(options, value)}
                    onChange={ value =>  {onChange(value)}  }
                    options={options}
                    onBlur={onBlur} 
                    styles={customStyles}/>
            </div>
            {errores ? <div className='text-red-600'>{errores}</div> : null}
        </div>


    )
}

export default CustomSelect