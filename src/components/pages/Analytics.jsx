import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { analyticsService } from '@/services/api/analyticsService'

const Analytics = () => {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('7d')

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError('Failed to load analytics')
      console.error('Error loading analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`
  }

  if (loading) return <Loading type="skeleton" />
  if (error) return <Error message={error} onRetry={loadAnalytics} />

  const totalQuizzes = analytics.length
  const totalViews = analytics.reduce((sum, quiz) => sum + quiz.views, 0)
  const totalCompletions = analytics.reduce((sum, quiz) => sum + quiz.completions, 0)
  const avgCompletionRate = totalViews > 0 ? (totalCompletions / totalViews) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Track your quiz performance and engagement metrics.
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700 mb-1">
                  Total Quizzes
                </p>
                <p className="text-3xl font-bold text-primary-900">
                  {formatNumber(totalQuizzes)}
                </p>
              </div>
              <div className="p-3 bg-primary-200 rounded-lg">
                <ApperIcon name="FileText" className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-700 mb-1">
                  Total Views
                </p>
                <p className="text-3xl font-bold text-secondary-900">
                  {formatNumber(totalViews)}
                </p>
              </div>
              <div className="p-3 bg-secondary-200 rounded-lg">
                <ApperIcon name="Eye" className="w-6 h-6 text-secondary-700" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-700 mb-1">
                  Completions
                </p>
                <p className="text-3xl font-bold text-accent-900">
                  {formatNumber(totalCompletions)}
                </p>
              </div>
              <div className="p-3 bg-accent-200 rounded-lg">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-accent-700" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">
                  Completion Rate
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {formatPercentage(avgCompletionRate)}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quiz Performance Table */}
      {analytics.length === 0 ? (
        <Empty
          title="No analytics data yet"
          message="Start creating and sharing quizzes to see performance metrics here."
          icon="BarChart3"
          actionText="Create Your First Quiz"
          onAction={() => window.location.href = '/builder'}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Quiz Performance
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Completions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {analytics.map((quiz, index) => (
                  <motion.tr
                    key={quiz.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {quiz.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {quiz.questions} questions
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatNumber(quiz.views)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatNumber(quiz.completions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {formatPercentage((quiz.completions / quiz.views) * 100)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatNumber(quiz.leads)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={quiz.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {quiz.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Analytics