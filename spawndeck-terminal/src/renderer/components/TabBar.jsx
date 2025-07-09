import React, { useState } from 'react';
import './TabBar.css';

function TabBar({ tabs, activeTab, onTabClick, onTabClose, onNewTab, onTabReorder }) {
  const [draggedTab, setDraggedTab] = useState(null);
  
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
    
    onTabReorder(newTabs, newActiveTab);
    setDraggedTab(null);
  };
  
  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`tab ${activeTab === index ? 'active' : ''} ${draggedTab === index ? 'dragging' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onClick={() => onTabClick(index)}
        >
          <span className="tab-title">{tab.title}</span>
          {tabs.length > 1 && (
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(index);
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button className="new-tab-button" onClick={onNewTab}>
        +
      </button>
    </div>
  );
}

export default TabBar;