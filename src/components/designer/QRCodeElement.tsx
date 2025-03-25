
import React, { useEffect, useState } from "react";
import { QRCodeElement as QRCodeElementType } from "@/types/designer";
import DraggableElement from "@/components/ui/DraggableElement";
import ResizableElement from "@/components/ui/ResizableElement";
import { useCanvasStore } from "@/lib/canvas-state";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeElementProps {
  element: QRCodeElementType;
}

const QRCodeElement: React.FC<QRCodeElementProps> = ({ element }) => {
  const { id, position, value, backgroundColor, foregroundColor, locked } = element;
  const [qrValue, setQrValue] = useState(value);

  const { selectedElementId, selectElement, updateElement } = useCanvasStore();
  const isSelected = selectedElementId === id;

  // Ensure the QR code has a valid value
  useEffect(() => {
    if (!value || value.trim() === "") {
      setQrValue("https://example.com");
    } else {
      setQrValue(value);
    }
  }, [value]);

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
        <div className="w-full h-full flex items-center justify-center bg-white">
          <QRCodeCanvas
            value={qrValue}
            size={Math.min(position.width, position.height) * 0.9} // Make QR code slightly smaller than container
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level="M"
            includeMargin={false}
          />
        </div>
      </ResizableElement>
    </DraggableElement>
  );
};

export default QRCodeElement;
