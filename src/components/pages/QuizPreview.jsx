import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressIndicator from '@/components/molecules/ProgressIndicator'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { quizService } from '@/services/api/quizService'

const QuizPreview = () => {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  useEffect(() => {
    // Mobile-only enforcement
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    if (!isMobile) {
      alert('This quiz is optimized for mobile devices. Please open on your phone for the best experience.')
    }
  }, [])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await quizService.getById(parseInt(quizId))
      setQuiz(data)
    } catch (err) {
      setError('Quiz not found')
      console.error('Error loading quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const renderQuestion = () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return null
    
    const question = quiz.questions[currentQuestion]
    
    switch (question.type) {
      case 'image-matrix':
        return renderImageMatrix(question)
      case 'image-list':
        return renderImageList(question)
      case 'text-list':
        return renderTextList(question)
      case 'text-field':
        return renderTextField(question)
      case 'contact-fields':
        return renderContactFields(question)
      default:
        return renderTextList(question)
    }
  }

  const renderImageMatrix = (question) => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-900 text-center">
        {question.title}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {question.options?.map((option) => (
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
            onClick={() => {
              const currentResponses = responses[question.Id] || []
              const newResponses = currentResponses.includes(option.Id)
                ? currentResponses.filter(id => id !== option.Id)
                : [...currentResponses, option.Id]
              handleResponse(question.Id, newResponses)
            }}
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

  const renderImageList = (question) => (
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
            onClick={() => handleResponse(question.Id, option.Id)}
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

  const renderTextList = (question) => (
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
            onClick={() => handleResponse(question.Id, option.Id)}
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

  const renderTextField = (question) => (
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
          onChange={(e) => handleResponse(question.Id, e.target.value)}
        />
      </div>
    </div>
  )

  const renderContactFields = (question) => (
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
            onChange={(e) => handleResponse(`${question.Id}_name`, e.target.value)}
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            value={responses[`${question.Id}_email`] || ''}
            onChange={(e) => handleResponse(`${question.Id}_email`, e.target.value)}
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
            value={responses[`${question.Id}_phone`] || ''}
            onChange={(e) => handleResponse(`${question.Id}_phone`, e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold gradient-text mb-4">
          Quiz Completed!
        </h2>
        
        <p className="text-slate-600 mb-6">
          Thank you for taking our quiz. Your responses have been recorded.
        </p>
        
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => window.close()}
        >
          Close
        </Button>
      </motion.div>
    </div>
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!quiz) return <Error message="Quiz not found" />

  if (isCompleted) {
    return renderResults()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress */}
      <div className="px-6 py-4 bg-white border-b border-slate-100">
        <ProgressIndicator
          current={currentQuestion + 1}
          total={quiz.questions?.length || 0}
          type={quiz.settings?.progressType || 'bar'}
          showPercentage={false}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between space-x-4">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            icon="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>
          
          <Button
            variant="primary"
            onClick={nextQuestion}
            icon="ArrowRight"
            iconPosition="right"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizPreview