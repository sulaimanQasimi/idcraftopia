
import React, { useState, useRef, useEffect } from "react";

interface ResizableElementProps {
  children: React.ReactNode;
  position: { x: number; y: number; width: number; height: number; rotation: number };
  locked?: boolean;
  preserveAspectRatio?: boolean;
  minWidth?: number;
  minHeight?: number;
  onPositionChange: (position: { width: number; height: number }) => void;
  onRotationChange?: (rotation: number) => void;
}

type ResizeHandle = "tl" | "tr" | "bl" | "br" | "rotate" | null;

const ResizableElement: React.FC<ResizableElementProps> = ({
  children,
  position,
  locked = false,
  preserveAspectRatio = false,
  minWidth = 20,
  minHeight = 20,
  onPositionChange,
  onRotationChange,
}) => {
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const startAngleRef = useRef(0);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current || locked) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      if (isResizing === "rotate" && onRotationChange) {
        // Calculate rotation based on mouse position relative to element center
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        onRotationChange(angle + 90); // +90 to make top the 0 degree
        return;
      }
      
      // Handle resizing
      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;
      
      switch (isResizing) {
        case "br":
          newWidth = Math.max(minWidth, startPosRef.current.width + (e.clientX - startPosRef.current.x));
          newHeight = Math.max(minHeight, startPosRef.current.height + (e.clientY - startPosRef.current.y));
          break;
        case "bl":
          newWidth = Math.max(minWidth, startPosRef.current.width - (e.clientX - startPosRef.current.x));
          newHeight = Math.max(minHeight, startPosRef.current.height + (e.clientY - startPosRef.current.y));
          break;
        case "tr":
          newWidth = Math.max(minWidth, startPosRef.current.width + (e.clientX - startPosRef.current.x));
          newHeight = Math.max(minHeight, startPosRef.current.height - (e.clientY - startPosRef.current.y));
          break;
        case "tl":
          newWidth = Math.max(minWidth, startPosRef.current.width - (e.clientX - startPosRef.current.x));
          newHeight = Math.max(minHeight, startPosRef.current.height - (e.clientY - startPosRef.current.y));
          break;
      }
      
      // Maintain aspect ratio if required
      if (preserveAspectRatio) {
        const originalAspectRatio = startPosRef.current.width / startPosRef.current.height;
        if (newWidth / newHeight > originalAspectRatio) {
          newWidth = newHeight * originalAspectRatio;
        } else {
          newHeight = newWidth / originalAspectRatio;
        }
      }
      
      onPositionChange({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, locked, minHeight, minWidth, onPositionChange, onRotationChange, preserveAspectRatio]);

  const handleResizeStart = (handle: ResizeHandle) => (e: React.MouseEvent) => {
    if (locked) return;
    e.stopPropagation();
    setIsResizing(handle);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: position.width,
      height: position.height,
    };
  };

  if (locked) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div 
      ref={elementRef}
      className="relative w-full h-full"
      style={{ transform: `rotate(${position.rotation}deg)` }}
    >
      {children}
      
      <div className="resize-handle resize-handle-tl" onMouseDown={handleResizeStart("tl")}></div>
      <div className="resize-handle resize-handle-tr" onMouseDown={handleResizeStart("tr")}></div>
      <div className="resize-handle resize-handle-bl" onMouseDown={handleResizeStart("bl")}></div>
      <div className="resize-handle resize-handle-br" onMouseDown={handleResizeStart("br")}></div>
      
      {onRotationChange && (
        <div 
          className="rotate-handle"
          onMouseDown={handleResizeStart("rotate")}
        ></div>
      )}
    </div>
  );
};

export default ResizableElement;
