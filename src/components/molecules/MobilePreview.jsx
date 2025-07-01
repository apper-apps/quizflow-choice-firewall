import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressIndicator from './ProgressIndicator'
import Button from '@/components/atoms/Button'

const MobilePreview = ({ 
  quiz, 
  currentQuestion = 0, 
  responses = {},
  onResponse,
  className = '' 
}) => {
  const question = quiz?.questions?.[currentQuestion]
  const totalQuestions = quiz?.questions?.length || 0
  const isLastQuestion = currentQuestion === totalQuestions - 1

  const renderQuestion = () => {
    if (!question) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <ApperIcon name="MessageSquare" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Add questions to preview your quiz</p>
          </div>
        </div>
      )
    }

    switch (question.type) {
      case 'image-matrix':
        return renderImageMatrix()
      case 'image-list':
        return renderImageList()
      case 'text-list':
        return renderTextList()
      case 'text-field':
        return renderTextField()
      case 'contact-fields':
        return renderContactFields()
      default:
        return renderTextList()
    }
  }

  const renderImageMatrix = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {question.options?.map((option, index) => (
          <motion.div
            key={option.Id}
            whileTap={{ scale: 0.95 }}
            className={`
              relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200
              ${responses[question.Id]?.includes(option.Id) 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-slate-200 hover:border-primary-300'
              }
            `}
            onClick={() => handleOptionSelect(option.Id)}
          >
            {option.imageUrl ? (
              <img 
                src={option.imageUrl} 
                alt={option.text}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Image" className="w-8 h-8 text-slate-400" />
              </div>
            )}
            
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-sm font-medium text-slate-900 text-center">
                  {option.text}
                </p>
              </div>
            </div>
            
            {responses[question.Id]?.includes(option.Id) && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Check" className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderImageList = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title}
      </h2>
      
      <div className="space-y-3">
        {question.options?.map((option) => (
          <motion.div
            key={option.Id}
            whileTap={{ scale: 0.98 }}
            className={`
              flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${responses[question.Id] === option.Id 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-slate-200 hover:border-primary-300'
              }
            `}
            onClick={() => handleOptionSelect(option.Id)}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {option.imageUrl ? (
                <img 
                  src={option.imageUrl} 
                  alt={option.text}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <ApperIcon name="Image" className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-slate-900">
                {option.text}
              </p>
            </div>
            
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${responses[question.Id] === option.Id 
                ? 'border-primary-500 bg-primary-500' 
                : 'border-slate-300'
              }
            `}>
              {responses[question.Id] === option.Id && (
                <ApperIcon name="Check" className="w-4 h-4 text-white" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTextList = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title}
      </h2>
      
      <div className="space-y-3">
        {question.options?.map((option) => (
          <motion.div
            key={option.Id}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${responses[question.Id] === option.Id 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-slate-200 hover:border-primary-300'
              }
            `}
            onClick={() => handleOptionSelect(option.Id)}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">
                {option.text}
              </p>
              
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${responses[question.Id] === option.Id 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-slate-300'
                }
              `}>
                {responses[question.Id] === option.Id && (
                  <ApperIcon name="Check" className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTextField = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title}
      </h2>
      
      <div>
        <textarea
          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none resize-none"
          rows={4}
          placeholder="Type your answer here..."
          value={responses[question.Id] || ''}
          onChange={(e) => onResponse?.(question.Id, e.target.value)}
        />
      </div>
    </div>
  )

  const renderContactFields = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title || 'Contact Information'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            value={responses[`${question.Id}_name`] || ''}
            onChange={(e) => onResponse?.(`${question.Id}_name`, e.target.value)}
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            value={responses[`${question.Id}_email`] || ''}
            onChange={(e) => onResponse?.(`${question.Id}_email`, e.target.value)}
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            value={responses[`${question.Id}_phone`] || ''}
            onChange={(e) => onResponse?.(`${question.Id}_phone`, e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const handleOptionSelect = (optionId) => {
    if (question.type === 'image-matrix') {
      const currentResponses = responses[question.Id] || []
      const newResponses = currentResponses.includes(optionId)
        ? currentResponses.filter(id => id !== optionId)
        : [...currentResponses, optionId]
      onResponse?.(question.Id, newResponses)
    } else {
      onResponse?.(question.Id, optionId)
    }
  }

  return (
    <div className={`mobile-frame mx-auto ${className}`}>
      <div className="mobile-screen flex flex-col">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 py-3 bg-slate-900 text-white text-sm">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Signal" className="w-4 h-4" />
            <ApperIcon name="Wifi" className="w-4 h-4" />
            <ApperIcon name="Battery" className="w-4 h-4" />
          </div>
        </div>

        {/* Progress */}
        {totalQuestions > 0 && (
          <div className="px-6 py-4 bg-white border-b border-slate-100">
            <ProgressIndicator
              current={currentQuestion + 1}
              total={totalQuestions}
              type={quiz?.settings?.progressType || 'bar'}
              showPercentage={false}
            />
          </div>
        )}

        {/* Question Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        {question && (
          <div className="p-6 bg-white border-t border-slate-100">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                if (isLastQuestion) {
                  // Show results
                } else {
                  // Next question
                }
              }}
            >
              {isLastQuestion ? 'See Results' : 'Continue'}
              <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobilePreview