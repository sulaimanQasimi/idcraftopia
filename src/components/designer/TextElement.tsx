import React, { useState, useEffect, useRef } from "react";
import { TextElement as TextElementType } from "@/types/designer";
import DraggableElement from "@/components/ui/DraggableElement";
import ResizableElement from "@/components/ui/ResizableElement";
import { useCanvasStore } from "@/lib/canvas-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextElementProps {
  element: TextElementType;
}

const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const {
    id,
    position,
    text,
    fontSize,
    fontFamily,
    color,
    fontWeight,
    fontStyle,
    textDecoration,
    textAlign,
    direction,
    locked,
  } = element;

  const { selectedElementId, selectElement, updateElement } = useCanvasStore();
  const isSelected = selectedElementId === id;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle position change
  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    updateElement(id, { position: { ...position, ...newPosition } });
  };

  // Handle size change
  const handleSizeChange = (newSize: { width: number; height: number }) => {
    updateElement(id, { position: { ...position, ...newSize } });
  };

  // Handle rotation change
  const handleRotationChange = (rotation: number) => {
    updateElement(id, { position: { ...position, rotation } });
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  // Handle text save
  const handleTextSave = () => {
    updateElement(id, { text: editText });
    setIsEditing(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSave();
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color,
    fontWeight,
    fontStyle,
    textDecoration,
    textAlign,
    direction,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
    padding: '4px',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    cursor: isEditing ? 'text' : 'move',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <DraggableElement
      position={{ x: position.x, y: position.y }}
      locked={locked}
      selected={isSelected}
      onPositionChange={handlePositionChange}
      onSelect={() => selectElement(id)}
    >
      <ResizableElement
        position={position}
        locked={locked}
        preserveAspectRatio={false}
        onPositionChange={handleSizeChange}
        onRotationChange={handleRotationChange}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={handleTextChange}
            onBlur={handleTextSave}
            onKeyDown={handleKeyPress}
            style={textStyle}
          />
        ) : (
          <div
            style={textStyle}
            onDoubleClick={() => setIsEditing(true)}
          >
            {text}
          </div>
        )}
      </ResizableElement>
    </DraggableElement>
  );
};

export default TextElement;
