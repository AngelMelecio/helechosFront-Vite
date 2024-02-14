import React from 'react'

const HButton = ({ openModal, icon, className, ...props }) => {
  return (
    <button
      type="button"
      className={`w-10 h-10  rounded-lg shadow-md normal-button total-center
        ${className}
      `}
      onClick={openModal}
      {...props}
    >
      {icon}
    </button>
  )
}

export default HButton