import React from 'react';
import Select from 'react-select';
import Loader from './Loader/Loader';

const CustomSelect = ({ name, className, onChange, value, onBlur, options, label, readOnly, errores, loading, withoutMargin }) => {

  const defaultValue = (options, value) => {
    return options ? options.find(option => option.value === value) : "";
  };
  let cn_good = className + " center relative" + "bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700";
  let cn_bad = className + " center relative" + "bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700";
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      //color: state.isSelected ? "#fff" : "#000",
      backgroundColor: state.isSelected ? "#e5e7eb" : "#fff",
      color: "#374151",
      select: "#14B8A6",
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: readOnly ? "#fff" : "#F3F4F6",
      border: readOnly ? "#fff" : "#14B8A6",
      boxShadow: "#14B8A6",
      radius: "0.375rem",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles,  color: "#374151",radius: "0.375rem", }),
  };

  return (
    <div className={`z-20 flex flex-col w-full  ${withoutMargin ? '' : 'px-2'}`}>
      <p className='pb-1 text-sm font-medium text-teal-800/80'>{label}</p>
      <div className={(errores ? cn_bad : cn_good) + ' bg-gray-100 rounded-md'}>
        {
          loading ? <Loader /> :
            <Select
              isDisabled={readOnly}
              name={name}
              value={defaultValue(options, value)}
              onChange={value => { onChange(value) }}
              options={options}
              onBlur={onBlur}
              styles={customStyles} />
        }
      </div>
      {errores ? <div className='text-rose-500'>{errores}</div> : null}
    </div>


  )
}

export default CustomSelect