import React, { useState, useEffect } from 'react'
import TabBar from './components/TabBar.js'
import Terminal from './components/Terminal.js'
import { useTerminalStore } from './stores/terminalStore.js'
import { useThemeStore } from './stores/themeStore.js'
import './App.css'

function App() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    console.log('App useEffect - checking preload...')
    console.log('window.PRELOAD_LOADED:', window.PRELOAD_LOADED)
    console.log('window.electronAPI:', window.electronAPI)
    console.log('window object keys:', Object.keys(window))
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="app" style={{ padding: 20, color: 'white' }}>Loading...</div>
  }

  return <AppContent />
}

function AppContent() {
  const { tabs, activeTabId, createTab, closeTab, setActiveTab, reorderTabs } = useTerminalStore()
  const { currentTheme } = useThemeStore()

  useEffect(() => {
    console.log('App mounted, tabs:', tabs.length)
    // Create initial tab on mount
    if (tabs.length === 0) {
      console.log('Creating initial tab...')
      createTab()
    }
  }, [])

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  return (
    <div className="app">
      <div className="app-header">
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={setActiveTab}
          onTabClose={closeTab}
          onTabCreate={createTab}
          onTabsReorder={reorderTabs}
        />
      </div>
      <div className="app-content">
        {activeTab && (
          <Terminal
            key={activeTab.id}
            tabId={activeTab.id}
            isActive={true}
          />
        )}
      </div>
    </div>
  )
}

export default App