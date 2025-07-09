import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './TabBar.css'

const SortableTab = ({ tab, isActive, onTabClick, onTabClose }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tab.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onTabClick(tab.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div
        className="tab-drag-handle"
        {...attributes}
        {...listeners}
      >
        <span className="tab-title">{tab.title}</span>
      </div>
      <button
        className="tab-close"
        onClick={(e) => {
          e.stopPropagation()
          onTabClose(tab.id)
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  )
}

const TabBar = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabCreate,
  onTabsReorder
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
      const newIndex = tabs.findIndex((tab) => tab.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onTabsReorder(arrayMove(tabs, oldIndex, newIndex))
      }
    }
  }

  return (
    <div className="tab-bar">
      <div className="tabs-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tabs.map(tab => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onTabClick={onTabClick}
                onTabClose={onTabClose}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button className="tab-add" onClick={() => onTabCreate()}>
          +
        </button>
      </div>
    </div>
  )
}

export default TabBar