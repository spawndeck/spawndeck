import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
const { themes } = require('../utils/themes');
import './Terminal.css';

function Terminal({ terminalId, isActive, settings }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const terminalInstanceId = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!terminalRef.current || !isActive) return;
    if (xtermRef.current) return; // Already initialized
    
    console.log(`Creating terminal for tab ${terminalId}`);
    
    // Create terminal instance
    const term = new XTerm({
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      theme: themes[settings.theme] || themes.default,
      cursorBlink: true,
      allowProposedApi: true
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    
    term.open(terminalRef.current);
    
    // Initial fit after a short delay
    setTimeout(() => {
      fitAddon.fit();
      
      // Create terminal session
      const id = `term-${terminalId}`;
      window.electronAPI.terminal.create({ 
        id: id,
        cols: term.cols, 
        rows: term.rows 
      }).then(() => {
        console.log('Terminal session created:', id);
        terminalInstanceId.current = id;
        setIsConnected(true);
        
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
          setIsConnected(false);
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
        setIsConnected(false);
      });
    }, 100);
    
    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current && isActive) {
        fitAddonRef.current.fit();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [terminalId, isActive, settings]);
  
  // Cleanup on unmount
  useEffect(() => {
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
  useEffect(() => {
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
      className={`terminal ${isActive ? 'active' : ''}`}
      ref={terminalRef}
    />
  );
}

export default Terminal;