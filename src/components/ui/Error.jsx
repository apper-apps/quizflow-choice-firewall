import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading your content. Please try again.',
  onRetry,
  showRetry = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center min-h-96 p-6 ${className}`}
    >
      <Card className="max-w-md w-full text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {title}
          </h3>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>

          {showRetry && onRetry && (
            <div className="space-y-3">
              <Button
                onClick={onRetry}
                variant="primary"
                size="lg"
                icon="RefreshCw"
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                size="md"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default Error