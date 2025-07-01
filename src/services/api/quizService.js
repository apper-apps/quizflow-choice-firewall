import { quizzes } from '@/services/mockData/quizzes.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuizService {
  constructor() {
    this.quizzes = [...quizzes]
  }

  async getAll() {
    await delay(300)
    return [...this.quizzes]
  }

  async getById(id) {
    await delay(250)
    const quiz = this.quizzes.find(q => q.Id === id)
    if (!quiz) {
      throw new Error('Quiz not found')
    }
    return { ...quiz }
  }

  async create(quizData) {
    await delay(400)
    const newQuiz = {
      ...quizData,
      Id: Math.max(...this.quizzes.map(q => q.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.quizzes.push(newQuiz)
    return { ...newQuiz }
  }
async update(id, updates) {
    await delay(300)
    const index = this.quizzes.findIndex(q => q.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    
    // Validate branching rules if present
    if (updates.questions) {
      this.validateBranchingRules(updates.questions)
    }
    
    this.quizzes[index] = {
      ...this.quizzes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.quizzes[index] }
  }

  validateBranchingRules(questions) {
    const questionIds = new Set(questions.map(q => q.Id))
    
    questions.forEach(question => {
      if (question.branching) {
        Object.values(question.branching).forEach(targetId => {
          if (targetId !== 'complete' && !questionIds.has(targetId)) {
            throw new Error(`Invalid branching target: Question ${targetId} not found`)
          }
        })
      }
    })
  }

  async delete(id) {
    await delay(200)
    const index = this.quizzes.findIndex(q => q.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    
    this.quizzes.splice(index, 1)
    return true
  }
}

export const quizService = new QuizService()