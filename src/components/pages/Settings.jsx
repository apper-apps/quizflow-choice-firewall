import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { settingsService } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings')
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      await settingsService.updateSettings(settings)
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSettings} />
  if (!settings) return <Error message="Settings not found" />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Settings
        </h1>
        <p className="text-slate-600">
          Manage your QuizFlow Pro preferences and configurations.
        </p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ApperIcon name="Settings" className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              General Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={settings.companyName || ''}
              onChange={(e) => updateSetting('companyName', e.target.value)}
              placeholder="Your Company Name"
            />
            
            <Input
              label="Default Quiz Title"
              value={settings.defaultQuizTitle || ''}
              onChange={(e) => updateSetting('defaultQuizTitle', e.target.value)}
              placeholder="Untitled Quiz"
            />
            
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => updateSetting('contactEmail', e.target.value)}
              placeholder="contact@company.com"
            />
            
            <Input
              label="Website URL"
              type="url"
              value={settings.websiteUrl || ''}
              onChange={(e) => updateSetting('websiteUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </Card>

        {/* Quiz Defaults */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <ApperIcon name="MessageSquare" className="w-5 h-5 text-secondary-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Quiz Defaults
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Default Progress Type
                </label>
                <select
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  value={settings.defaultProgressType || 'bar'}
                  onChange={(e) => updateSetting('defaultProgressType', e.target.value)}
                >
                  <option value="bar">Progress Bar</option>
                  <option value="circular">Circular Progress</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Default Progress Color
                </label>
                <select
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  value={settings.defaultProgressColor || 'primary'}
                  onChange={(e) => updateSetting('defaultProgressColor', e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="accent">Accent</option>
                  <option value="success">Success</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="mobileOnly"
                checked={settings.defaultMobileOnly || false}
                onChange={(e) => updateSetting('defaultMobileOnly', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="mobileOnly" className="text-sm font-medium text-slate-700">
                Mobile-only quizzes by default
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="cookieTracking"
                checked={settings.defaultCookieTracking || false}
                onChange={(e) => updateSetting('defaultCookieTracking', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="cookieTracking" className="text-sm font-medium text-slate-700">
                Enable cookie tracking by default
              </label>
            </div>
          </div>
        </Card>

        {/* Integration Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-accent-100 rounded-lg">
              <ApperIcon name="Zap" className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Integrations
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Facebook Pixel ID"
                value={settings.facebookPixelId || ''}
                onChange={(e) => updateSetting('facebookPixelId', e.target.value)}
                placeholder="123456789012345"
              />
              
              <Input
                label="Google Analytics ID"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                placeholder="GA-XXXXXXXXX-X"
              />
              
              <Input
                label="Webhook URL"
                value={settings.webhookUrl || ''}
                onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                placeholder="https://your-webhook-url.com"
              />
              
              <Input
                label="API Key"
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => updateSetting('apiKey', e.target.value)}
                placeholder="Your API key"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            icon="Save"
            loading={saving}
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Settings