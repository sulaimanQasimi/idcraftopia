
import React from "react";
import { ShapeElement as ShapeElementType } from "@/types/designer";
import DraggableElement from "@/components/ui/DraggableElement";
import ResizableElement from "@/components/ui/ResizableElement";
import { useCanvasStore } from "@/lib/canvas-state";

interface ShapeElementProps {
  element: ShapeElementType;
}

const ShapeElement: React.FC<ShapeElementProps> = ({ element }) => {
  const {
    id,
    position,
    shape,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    locked,
  } = element;

  const { selectedElementId, selectElement, updateElement } = useCanvasStore();
  const isSelected = selectedElementId === id;

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

  const shapeStyle = {
    width: "100%",
    height: "100%",
    backgroundColor,
    border: `${borderWidth}px solid ${borderColor}`,
    borderRadius: shape === "circle" ? "50%" : `${borderRadius}px`,
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
        preserveAspectRatio={shape === "circle"}
        onPositionChange={handleSizeChange}
        onRotationChange={handleRotationChange}
      >
        <div style={shapeStyle}></div>
      </ResizableElement>
    </DraggableElement>
  );
};

export default ShapeElement;
