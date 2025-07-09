import React, { useState, useEffect } from 'react';
import TabBar from './components/TabBar';
import Terminal from './components/Terminal';
import SettingsModal from './components/SettingsModal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 0, title: 'Terminal 1' }
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: 'default',
    shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/bash'
  });

  // Load settings on mount
  useEffect(() => {
    window.electronAPI?.settings.get().then(savedSettings => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    window.electronAPI?.settings.save(newSettings);
  };

  const createNewTab = () => {
    const newId = Math.max(...tabs.map(t => t.id), -1) + 1;
    setTabs([...tabs, { id: newId, title: `Terminal ${tabs.length + 1}` }]);
    setActiveTab(tabs.length);
  };

  const closeTab = (index) => {
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    
    if (activeTab >= newTabs.length) {
      setActiveTab(newTabs.length - 1);
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const unsubscribeNewTab = window.electronAPI?.onShortcut('cmd+t', createNewTab);
    const unsubscribeSettings = window.electronAPI?.onShortcut('cmd+,', () => setShowSettings(true));
    
    return () => {
      unsubscribeNewTab?.();
      unsubscribeSettings?.();
    };
  }, [tabs]);

  useEffect(() => {
    const handleCloseTab = () => {
      if (tabs.length > 1) {
        closeTab(activeTab);
      }
    };
    const unsubscribe = window.electronAPI?.onShortcut('cmd+w', handleCloseTab);
    return () => unsubscribe?.();
  }, [activeTab, tabs]);

  return (
    <div className="app">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onNewTab={createNewTab}
        onTabReorder={(newTabs, newActiveIndex) => {
          setTabs(newTabs);
          setActiveTab(newActiveIndex);
        }}
      />
      
      <div className="terminal-container">
        {tabs.map((tab, index) => (
          <Terminal
            key={tab.id}
            terminalId={tab.id}
            isActive={index === activeTab}
            settings={settings}
          />
        ))}
      </div>
      
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;