import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebglAddon } from 'xterm-addon-webgl'
import { useTerminalStore } from '../stores/terminalStore.js'
import 'xterm/css/xterm.css'
import './Terminal.css'

const Terminal = ({ tabId, isActive }) => {
  const terminalRef = useRef(null)
  const xtermRef = useRef(null)
  const fitAddonRef = useRef(null)
  const { updateTabTitle } = useTerminalStore()

  useEffect(() => {
    if (!terminalRef.current || !window.electronAPI) return

    const terminal = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        brightBlack: '#666666',
        red: '#cd3131',
        brightRed: '#f14c4c',
        green: '#0dbc79',
        brightGreen: '#23d18b',
        yellow: '#e5e510',
        brightYellow: '#f5f543',
        blue: '#2472c8',
        brightBlue: '#3b8eea',
        magenta: '#bc3fbc',
        brightMagenta: '#d670d6',
        cyan: '#11a8cd',
        brightCyan: '#29b8db',
        white: '#e5e5e5',
        brightWhite: '#ffffff'
      }
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    // Try to load WebGL addon for better performance
    try {
      const webglAddon = new WebglAddon()
      webglAddon.onContextLoss(() => {
        webglAddon.dispose()
      })
      terminal.loadAddon(webglAddon)
    } catch (e) {
      console.warn('WebGL addon failed to load:', e)
    }

    terminal.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = terminal
    fitAddonRef.current = fitAddon

    // Create the terminal process
    window.electronAPI.terminal.create({ id: tabId })

    // Handle terminal output
    const unsubscribeData = window.electronAPI.terminal.onData(tabId, (data) => {
      terminal.write(data)
    })

    // Handle terminal input
    terminal.onData((data) => {
      window.electronAPI.terminal.write(tabId, data)
    })

    // Handle terminal exit
    const unsubscribeExit = window.electronAPI.terminal.onExit(tabId, () => {
      terminal.write('\r\n[Process completed]\r\n')
    })

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit()
        const { cols, rows } = xtermRef.current
        window.electronAPI.terminal.resize(tabId, cols, rows)
      }
    }

    window.addEventListener('resize', handleResize)
    
    // Initial resize
    setTimeout(handleResize, 100)

    // Update tab title based on terminal title
    terminal.onTitleChange((title) => {
      updateTabTitle(tabId, title || 'Terminal')
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      unsubscribeData()
      unsubscribeExit()
      window.electronAPI.terminal.kill(tabId)
      terminal.dispose()
    }
  }, [tabId, updateTabTitle])

  // Handle focus when tab becomes active
  useEffect(() => {
    if (isActive && xtermRef.current) {
      xtermRef.current.focus()
    }
  }, [isActive])

  return <div ref={terminalRef} className="terminal" />
}

export default Terminal