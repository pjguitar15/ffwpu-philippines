/**
 * Authentication Flow Test
 * 
 * This page can be used to test the auth dropdown refresh functionality
 */

'use client'

import { useState } from 'react'

export default function AuthTestPage() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const testLogin = async () => {
    addLog('Testing login...')
    try {
      const response = await fetch('/api/auth/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'philtest@test.com',
          password: 'password123'
        })
      })

      if (response.ok) {
        addLog('✅ Login successful!')
        window.dispatchEvent(new CustomEvent('auth-login'))
        addLog('🔄 Dispatched auth-login event')
      } else {
        const data = await response.json()
        addLog(`❌ Login failed: ${data.error}`)
      }
    } catch (error: any) {
      addLog(`❌ Login error: ${error.message}`)
    }
  }

  const testLogout = async () => {
    addLog('Testing logout...')
    try {
      const response = await fetch('/api/auth/member/logout', {
        method: 'POST'
      })

      if (response.ok) {
        addLog('✅ Logout successful!')
        window.dispatchEvent(new CustomEvent('auth-logout'))
        addLog('🔄 Dispatched auth-logout event')
      } else {
        addLog('❌ Logout failed')
      }
    } catch (error: any) {
      addLog(`❌ Logout error: ${error.message}`)
    }
  }

  const testAuthCheck = async () => {
    addLog('Checking auth status...')
    try {
      const response = await fetch('/api/auth/member/me')
      
      if (response.ok) {
        const data = await response.json()
        addLog(`✅ Authenticated as: ${data.member.fullName}`)
      } else {
        addLog('❌ Not authenticated')
      }
    } catch (error: any) {
      addLog(`❌ Auth check error: ${error.message}`)
    }
  }

  const refreshAuthDropdown = () => {
    addLog('Manually refreshing auth dropdown...')
    if ((window as any).refreshAuth) {
      (window as any).refreshAuth()
      addLog('🔄 Called window.refreshAuth()')
    } else {
      addLog('❌ refreshAuth function not available')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Authentication Flow Test
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Login
            </button>
            <button
              onClick={testLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Test Logout
            </button>
            <button
              onClick={testAuthCheck}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Check Auth
            </button>
            <button
              onClick={refreshAuthDropdown}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Dropdown
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Instructions</h2>
          <ol className="space-y-2 text-blue-800">
            <li>1. Watch the Account dropdown in the navigation bar</li>
            <li>2. Click "Test Login" - dropdown should update to show user's name</li>
            <li>3. Click "Test Logout" - dropdown should revert to "Account"</li>
            <li>4. The dropdown should refresh automatically without page reload</li>
            <li>5. Check the logs below for detailed information</li>
          </ol>
        </div>

        {/* Event Listeners Status */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Event Listeners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Custom Events:</strong>
              <ul className="mt-2 space-y-1">
                <li>• auth-login (dispatched after successful login)</li>
                <li>• auth-logout (dispatched after logout)</li>
              </ul>
            </div>
            <div>
              <strong>Browser Events:</strong>
              <ul className="mt-2 space-y-1">
                <li>• window focus (refreshes auth)</li>
                <li>• page visibility change (refreshes auth)</li>
                <li>• localStorage changes (refreshes auth)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}