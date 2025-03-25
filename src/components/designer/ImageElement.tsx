
import React from "react";
import { ImageElement as ImageElementType } from "@/types/designer";
import DraggableElement from "@/components/ui/DraggableElement";
import ResizableElement from "@/components/ui/ResizableElement";
import { useCanvasStore } from "@/lib/canvas-state";
import { Image } from "@/components/ui/avatar";

interface ImageElementProps {
  element: ImageElementType;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { id, position, src, aspectRatio, alt, locked } = element;

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
        preserveAspectRatio={true}
        onPositionChange={handleSizeChange}
        onRotationChange={handleRotationChange}
      >
        <div className="w-full h-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </ResizableElement>
    </DraggableElement>
  );
};

export default ImageElement;
