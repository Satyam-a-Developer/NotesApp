'use client'
import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from '@dnd-kit/core';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

function Draggable({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: 'grab',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#f0f0f0',
    margin: '8px',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    border: isOver ? '2px dashed #4caf50' : '2px dashed #ccc',
    padding: '16px',
    borderRadius: '4px',
    background: isOver ? '#e8f5e9' : '#fff',
    minHeight: '100px',
    textAlign: 'center',
  };

  return (
    <div ref={setNodeRef} style={style}>
              {children}
    </div>
  );
}

export default function DragDrop() {
  const [draggableItems, setDraggableItems] = useState<string[]>([
    'item-1',
    'item-2',
    'item-3',
  ]);
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) return;

    if (over.id === 'dropzone') {
      // Move item from draggableItems to droppedItems
      setDraggableItems((items) => items.filter((item) => item !== active.id));
      setDroppedItems((items) => [...items, active.id]);
    } else if (over.id === 'draggable-list') {
      // Remove item from droppedItems and add back to draggableItems
      setDroppedItems((items) => items.filter((item) => item !== active.id));
      setDraggableItems((items) => [...items, active.id]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px' }}>
        {/* Draggable Items List */}
        <Droppable id="draggable-list">
          <h3>Draggable Items</h3>
          {draggableItems.map((item) => (
            <Draggable key={item} id={item}>
              {item}
            </Draggable>
          ))}
        </Droppable>

        {/* Droppable Zone */}
        <Droppable id="dropzone">
          <h3>Drop Here</h3>
          {droppedItems.map((item) => (
            <Draggable key={item} id={item}>
              {item}
            </Draggable>
          ))}
        </Droppable>
      </div>
    </DndContext>
  );
}

     
