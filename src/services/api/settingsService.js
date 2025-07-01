import { settings } from '@/services/mockData/settings.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SettingsService {
  constructor() {
    this.settings = { ...settings }
  }

  async getSettings() {
    await delay(250)
    return { ...this.settings }
  }

  async updateSettings(updates) {
    await delay(400)
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.settings }
  }
}

export const settingsService = new SettingsService()