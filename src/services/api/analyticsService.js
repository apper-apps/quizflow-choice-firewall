import { analytics } from '@/services/mockData/analytics.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AnalyticsService {
  constructor() {
    this.analytics = [...analytics]
  }

  async getAnalytics(timeRange = '7d') {
    await delay(400)
    // In a real app, this would filter based on timeRange
    return [...this.analytics]
  }

  async getQuizAnalytics(quizId) {
    await delay(300)
    const quizAnalytics = this.analytics.find(a => a.Id === quizId)
    if (!quizAnalytics) {
      throw new Error('Analytics not found')
    }
    return { ...quizAnalytics }
  }
}

export const analyticsService = new AnalyticsService()