import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const QuestionCard = ({ 
  question, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onReorder,
  index,
  className = '' 
}) => {
  const getQuestionTypeInfo = (type) => {
    const types = {
      'image-matrix': { icon: 'Grid3X3', color: 'primary', label: 'Image Matrix' },
      'image-list': { icon: 'Image', color: 'secondary', label: 'Image List' },
      'text-list': { icon: 'List', color: 'accent', label: 'Text List' },
      'text-field': { icon: 'Type', color: 'success', label: 'Text Field' },
      'contact-fields': { icon: 'User', color: 'warning', label: 'Contact Form' }
    }
    return types[type] || types['text-list']
  }

  const typeInfo = getQuestionTypeInfo(question.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      <Card
        className={`p-4 group cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary-500 border-primary-200 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => onSelect(question.Id)}
      >
        <div className="flex items-start space-x-4">
          {/* Drag Handle */}
          <div className="drag-handle mt-1 cursor-grab active:cursor-grabbing">
            <ApperIcon name="GripVertical" className="w-5 h-5 text-slate-400" />
          </div>

          {/* Question Icon */}
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${typeInfo.color}-50 to-${typeInfo.color}-100 flex-shrink-0`}>
            <ApperIcon 
              name={typeInfo.icon} 
              className={`w-5 h-5 text-${typeInfo.color}-600`} 
            />
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={typeInfo.color} size="sm">
                    {typeInfo.label}
                  </Badge>
                  {question.required && (
                    <Badge variant="danger" size="sm">
                      Required
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-medium text-slate-900 text-sm leading-tight mb-1">
                  {question.title || 'Untitled Question'}
                </h3>
                
                <p className="text-xs text-slate-500">
                  {question.options?.length > 0 ? `${question.options.length} options` : 'No options'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(question.Id); }}
                  className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(question.Id); }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default QuestionCard