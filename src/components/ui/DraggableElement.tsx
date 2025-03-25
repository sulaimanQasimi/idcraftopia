
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DraggableElementProps {
  children: React.ReactNode;
  position: { x: number; y: number };
  locked?: boolean;
  selected?: boolean;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  className?: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  children,
  position,
  locked = false,
  selected = false,
  onPositionChange,
  onSelect,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Effect to handle mouseup/touchend events on the window
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Effect to handle mousemove/touchmove events on the window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || locked) return;

      let clientX: number;
      let clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        // TouchEvent
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const newX = clientX - offsetRef.current.x;
      const newY = clientY - offsetRef.current.y;

      // Get the parent canvas dimensions
      const parent = elementRef.current?.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        // Ensure the element stays within the canvas boundaries
        const elementRect = elementRef.current?.getBoundingClientRect();
        if (elementRect) {
          const elementWidth = elementRect.width;
          const elementHeight = elementRect.height;
          
          // Calculate bounds
          const minX = 0;
          const minY = 0;
          const maxX = parentRect.width - elementWidth;
          const maxY = parentRect.height - elementHeight;
          
          // Apply bounds
          const boundedX = Math.max(minX, Math.min(maxX, newX));
          const boundedY = Math.max(minY, Math.min(maxY, newY));
          
          onPositionChange({ x: boundedX, y: boundedY });
        }
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [isDragging, locked, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (locked) return;
    
    onSelect();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    setIsDragging(true);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "designer-element",
        { selected: selected },
        { "cursor-move": !locked },
        { "cursor-not-allowed": locked },
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggableElement;
