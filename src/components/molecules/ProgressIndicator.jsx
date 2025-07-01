import React from 'react'
import { motion } from 'framer-motion'

const ProgressIndicator = ({ 
  current, 
  total, 
  type = 'bar', 
  color = 'primary',
  showPercentage = true,
  className = '' 
}) => {
  const percentage = Math.round((current / total) * 100)
  
  const colorClasses = {
    primary: 'from-primary-500 to-secondary-500',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-emerald-500'
  }

  if (type === 'circular') {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-200"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className="stop-primary-500" />
              <stop offset="100%" className="stop-secondary-500" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">
              {percentage}%
            </div>
            <div className="text-xs text-slate-500">
              {current} of {total}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">
          Question {current} of {total}
        </span>
        {showPercentage && (
          <span className="text-sm font-bold gradient-text">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export default ProgressIndicator