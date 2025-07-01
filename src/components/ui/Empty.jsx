import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  title = 'Nothing here yet',
  message = 'Get started by creating your first item.',
  icon = 'Plus',
  actionText = 'Get Started',
  onAction,
  showAction = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center min-h-96 p-6 ${className}`}
    >
      <Card className="max-w-md w-full text-center p-8 bg-gradient-to-br from-white to-slate-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold gradient-text mb-3">
            {title}
          </h3>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>

          {showAction && onAction && (
            <Button
              onClick={onAction}
              variant="primary"
              size="lg"
              icon="Plus"
              className="shadow-lg hover:shadow-xl"
            >
              {actionText}
            </Button>
          )}
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default Empty