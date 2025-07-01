import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { templateService } from '@/services/api/templateService'
import { quizService } from '@/services/api/quizService'

const Templates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  const categories = [
    { id: 'all', name: 'All Templates', icon: 'Grid3X3' },
    { id: 'lead-gen', name: 'Lead Generation', icon: 'Users' },
    { id: 'personality', name: 'Personality', icon: 'User' },
    { id: 'assessment', name: 'Assessment', icon: 'ClipboardCheck' },
    { id: 'feedback', name: 'Feedback', icon: 'MessageSquare' },
    { id: 'survey', name: 'Survey', icon: 'BarChart3' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await templateService.getAll()
      setTemplates(data)
    } catch (err) {
      setError('Failed to load templates')
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const useTemplate = async (template) => {
    try {
      const newQuiz = {
        ...template,
        title: `${template.title} - Copy`,
        Id: undefined, // Remove ID to create new quiz
        createdAt: new Date().toISOString()
      }
      
      const createdQuiz = await quizService.create(newQuiz)
      toast.success('Template applied successfully!')
      navigate(`/builder/${createdQuiz.Id}`)
    } catch (err) {
      toast.error('Failed to use template')
      console.error('Error using template:', err)
    }
  }

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={loadTemplates} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Quiz Templates
        </h1>
        <p className="text-slate-600">
          Start with professionally designed templates and customize them for your needs.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              icon={category.icon}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-200"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Empty
          title="No templates found"
          message="Try selecting a different category or check back later for new templates."
          icon="Layout"
          actionText="View All Templates"
          onAction={() => setSelectedCategory('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: template.Id * 0.1 }}
            >
              <Card hover className="group overflow-hidden">
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
                  {template.previewImage ? (
                    <img 
                      src={template.previewImage} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ApperIcon name="Layout" className="w-16 h-16 text-primary-300" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <Badge variant="gradient" size="sm">
                      {template.questions?.length || 0} Questions
                    </Badge>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">
                        {template.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" size="sm">
                        {categories.find(c => c.id === template.category)?.name || 'Template'}
                      </Badge>
                      {template.featured && (
                        <Badge variant="accent" size="sm">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => useTemplate(template)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create from Scratch CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-100">
          <ApperIcon name="Zap" className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Start from Scratch
          </h3>
          <p className="text-slate-600 mb-6">
            Create a completely custom quiz tailored to your specific needs.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon="Plus"
            onClick={() => navigate('/builder')}
          >
            Create New Quiz
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}

export default Templates