import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  gradient = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-slate-200 transition-all duration-200'
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-primary-200 cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-slate-50' : ''

  const CardComponent = onClick || hover ? motion.div : 'div'
  const motionProps = onClick || hover ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: onClick ? { scale: 0.98 } : undefined
  } : {}

  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card