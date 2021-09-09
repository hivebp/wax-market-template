import React from 'react'
import cn from 'classnames'

export default function Input(
  { type, value, className, placeholder, required, disabled, onChange : onChangeCallback}
) {

  const onChange = (e) => {
    onChangeCallback(e)
  }

  return (
    <input
      className={cn(
        'w-full rounded-xl pl-2 py-3',
        'focus:outline-none focus-visible:ring-inset',
        'focus-visible:ring-secondary',
        'text-neutral',
        { 'cursor-not-allowed': disabled },
        className
      )}
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onChange={onChange}
    />
  )
}