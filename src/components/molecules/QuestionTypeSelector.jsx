import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const questionTypes = [
  {
    type: 'image-matrix',
    name: 'Image Matrix',
    description: 'Grid of images for selection',
    icon: 'Grid3X3',
    color: 'text-primary-600'
  },
  {
    type: 'image-list',
    name: 'Image List',
    description: 'Vertical list with images',
    icon: 'Image',
    color: 'text-secondary-600'
  },
  {
    type: 'text-list',
    name: 'Text List',
    description: 'Multiple choice options',
    icon: 'List',
    color: 'text-accent-600'
  },
  {
    type: 'text-field',
    name: 'Text Field',
    description: 'Short or long text input',
    icon: 'Type',
    color: 'text-emerald-600'
  },
  {
    type: 'contact-fields',
    name: 'Contact Form',
    description: 'Name, email, phone fields',
    icon: 'User',
    color: 'text-orange-600'
  }
]

const QuestionTypeSelector = ({ onSelect, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-5 gap-4 ${className}`}>
      {questionTypes.map((type) => (
        <motion.div
          key={type.type}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card
            hover
            onClick={() => onSelect(type.type)}
            className="p-4 text-center group cursor-pointer"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-primary-50 group-hover:to-secondary-50 transition-all duration-200`}>
                <ApperIcon 
                  name={type.icon} 
                  className={`w-6 h-6 ${type.color} group-hover:scale-110 transition-transform duration-200`} 
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-primary-700 transition-colors">
                  {type.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {type.description}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default QuestionTypeSelector