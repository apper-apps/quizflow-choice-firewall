import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { Background, Controls, MarkerType, MiniMap, ReactFlow, addEdge, useEdgesState, useNodesState } from "@xyflow/react";
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
  const [viewMode, setViewMode] = useState('panel') // 'panel', 'kanban', 'mindmap'
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const [showBranchingModal, setShowBranchingModal] = useState(false)
  const [branchingQuestionId, setBranchingQuestionId] = useState(null)
  const [previewResponses, setPreviewResponses] = useState({})
  const [currentPreviewQuestion, setCurrentPreviewQuestion] = useState(0)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
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
      setError(null)
      const data = await quizService.getById(parseInt(quizId))
      
      if (!data) {
        throw new Error('Quiz not found')
      }
      
      setQuiz(data)
      if (data.questions?.length > 0) {
        const firstQuestion = data.questions[0]
const questionId = firstQuestion?.Id || firstQuestion?.id
        if (questionId && (typeof questionId === 'string' || typeof questionId === 'number')) {
          setSelectedQuestionId(questionId)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load quiz')
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
await quizService.update(quiz.id || quiz.Id, updatedQuiz)
      setQuiz(updatedQuiz)
      toast.success('Quiz updated successfully')
    } catch (err) {
      toast.error('Failed to update quiz')
      console.error('Error updating quiz:', err)
    }
  }

const addQuestion = async (type) => {
    try {
      if (!quiz || !quiz.questions) {
        toast.error('Quiz data not available')
        return
      }

      const newQuestion = {
        type,
        title: 'New Question',
        options: type === 'text-field' || type === 'contact-fields' ? [] : [
          { text: 'Option 1', imageUrl: '', value: 'option1', id: `opt_${Date.now()}_1` },
          { text: 'Option 2', imageUrl: '', value: 'option2', id: `opt_${Date.now()}_2` }
        ],
        required: false,
        order: quiz.questions.length,
        branching: {},
        id: `q_${Date.now()}`
      }

      const updatedQuestions = [...quiz.questions, newQuestion]
      await updateQuiz({ questions: updatedQuestions })
      
      // Select the new question
      setSelectedQuestionId(newQuestion.id)
      setShowQuestionTypes(false)
    } catch (err) {
      toast.error('Failed to add question')
      console.error('Error adding question:', err)
    }
  }

  const updateQuestion = async (questionId, updates) => {
    try {
      setLoading(true)
      
      if (!quiz?.questions || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz data')
      }
      
      const updatedQuestions = quiz.questions.map(q => {
        const qId = q?.Id || q?.id
        return qId === questionId ? { ...q, ...updates } : q
      })
      const updatedQuiz = { ...quiz, questions: updatedQuestions }
try {
        await quizService.update(quiz.id || quiz.Id, updatedQuiz)
      } catch (error) {
        console.error('Failed to update quiz:', error)
        toast.error('Failed to save changes')
        throw error
      }
      setQuiz(updatedQuiz)
      toast.success('Question updated successfully')
    } catch (err) {
      toast.error('Failed to update question')
      console.error('Error updating question:', err)
    } finally {
      setLoading(false)
    }
  }
const deleteQuestion = async (questionId) => {
    try {
      if (!quiz?.questions || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz data')
      }
      
      const updatedQuestions = quiz.questions.filter(q => {
        const qId = q?.Id || q?.id
        return qId !== questionId
      })
      await updateQuiz({ questions: updatedQuestions })
      
      if (selectedQuestionId === questionId) {
        if (updatedQuestions.length > 0) {
          const firstQuestion = updatedQuestions[0]
          const firstId = firstQuestion?.Id || firstQuestion?.id
          setSelectedQuestionId(firstId || null)
        } else {
          setSelectedQuestionId(null)
        }
      }
      
      toast.success('Question deleted successfully')
    } catch (err) {
      setError('Failed to delete question')
      console.error('Error deleting question:', err)
    }
  }
  
const openBranchingModal = (questionId) => {
    if (!questionId) {
      console.warn('Cannot open branching modal: missing question ID')
      return
    }
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

const selectedQuestion = quiz?.questions?.find(q => {
    if (!q) return false
    const qId = q.Id || q.id
    return qId && qId === selectedQuestionId
  }) || null

const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Error handling
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={quizId ? loadQuiz : createNewQuiz} />
  if (!quiz) return <Error message="Quiz not found" />
// Generate nodes and edges for mindmap view
  useEffect(() => {
    if (!quiz?.questions || !Array.isArray(quiz.questions)) {
      setNodes([])
      setEdges([])
      return
    }

    const generatedNodes = quiz.questions.map((question, index) => {
if (!question) {
        console.warn('Invalid question data:', question)
        return null
      }
      
      const questionId = question.Id || question.id
      const questionTitle = question.title || 'Untitled Question'
      
      if (!questionId && questionId !== 0) {
        console.warn('Question missing ID:', question)
        return null
      }

      return {
        id: String(questionId),
        type: 'default',
        position: { 
          x: (index % 3) * 300 + 100, 
          y: Math.floor(index / 3) * 150 + 100 
        },
        data: { 
          label: (
            <div className="p-3">
              <div className="font-semibold text-sm mb-1">Q{index + 1}</div>
              <div className="text-xs text-slate-600 truncate w-32">
                {questionTitle}
              </div>
            </div>
          )
        },
        style: {
          background: selectedQuestionId === questionId ? '#3b82f6' : '#ffffff',
          color: selectedQuestionId === questionId ? '#ffffff' : '#1e293b',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          width: 200,
          fontSize: '12px'
        }
      }
    }).filter(Boolean)

    const generatedEdges = [];
    quiz.questions.forEach((question, index) => {
      const questionId = question?.Id || question?.id
if (!questionId && questionId !== 0) return

      if (index < (quiz?.questions?.length || 0) - 1) {
        const nextQuestion = quiz.questions[index + 1]
        if (!nextQuestion) return
        
        const nextQuestionId = nextQuestion.Id || nextQuestion.id
        
        if (nextQuestionId || nextQuestionId === 0) {
          generatedEdges.push({
            id: `e${questionId}-${nextQuestionId}`,
            source: String(questionId),
            target: nextQuestionId.toString(),
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          });
        }
      }
      
      // Add branching edges
      if (question.branching && typeof question.branching === 'object') {
if (question.branching && typeof question.branching === 'object') {
          Object.entries(question.branching).forEach(([optionId, targetId]) => {
            if (targetId && targetId !== 'complete' && targetId !== questionId && optionId) {
              generatedEdges.push({
                id: `e${questionId}-${targetId}-branch`,
                source: String(questionId),
                target: String(targetId),
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' },
              label: 'Branch'
            });
          }
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [quiz?.questions, viewMode, selectedQuestionId, setNodes, setEdges]);

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'kanban':
        return <KanbanView 
          quiz={quiz}
          selectedQuestionId={selectedQuestionId}
          onSelectQuestion={setSelectedQuestionId}
          onDeleteQuestion={deleteQuestion}
          onAddQuestion={() => setShowQuestionTypes(true)}
          onBranchingConfig={openBranchingModal}
        />;
      case 'mindmap':
        return <MindmapView 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            const nodeId = node?.id
            if (nodeId) {
try {
                const parsedId = parseInt(nodeId)
                if (!isNaN(parsedId)) {
                  setSelectedQuestionId(parsedId)
                }
              } catch (error) {
                console.warn('Failed to parse node ID:', nodeId)
              }
            }
          }}
          onAddQuestion={() => setShowQuestionTypes(true)}
        />
      default:
        return <PanelView 
          quiz={quiz}
          selectedQuestionId={selectedQuestionId}
          onSelectQuestion={setSelectedQuestionId}
          onDeleteQuestion={deleteQuestion}
          onAddQuestion={() => setShowQuestionTypes(true)}
          onBranchingConfig={openBranchingModal}
          previewResponses={previewResponses}
          currentPreviewQuestion={currentPreviewQuestion}
          onPreviewResponse={handlePreviewResponse}
          onResetPreview={() => {
            setPreviewResponses({})
            setCurrentPreviewQuestion(0)
          }}
          onOpenPreview={() => {
const url = `${window.location.origin}/preview/${quiz.id || quiz.Id}`
            window.open(url, '_blank')
          }}
        />;
    }
  };

  return (
    <div className="h-screen bg-slate-50">
      {/* Header with View Switcher */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">Quiz Builder</h1>
            <Input
              value={quiz?.title || ''}
              onChange={(e) => updateQuiz({ title: e.target.value })}
              placeholder="Quiz Title"
              className="font-semibold"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
            <Button
              variant="outline"
              size="sm"
              icon="Settings"
              onClick={() => {/* Open settings modal */}}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full pt-20">
        {renderCurrentView()}
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
                question={quiz?.questions?.find(q => 
                  q && (q.Id === branchingQuestionId || q.id === branchingQuestionId)
                ) || null}
                allQuestions={quiz?.questions || []}
                onSave={(branchingRules) => updateBranching(branchingQuestionId, branchingRules)}
                onClose={() => setShowBranchingModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Panel View Component (Original Layout)
const PanelView = ({ 
  quiz, 
  selectedQuestionId, 
  onSelectQuestion, 
  onDeleteQuestion, 
  onAddQuestion, 
  onBranchingConfig,
  previewResponses,
  currentPreviewQuestion,
  onPreviewResponse,
  onResetPreview,
  onOpenPreview
}) => (
  <div className="h-full flex">
    {/* Left Panel - Quiz Structure */}
    <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
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
            onClick={onAddQuestion}
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
            onAction={onAddQuestion}
            className="min-h-64"
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
{quiz.questions?.filter(Boolean).map((question, index) => {
                if (!question) return null
                const questionId = question.Id || question.id
                if (!questionId && questionId !== 0) return null
                
                return (
                  <QuestionCard
                    key={questionId}
                    question={question}
                    index={index}
                    isSelected={selectedQuestionId === questionId}
                    onSelect={onSelectQuestion}
                    onEdit={onSelectQuestion}
                    onDelete={onDeleteQuestion}
                    onBranching={() => onBranchingConfig(questionId)}
                    hasBranching={question.branching && typeof question.branching === 'object' && Object.keys(question.branching).length > 0}
                  />
                )
}).filter(Boolean)}
            </AnimatePresence>
          </div>
        )}
      </div>
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
              onClick={onResetPreview}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="ExternalLink"
              onClick={onOpenPreview}
            >
              Preview
            </Button>
          </div>
        </div>
        
        <MobilePreview
          quiz={quiz}
          currentQuestion={currentPreviewQuestion}
          responses={previewResponses}
          onResponse={onPreviewResponse}
        />
      </div>
    </div>
  </div>
);

// Kanban View Component
const KanbanView = ({ 
  quiz, 
  selectedQuestionId, 
  onSelectQuestion, 
  onDeleteQuestion, 
  onAddQuestion, 
  onBranchingConfig 
}) => (
  <div className="h-full p-6 overflow-auto">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Kanban View - Questions ({quiz.questions?.length || 0})
      </h2>
      <Button
        variant="primary"
        size="sm"
        icon="Plus"
        onClick={onAddQuestion}
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
        onAction={onAddQuestion}
        className="min-h-96"
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
{quiz.questions?.filter(Boolean).map((question, index) => {
            if (!question) return null
            const questionId = question.Id || question.id
            if (!questionId && questionId !== 0) return null
            
            return (
              <motion.div
                key={questionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  selectedQuestionId === questionId 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => onSelectQuestion(questionId)}
              >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                    Q{index + 1}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded capitalize">
                    {question.type?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon="Settings"
                    onClick={(e) => {
e.stopPropagation();
                      onBranchingConfig(questionId);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    icon="Trash2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(questionId);
                    }}
                  />
                </div>
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                {question.title}
              </h3>
              
              {question.options?.length > 0 && (
                <div className="space-y-1">
                  {question.options.slice(0, 3).map((option, idx) => (
                    <div key={idx} className="text-sm text-slate-600 truncate">
                      • {option.text}
                    </div>
                  ))}
                  {question.options.length > 3 && (
                    <div className="text-sm text-slate-400">
                      +{question.options.length - 3} more options
                    </div>
                  )}
                </div>
              )}
              
              {question.branching && Object.keys(question.branching).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center text-xs text-orange-600">
                    <ApperIcon name="GitBranch" size={12} className="mr-1" />
                    Has branching logic
                  </div>
                </div>
              )}
</motion.div>
            )
          }).filter(Boolean)}
        </AnimatePresence>
      </div>
    )}
  </div>
);

// Mindmap View Component
const MindmapView = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeClick,
  onAddQuestion 
}) => (
  <div className="h-full relative">
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="primary"
        size="sm"
        icon="Plus"
        onClick={onAddQuestion}
      >
        Add Question
      </Button>
    </div>
    
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      fitView
      attributionPosition="bottom-left"
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  </div>
);

// View Switcher Component
const ViewSwitcher = ({ currentView, onViewChange }) => (
  <div className="flex bg-slate-100 rounded-lg p-1">
    <button
      onClick={() => onViewChange('panel')}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        currentView === 'panel'
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      <ApperIcon name="PanelLeftClose" size={16} className="mr-2 inline" />
      Panel
    </button>
    <button
      onClick={() => onViewChange('kanban')}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        currentView === 'kanban'
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      <ApperIcon name="Columns" size={16} className="mr-2 inline" />
      Kanban
    </button>
    <button
      onClick={() => onViewChange('mindmap')}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        currentView === 'mindmap'
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      <ApperIcon name="GitBranch" size={16} className="mr-2 inline" />
      Mindmap
    </button>
  </div>
);


// Branching Configuration Modal Component
const BranchingModal = ({ question, allQuestions, onSave, onClose }) => {
  const [branchingRules, setBranchingRules] = useState(question?.branching || {})

const availableTargets = allQuestions?.filter(q => {
    const qId = q?.id || q?.Id
    const questionId = question?.id || question?.Id
    return qId && qId !== questionId
  }) || []

const handleRuleChange = (optionId, targetQuestionId) => {
    if (!optionId && optionId !== 0) return
    
    let processedTargetId = null
    if (targetQuestionId && targetQuestionId !== '') {
      const parsed = parseInt(targetQuestionId)
      processedTargetId = isNaN(parsed) ? targetQuestionId : parsed
    }
    
    setBranchingRules(prev => ({
      ...prev,
      [optionId]: processedTargetId
    }))
  }

  const handleSave = () => {
    const cleanRules = Object.fromEntries(
      Object.entries(branchingRules).filter(([key, value]) => value !== null && value !== '')
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
<div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">Branching Rules</h4>
{question?.options && Array.isArray(question.options) ? question.options.filter(Boolean).map((option) => {
              if (!option) return null
              const optionId = option.id || option.Id
              const optionText = option.text || 'Untitled option'
              
              if (!optionId && optionId !== 0) return null
              
              return (
                <div key={optionId} className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      If user selects: "{optionText}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Go to:</span>
                    <select
                      value={branchingRules?.[optionId] || ''}
                      onChange={(e) => handleRuleChange(optionId, e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Next question (default)</option>
{availableTargets && Array.isArray(availableTargets) ? availableTargets.filter(Boolean).map((target) => {
                        if (!target) return null
                        const targetId = target.id || target.Id
                        const targetTitle = target.title || 'Untitled'
                        
                        if (!targetId && targetId !== 0) return null
                        
                        const questionIndex = allQuestions && Array.isArray(allQuestions) ? 
                          allQuestions.findIndex(q => {
                            if (!q) return false
                            const qId = q.id || q.Id
                            return qId === targetId
                          }) : -1
                        
                        return (
                          <option key={targetId} value={targetId}>
                            Question {questionIndex >= 0 ? questionIndex + 1 : '?'}: {targetTitle}
                          </option>
                        )
                      }).filter(Boolean) : null}
                      <option value="complete">Complete quiz</option>
                    </select>
                  </div>
                </div>
              )
            }).filter(Boolean) : (
              <p className="text-sm text-slate-500">No options available for branching</p>
            )}
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
}

export default QuizBuilder