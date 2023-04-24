import Select from 'react-select';

const SelectorClientes = ({ name, className, value, onChange, onBlur, errores, options }) => {

  const defaultValue = (options, value) => {
    return options ? options.find(option => option.value === value) : "";
  }
  let cn_good = className + " center relative duration-300 border focus:border-teal-500 ";
  let cn_bad = className + " center relative duration-300 border focus:border-red-600 border-red-600 ";

  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "#fff" : "#115e59",
      backgroundColor: state.isSelected ? "#14B8A6" : "#fff",
      select: "#14B8A6",
    }),
    

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "#ffffff",
      border: "#14B8A6",
      boxShadow: "#14B8A6",
      fontSize:'1.5rem',
      fontWeight:'600'
    }),
    
    
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#115e59" }),
  };

  return (
    <div div className={errores ? cn_bad : cn_good} >
      <Select
        name={name}
        value={defaultValue(options, value)}
        onChange={value => { onChange(value) }}
        options={options}
        onBlur={onBlur}
        styles={customStyles} />
    </div>
  )
}
export default SelectorClientes