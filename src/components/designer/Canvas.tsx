import React, { useRef, useEffect, useState } from "react";
import { useCanvasStore } from "@/lib/canvas-state";
import TextElement from "./TextElement";
import ShapeElement from "./ShapeElement";
import ImageElement from "./ImageElement";
import QRCodeElement from "./QRCodeElement";
import BarcodeElement from "./BarcodeElement";
import { DesignerElement } from "@/types/designer";
import { toast } from "sonner";

interface CanvasProps {
  className?: string;
}

const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const { width, height, elements, selectedElementId, selectElement } = useCanvasStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Function to ensure the canvas is centered in the viewport
  const centerCanvas = () => {
    if (!canvasRef.current) return;
    
    const containerWidth = canvasRef.current.parentElement?.clientWidth || window.innerWidth;
    const containerHeight = canvasRef.current.parentElement?.clientHeight || window.innerHeight;
    
    // Calculate the translation needed to center the canvas
    const offsetX = (containerWidth - width * scale) / 2;
    const offsetY = (containerHeight - height * scale) / 2;
    
    setCanvasOffset({ x: offsetX, y: offsetY });
  };

  // Center the canvas initially and when window is resized
  useEffect(() => {
    centerCanvas();
    window.addEventListener("resize", centerCanvas);
    return () => window.removeEventListener("resize", centerCanvas);
  }, [width, height, scale]);

  // Handle click on the canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas (not on an element)
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  };

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start panning if middle mouse button is pressed or spacebar is held
    if (e.button === 1 || e.altKey) {
      e.preventDefault();
      setIsPanning(true);
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastPositionRef.current.x;
    const deltaY = e.clientY - lastPositionRef.current.y;
    
    setCanvasOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle wheel event for zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(0.1, scale + delta), 3);
      
      setScale(newScale);
    }
  };

  // Render the appropriate element component based on element type
  const renderElement = (element: DesignerElement) => {
    switch (element.type) {
      case "text":
        return <TextElement key={element.id} element={element} />;
      case "shape":
        return <ShapeElement key={element.id} element={element} />;
      case "image":
        return <ImageElement key={element.id} element={element} />;
      case "qrcode":
        return <QRCodeElement key={element.id} element={element} />;
      case "barcode":
        return <BarcodeElement key={element.id} element={element} />;
      default:
        return null;
    }
  };

  // Capture keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLElement && e.target.isContentEditable
      ) {
        return;
      }
      
      // Handle keyboard shortcuts
      const ctrlKey = e.ctrlKey || e.metaKey; // Support both Ctrl and Command (Mac)
      
      // Undo: Ctrl+Z
      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useCanvasStore.getState().undo();
      }
      
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((ctrlKey && e.key === 'z' && e.shiftKey) || (ctrlKey && e.key === 'y')) {
        e.preventDefault();
        useCanvasStore.getState().redo();
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        useCanvasStore.getState().removeElement(selectedElementId);
      }

      // Reset zoom and position: Ctrl+0
      if (ctrlKey && e.key === '0') {
        e.preventDefault();
        setScale(1);
        centerCanvas();
        toast.success("View reset");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId]);

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 w-full h-full ${className}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={canvasRef}
        className="absolute canvas-grid shadow-lg"
        style={{
          width: width,
          height: height,
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          backgroundColor: "white",
          cursor: isPanning ? "grabbing" : "default",
          transition: "transform 0.1s ease-out",
        }}
        onClick={handleCanvasClick}
      >
        {/* Render elements in order of their layerIndex */}
        {[...elements]
          .sort((a, b) => a.layerIndex - b.layerIndex)
          .map(renderElement)}
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-gray-600">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default Canvas;
