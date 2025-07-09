import { contextBridge, ipcRenderer } from 'electron'

console.log('=== PRELOAD SCRIPT STARTING ===')
console.log('Preload script loading...')
console.log('Process contextIsolated:', process.contextIsolated)
console.log('Process type:', process.type)
console.log('Electron version:', process.versions.electron)

const electronAPI = {
  terminal: {
    create: (options) => {
      console.log('Preload: terminal.create called with:', options)
      return ipcRenderer.invoke('terminal:create', options)
    },
    write: (id, data) => {
      console.log('Preload: terminal.write called')
      return ipcRenderer.invoke('terminal:write', { id, data })
    },
    resize: (id, cols, rows) => {
      console.log('Preload: terminal.resize called')
      return ipcRenderer.invoke('terminal:resize', { id, cols, rows })
    },
    kill: (id) => {
      console.log('Preload: terminal.kill called for:', id)
      return ipcRenderer.invoke('terminal:kill', { id })
    },
    onData: (id, callback) => {
      console.log('Preload: terminal.onData listener registered')
      const channel = `terminal:data:${id}`
      ipcRenderer.on(channel, (_, data) => callback(data))
      return () => ipcRenderer.removeAllListeners(channel)
    },
    onExit: (id, callback) => {
      console.log('Preload: terminal.onExit listener registered')
      const channel = `terminal:exit:${id}`
      ipcRenderer.on(channel, callback)
      return () => ipcRenderer.removeAllListeners(channel)
    }
  }
}

// Expose the API to the renderer process
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    console.log('electronAPI successfully exposed via contextBridge')
    
    // Mark that preload script has loaded
    contextBridge.exposeInMainWorld('PRELOAD_LOADED', true)
  } catch (error) {
    console.error('Failed to expose API:', error)
  }
} else {
  console.error('Context isolation is not enabled\!')
}

console.log('End of preload script')
EOF < /dev/null