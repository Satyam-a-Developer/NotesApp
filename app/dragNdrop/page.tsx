"use client";
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";

// Interface for the draggable component
interface DraggableProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function Draggable({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: "grab",
    padding: "8px",
    border: "10px solid #ccc",
    borderRadius: "10px",
    background: "black",
    margin: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

// Interface for the droppable component
interface DroppableProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    border: isOver ? "2px dashed #4caf50" : "2px dashed #ccc",
    padding: "16px",
    borderRadius: "4px",
    background: isOver ? "#e8f5e9" : "#fff",
    minHeight: "100px",
    textAlign: "center",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default function DragDrop() {
  const [newItem, setNewItem] = useState<string>("");
  const [draggableItems, setDraggableItems] = useState<UniqueIdentifier[]>([]);
  const [droppedItems, setDroppedItems] = useState<UniqueIdentifier[]>([]);

  function addItem() {
    if (!newItem) return;
    
    // Add item to draggableItems
    const newId = newItem;  // Unique ID here can be a UUID or any other unique string
    setDraggableItems([...draggableItems, newId]);

    // Reset input field
    setNewItem("");
  }

  // Handle the drag end event with correct type
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) return;

    // Move item between draggable and dropped lists
    if (over.id === "dropzone" && draggableItems.includes(active.id)) {
      setDraggableItems((items) =>
        items.filter((item) => item !== active.id)
      );
      setDroppedItems((items) => [...items, active.id]);
    } else if (
      over.id === "draggable-list" &&
      droppedItems.includes(active.id)
    ) {
      setDroppedItems((items) =>
        items.filter((item) => item !== active.id)
      );
      setDraggableItems((items) => [...items, active.id]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 items-center justify-center mt-12">
        <input
          type="text"
          placeholder="Add a new item"
          className="text-red-600 text-[30px] h-[100px] w-[300px] rounded-md p-10"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem} className="bg-red-500 p-2 rounded-md">
          Add
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px",
        }}
      >
        <Droppable id="draggable-list">
          <h3 className="text-red-700 text-2xl">Draggable Items</h3>
          {draggableItems.map((item) => (
            <Draggable key={item} id={item}>
              {String(item)}
            </Draggable>
          ))}
        </Droppable>

        {/* Droppable Zone */}
        <Droppable id="dropzone">
          <h3 className="text-red-700 text-2xl">Drop Here</h3>
          {droppedItems.map((item) => (
            <Draggable key={item} id={item}>
              {String(item)}
            </Draggable>
          ))}
        </Droppable>
      </div>
    </DndContext>
  );
}
