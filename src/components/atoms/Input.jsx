import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-slate-400" />
          </div>
        )}
        
        <input
          className={`
            block w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-500
            focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none
            transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input