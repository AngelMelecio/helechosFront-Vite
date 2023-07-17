import React from 'react';
import Select from 'react-select';
import Loader from './Loader/Loader';
import { without } from 'lodash';

const CustomSelect = ({ name, className, onChange, value, onBlur, options, label, readOnly, errores, loading, withoutMargin }) => {

  const defaultValue = (options, value) => {
    return options ? options.find(option => option.value === value) : "";
  };
  let cn_good = className + " center relative" + "bg-gray-100 duration-300 border focus:border-teal-500 text-gray-700";
  let cn_bad = className + " center relative" + "bg-gray-100 duration-300 border focus:border-rose-500 border-rose-500 text-gray-700";
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#fff" : "#000",
      backgroundColor: state.isSelected ? "#e5e7eb" : "#fff",
      color: "#374151",
      select: "#14B8A6"
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: readOnly ? "#fff" : "#F3F4F6",
      border: readOnly ? "#fff" : "#14B8A6",
      boxShadow: "#14B8A6",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#374151" }),
  };

  return (
    <div className={`flex flex-col w-full mt-2 ${withoutMargin ? '' : 'mx-2'}`}>
      <p className='text-teal-700 text-sm font-medium'>{label}</p>
      <div className={(errores ? cn_bad : cn_good) + ' bg-gray-100'}>
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