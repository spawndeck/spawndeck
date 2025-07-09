// React Terminal App with xterm.js
console.log('Terminal app loading...');

// Import themes
const themes = {
  default: {
    foreground: '#f8f8f2',
    background: '#1e1e1e',
    cursor: '#f8f8f0',
    black: '#000000',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#bfbfbf',
    brightBlack: '#4d4d4d',
    brightRed: '#ff6e67',
    brightGreen: '#5af78e',
    brightYellow: '#f4f99d',
    brightBlue: '#caa9fa',
    brightMagenta: '#ff92d0',
    brightCyan: '#9aedfe',
    brightWhite: '#e6e6e6'
  },
  dracula: {
    foreground: '#f8f8f2',
    background: '#282a36',
    cursor: '#f8f8f0',
    black: '#000000',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#bfbfbf',
    brightBlack: '#4d4d4d',
    brightRed: '#ff6e67',
    brightGreen: '#5af78e',
    brightYellow: '#f4f99d',
    brightBlue: '#caa9fa',
    brightMagenta: '#ff92d0',
    brightCyan: '#9aedfe',
    brightWhite: '#e6e6e6'
  },
  monokai: {
    foreground: '#f8f8f2',
    background: '#272822',
    cursor: '#f8f8f0',
    black: '#272822',
    red: '#f92672',
    green: '#a6e22e',
    yellow: '#f4bf75',
    blue: '#66d9ef',
    magenta: '#ae81ff',
    cyan: '#a1efe4',
    white: '#f8f8f2',
    brightBlack: '#75715e',
    brightRed: '#f92672',
    brightGreen: '#a6e22e',
    brightYellow: '#f4bf75',
    brightBlue: '#66d9ef',
    brightMagenta: '#ae81ff',
    brightCyan: '#a1efe4',
    brightWhite: '#f9f8f5'
  }
};

// Settings Modal
function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = React.useState(settings);
  
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#252526',
        borderRadius: '8px',
        padding: '20px',
        width: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid #464647'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#cccccc' }}>Settings</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
            Font Size
          </label>
          <input
            type="number"
            value={localSettings.fontSize}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              fontSize: parseInt(e.target.value) || 14
            })}
            style={{
              width: '100%',
              padding: '5px',
              background: '#3c3c3c',
              border: '1px solid #464647',
              borderRadius: '3px',
              color: '#cccccc'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
            Font Family
          </label>
          <input
            type="text"
            value={localSettings.fontFamily}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              fontFamily: e.target.value
            })}
            style={{
              width: '100%',
              padding: '5px',
              background: '#3c3c3c',
              border: '1px solid #464647',
              borderRadius: '3px',
              color: '#cccccc'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
            Theme
          </label>
          <select
            value={localSettings.theme}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              theme: e.target.value
            })}
            style={{
              width: '100%',
              padding: '5px',
              background: '#3c3c3c',
              border: '1px solid #464647',
              borderRadius: '3px',
              color: '#cccccc'
            }}
          >
            <option value="default">Default</option>
            <option value="dracula">Dracula</option>
            <option value="monokai">Monokai</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
            Shell
          </label>
          <input
            type="text"
            value={localSettings.shell}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              shell: e.target.value
            })}
            style={{
              width: '100%',
              padding: '5px',
              background: '#3c3c3c',
              border: '1px solid #464647',
              borderRadius: '3px',
              color: '#cccccc'
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '20px',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: '#3c3c3c',
              border: '1px solid #464647',
              borderRadius: '3px',
              color: '#cccccc',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '6px 16px',
              background: '#007acc',
              border: 'none',
              borderRadius: '3px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Terminal component
function Terminal({ terminalId, isActive, settings }) {
  const terminalRef = React.useRef(null);
  const xtermRef = React.useRef(null);
  const fitAddonRef = React.useRef(null);
  const terminalInstanceId = React.useRef(null);
  
  React.useEffect(() => {
    if (!terminalRef.current) return;
    
    // Only create terminal if it's active and we haven't created it yet
    if (isActive && !xtermRef.current) {
      console.log(`Creating terminal for tab ${terminalId}`);
      
      // Create terminal instance
      const term = new window.Terminal({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        theme: themes[settings.theme] || themes.default,
        cursorBlink: true,
        allowProposedApi: true
      });
      
      const fitAddon = new window.FitAddon.FitAddon();
      term.loadAddon(fitAddon);
      
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;
      
      term.open(terminalRef.current);
      
      // Initial fit
      setTimeout(() => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      }, 0);
      
      // Create terminal session
      window.electronAPI.terminal.create({ 
        id: `terminal-${terminalId}`,
        cols: term.cols, 
        rows: term.rows 
      }).then(response => {
        console.log('Terminal session created:', response);
        const id = `terminal-${terminalId}`;
        terminalInstanceId.current = id;
        
        // Handle data from terminal
        const removeDataListener = window.electronAPI.terminal.onData(id, (data) => {
          if (xtermRef.current) {
            xtermRef.current.write(data);
          }
        });
        
        // Handle terminal exit
        const removeExitListener = window.electronAPI.terminal.onExit(id, () => {
          if (xtermRef.current) {
            xtermRef.current.write('\r\n[Process completed]');
          }
        });
        
        // Send data to terminal
        term.onData((data) => {
          window.electronAPI.terminal.write(id, data);
        });
        
        // Handle resize
        term.onResize(({ cols, rows }) => {
          window.electronAPI.terminal.resize(id, cols, rows);
        });
        
        // Store cleanup functions
        xtermRef.current._cleanup = () => {
          removeDataListener();
          removeExitListener();
        };
      }).catch(error => {
        console.error('Failed to create terminal session:', error);
        term.write('\r\nFailed to create terminal session: ' + error.message + '\r\n');
      });
    }
    
    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current && isActive) {
        fitAddonRef.current.fit();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [terminalId, isActive, settings]);
  
  // Separate cleanup effect
  React.useEffect(() => {
    return () => {
      console.log(`Cleaning up terminal ${terminalId}`);
      if (terminalInstanceId.current) {
        window.electronAPI.terminal.kill(terminalInstanceId.current);
      }
      if (xtermRef.current) {
        if (xtermRef.current._cleanup) {
          xtermRef.current._cleanup();
        }
        xtermRef.current.dispose();
      }
    };
  }, [terminalId]);
  
  // Update terminal settings when they change
  React.useEffect(() => {
    if (xtermRef.current && settings) {
      xtermRef.current.options.fontSize = settings.fontSize;
      xtermRef.current.options.fontFamily = settings.fontFamily;
      xtermRef.current.options.theme = themes[settings.theme] || themes.default;
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    }
  }, [settings]);
  
  return (
    <div 
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        display: isActive ? 'block' : 'none',
        background: '#1e1e1e'
      }}
    />
  );
}

// Main App component
function App() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [tabs, setTabs] = React.useState([
    { id: 0, title: 'Terminal 1' }
  ]);
  const [draggedTab, setDraggedTab] = React.useState(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [settings, setSettings] = React.useState({
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: 'default',
    shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/bash'
  });
  
  // Load settings on mount
  React.useEffect(() => {
    window.electronAPI.settings.get().then(savedSettings => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);
  
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    window.electronAPI.settings.save(newSettings);
  };
  
  const createNewTab = () => {
    const newId = Math.max(...tabs.map(t => t.id), -1) + 1;
    setTabs([...tabs, { id: newId, title: `Terminal ${tabs.length + 1}` }]);
    setActiveTab(tabs.length);
  };
  
  const closeTab = (index, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    
    if (activeTab >= newTabs.length) {
      setActiveTab(newTabs.length - 1);
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };
  
  const handleDragStart = (e, index) => {
    setDraggedTab(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedTab === null || draggedTab === dropIndex) return;
    
    const newTabs = [...tabs];
    const [draggedItem] = newTabs.splice(draggedTab, 1);
    newTabs.splice(dropIndex, 0, draggedItem);
    
    // Update active tab index
    let newActiveTab = activeTab;
    if (activeTab === draggedTab) {
      newActiveTab = dropIndex;
    } else if (draggedTab < activeTab && dropIndex >= activeTab) {
      newActiveTab = activeTab - 1;
    } else if (draggedTab > activeTab && dropIndex <= activeTab) {
      newActiveTab = activeTab + 1;
    }
    
    setTabs(newTabs);
    setActiveTab(newActiveTab);
    setDraggedTab(null);
  };
  
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleNewTab = () => createNewTab();
    const unsubscribe = window.electronAPI.onShortcut('cmd+t', handleNewTab);
    return unsubscribe;
  }, [tabs]);
  
  React.useEffect(() => {
    const handleCloseTab = () => {
      if (tabs.length > 1) {
        closeTab(activeTab, { stopPropagation: () => {} });
      }
    };
    const unsubscribe = window.electronAPI.onShortcut('cmd+w', handleCloseTab);
    return unsubscribe;
  }, [activeTab, tabs]);
  
  // Settings shortcut
  React.useEffect(() => {
    const handleSettings = () => setShowSettings(true);
    const unsubscribe = window.electronAPI.onShortcut('cmd+,', handleSettings);
    return unsubscribe;
  }, []);
  
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#1e1e1e',
      color: '#cccccc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        background: '#252526',
        borderBottom: '1px solid #464647',
        paddingTop: '5px',
        paddingLeft: '80px',
        minHeight: '35px',
        alignItems: 'center',
        WebkitAppRegion: 'drag'
      }}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => setActiveTab(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              paddingRight: tabs.length > 1 ? '24px' : '12px',
              background: activeTab === index ? '#1e1e1e' : '#2d2d30',
              borderTop: activeTab === index ? '1px solid #007acc' : '1px solid transparent',
              borderLeft: '1px solid #464647',
              borderRight: '1px solid #464647',
              cursor: 'pointer',
              fontSize: '13px',
              marginRight: '1px',
              position: 'relative',
              WebkitAppRegion: 'no-drag',
              opacity: draggedTab === index ? 0.5 : 1
            }}
          >
            {tab.title}
            {tabs.length > 1 && (
              <button
                onClick={(e) => closeTab(index, e)}
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#cccccc',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '0 4px',
                  opacity: 0.6,
                  lineHeight: '1'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.6'}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={createNewTab}
          style={{
            background: 'none',
            border: 'none',
            color: '#cccccc',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 10px',
            opacity: 0.6,
            WebkitAppRegion: 'no-drag'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.6'}
        >
          +
        </button>
      </div>
      
      {/* Terminal Area */}
      <div style={{ 
        flex: 1, 
        padding: '0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {tabs.map((tab, index) => (
          <Terminal 
            key={tab.id}
            terminalId={tab.id}
            isActive={index === activeTab}
            settings={settings}
          />
        ))}
      </div>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

// Render the app
console.log('Rendering terminal app...');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
console.log('Terminal app rendered');