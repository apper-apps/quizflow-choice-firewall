import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Builder from "@/components/pages/Builder";
import Settings from "@/components/pages/Settings";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import QuestionCard from "@/components/molecules/QuestionCard";
import MobilePreview from "@/components/molecules/MobilePreview";
import QuestionTypeSelector from "@/components/molecules/QuestionTypeSelector";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { quizService } from "@/services/api/quizService";

const QuizBuilder = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const [showBranchingModal, setShowBranchingModal] = useState(false)
  const [branchingQuestionId, setBranchingQuestionId] = useState(null)
  const [previewResponses, setPreviewResponses] = useState({})
  const [currentPreviewQuestion, setCurrentPreviewQuestion] = useState(0)
  useEffect(() => {
    if (quizId) {
      loadQuiz()
    } else {
      createNewQuiz()
    }
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await quizService.getById(parseInt(quizId))
      setQuiz(data)
      if (data.questions?.length > 0) {
        setSelectedQuestionId(data.questions[0].Id)
      }
    } catch (err) {
      setError('Failed to load quiz')
      console.error('Error loading quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewQuiz = async () => {
    try {
      setLoading(true)
      const newQuiz = {
        title: 'Untitled Quiz',
        description: '',
        questions: [],
        settings: {
          progressType: 'bar',
          progressColor: 'primary',
          mobileOnly: true,
          cookieTracking: true
        }
      }
      const data = await quizService.create(newQuiz)
      setQuiz(data)
    } catch (err) {
      setError('Failed to create quiz')
      console.error('Error creating quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuiz = async (updates) => {
    try {
      const updatedQuiz = { ...quiz, ...updates }
      await quizService.update(quiz.Id, updatedQuiz)
      setQuiz(updatedQuiz)
      toast.success('Quiz updated successfully')
    } catch (err) {
      toast.error('Failed to update quiz')
      console.error('Error updating quiz:', err)
    }
  }

const addQuestion = async (type) => {
    try {
      const newQuestion = {
        type,
        title: 'New Question',
        options: type === 'text-field' || type === 'contact-fields' ? [] : [
          { text: 'Option 1', imageUrl: '', value: 'option1' },
          { text: 'Option 2', imageUrl: '', value: 'option2' }
        ],
        required: false,
        order: quiz.questions.length,
        branching: {}
      }

      const updatedQuestions = [...quiz.questions, newQuestion]
      await updateQuiz({ questions: updatedQuestions })
      
      // Select the new question and generate a temporary ID
      const tempId = Date.now()
      newQuestion.Id = tempId
      setSelectedQuestionId(tempId)
      setShowQuestionTypes(false)
    } catch (err) {
      toast.error('Failed to add question')
      console.error('Error adding question:', err)
    }
  }

  const updateQuestion = async (questionId, updates) => {
    try {
      const updatedQuestions = quiz.questions.map(q => 
        q.Id === questionId ? { ...q, ...updates } : q
      )
      await updateQuiz({ questions: updatedQuestions })
    } catch (err) {
      toast.error('Failed to update question')
      console.error('Error updating question:', err)
    }
  }

  const deleteQuestion = async (questionId) => {
    try {
      const updatedQuestions = quiz.questions.filter(q => q.Id !== questionId)
      await updateQuiz({ questions: updatedQuestions })
      
      if (selectedQuestionId === questionId) {
        setSelectedQuestionId(updatedQuestions.length > 0 ? updatedQuestions[0].Id : null)
      }
      
      toast.success('Question deleted')
    } catch (err) {
      toast.error('Failed to delete question')
console.error('Error deleting question:', err)
    }
  }
  const openBranchingModal = (questionId) => {
    setBranchingQuestionId(questionId)
    setShowBranchingModal(true)
  }

  const updateBranching = async (questionId, branchingRules) => {
    try {
      await updateQuestion(questionId, { branching: branchingRules })
      setShowBranchingModal(false)
      setBranchingQuestionId(null)
      toast.success('Branching rules updated')
    } catch (err) {
      toast.error('Failed to update branching rules')
      console.error('Error updating branching:', err)
    }
  }

  const handlePreviewResponse = (questionId, response) => {
    setPreviewResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }
  const selectedQuestion = quiz?.questions?.find(q => q.Id === selectedQuestionId)

  if (loading) return <Loading type="quiz-builder" />
  if (error) return <Error message={error} onRetry={quizId ? loadQuiz : createNewQuiz} />
  if (!quiz) return <Error message="Quiz not found" />

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Left Panel - Quiz Structure */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
        {/* Quiz Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-slate-900">Quiz Builder</h1>
            <Button
              variant="outline"
              size="sm"
              icon="Settings"
              onClick={() => {/* Open settings modal */}}
            >
              Settings
            </Button>
          </div>
          
          <Input
            value={quiz.title}
            onChange={(e) => updateQuiz({ title: e.target.value })}
            placeholder="Quiz Title"
            className="font-semibold text-lg"
          />
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              Questions ({quiz.questions?.length || 0})
            </h2>
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={() => setShowQuestionTypes(true)}
            >
              Add Question
            </Button>
          </div>

          {quiz.questions?.length === 0 ? (
            <Empty
              title="No questions yet"
              message="Add your first question to start building your quiz."
              icon="MessageSquare"
              actionText="Add Question"
              onAction={() => setShowQuestionTypes(true)}
              className="min-h-64"
            />
          ) : (
<div className="space-y-3">
              <AnimatePresence>
                {quiz.questions?.map((question, index) => (
                  <QuestionCard
                    key={question.Id}
                    question={question}
                    index={index}
                    isSelected={selectedQuestionId === question.Id}
                    onSelect={setSelectedQuestionId}
                    onEdit={setSelectedQuestionId}
                    onDelete={deleteQuestion}
                    onBranching={() => openBranchingModal(question.Id)}
                    hasBranching={question.branching && Object.keys(question.branching).length > 0}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Question Type Selector Modal */}
        <AnimatePresence>
          {showQuestionTypes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowQuestionTypes(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-4xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    Choose Question Type
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => setShowQuestionTypes(false)}
                  />
                </div>
                
                <QuestionTypeSelector
                  onSelect={addQuestion}
                />
              </motion.div>
            </motion.div>
)}
        </AnimatePresence>

        {/* Branching Configuration Modal */}
        <AnimatePresence>
          {showBranchingModal && branchingQuestionId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowBranchingModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              >
                <BranchingModal
                  question={quiz.questions?.find(q => q.Id === branchingQuestionId)}
                  allQuestions={quiz.questions || []}
                  onSave={(branchingRules) => updateBranching(branchingQuestionId, branchingRules)}
                  onClose={() => setShowBranchingModal(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel - Mobile Preview */}
      <div className="flex-1 bg-slate-100 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Mobile Preview
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon="RotateCcw"
                onClick={() => {
                  setPreviewResponses({})
                  setCurrentPreviewQuestion(0)
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="ExternalLink"
                onClick={() => {
                  const url = `${window.location.origin}/preview/${quiz.Id}`
                  window.open(url, '_blank')
                }}
              >
                Preview
              </Button>
            </div>
          </div>
          
          <MobilePreview
            quiz={quiz}
            currentQuestion={currentPreviewQuestion}
            responses={previewResponses}
            onResponse={handlePreviewResponse}
          />
        </div>
</div>
      </div>
    </div>
  )
}

// Branching Configuration Modal Component
const BranchingModal = ({ question, allQuestions, onSave, onClose }) => {
  const [branchingRules, setBranchingRules] = useState(question?.branching || {})

  const availableTargets = allQuestions.filter(q => q.Id !== question?.Id)

  const handleRuleChange = (optionId, targetQuestionId) => {
    setBranchingRules(prev => ({
      ...prev,
      [optionId]: targetQuestionId ? parseInt(targetQuestionId) : null
    }))
  }

  const handleSave = () => {
    // Remove null values
    const cleanRules = Object.fromEntries(
      Object.entries(branchingRules).filter(([_, value]) => value !== null)
    )
    onSave(cleanRules)
  }

  if (!question || !question.options || question.options.length === 0) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Cannot Configure Branching
        </h3>
        <p className="text-slate-600 mb-6">
          This question type doesn't support branching logic.
        </p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Configure Question Branching
          </h3>
          <p className="text-slate-600 mt-1">
            Set where users go next based on their answer to "{question.title}"
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={onClose}
        />
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Branching Rules</h4>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.Id} className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    If user selects: "{option.text}"
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Go to:</span>
                  <select
                    value={branchingRules[option.Id] || ''}
                    onChange={(e) => handleRuleChange(option.Id, e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Next question (default)</option>
                    {availableTargets.map((target) => (
                      <option key={target.Id} value={target.Id}>
                        Question {allQuestions.findIndex(q => q.Id === target.Id) + 1}: {target.title}
                      </option>
                    ))}
                    <option value="complete">Complete quiz</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">How Branching Works</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Set different next questions based on user answers</li>
                <li>• Leave blank to follow normal question order</li>
                <li>• Select "Complete quiz" to end the quiz early</li>
                <li>• Users can still use the back button to navigate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Branching Rules
        </Button>
      </div>
    </div>
  )

export default QuizBuilder