import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

function SettingsModal({ settings, onSave, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);
  
  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  
  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        
        <div className="settings-group">
          <label>Font Size</label>
          <input
            type="number"
            value={localSettings.fontSize}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              fontSize: parseInt(e.target.value) || 14
            })}
            min="8"
            max="32"
          />
        </div>
        
        <div className="settings-group">
          <label>Font Family</label>
          <input
            type="text"
            value={localSettings.fontFamily}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              fontFamily: e.target.value
            })}
          />
        </div>
        
        <div className="settings-group">
          <label>Theme</label>
          <select
            value={localSettings.theme}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              theme: e.target.value
            })}
          >
            <option value="default">Default</option>
            <option value="dracula">Dracula</option>
            <option value="monokai">Monokai</option>
            <option value="atomOneDark">Atom One Dark</option>
            <option value="nord">Nord</option>
          </select>
        </div>
        
        <div className="settings-group">
          <label>Shell</label>
          <input
            type="text"
            value={localSettings.shell}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              shell: e.target.value
            })}
          />
        </div>
        
        <div className="settings-actions">
          <button className="settings-button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="settings-button primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;