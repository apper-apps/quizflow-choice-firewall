import { templates } from '@/services/mockData/templates.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TemplateService {
  constructor() {
    this.templates = [...templates]
  }

  async getAll() {
    await delay(350)
    return [...this.templates]
  }

  async getById(id) {
    await delay(250)
    const template = this.templates.find(t => t.Id === id)
    if (!template) {
      throw new Error('Template not found')
    }
    return { ...template }
  }

  async getByCategory(category) {
    await delay(300)
    return this.templates.filter(t => t.category === category)
  }
}

export const templateService = new TemplateService()