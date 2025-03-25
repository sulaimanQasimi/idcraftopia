
import React, { useState, useEffect, useRef } from "react";
import { TextElement as TextElementType } from "@/types/designer";
import DraggableElement from "@/components/ui/DraggableElement";
import ResizableElement from "@/components/ui/ResizableElement";
import { useCanvasStore } from "@/lib/canvas-state";
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
    locked,
  } = element;

  const { selectedElementId, selectElement, updateElement } = useCanvasStore();
  const isSelected = selectedElementId === id;
  const textRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle double click to enable text editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (locked) return;
    e.stopPropagation();
    selectElement(id);
    setIsEditing(true);
  };

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

  // Handle text editing completion
  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      updateElement(id, { text: textRef.current.innerText });
    }
  };

  // Focus the text element when entering edit mode
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      
      // Set the cursor at the end of the text
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

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
        onPositionChange={handleSizeChange}
        onRotationChange={handleRotationChange}
      >
        <div 
          className={cn(
            "w-full h-full overflow-hidden outline-none",
            isEditing ? "cursor-text" : "cursor-move"
          )}
          onDoubleClick={handleDoubleClick}
        >
          <div
            ref={textRef}
            contentEditable={isEditing}
            onBlur={handleBlur}
            style={{
              width: "100%",
              height: "100%",
              fontSize: `${fontSize}px`,
              fontFamily,
              color,
              fontWeight,
              fontStyle,
              textDecoration,
              textAlign,
              display: "flex",
              alignItems: "center",
              justifyContent: textAlign === "center" ? "center" : 
                              textAlign === "right" ? "flex-end" : "flex-start"
            }}
            suppressContentEditableWarning
          >
            {text}
          </div>
        </div>
      </ResizableElement>
    </DraggableElement>
  );
};

export default TextElement;
