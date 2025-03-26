import React, { useState, useRef, useEffect } from "react";

interface ResizableElementProps {
  children: React.ReactNode;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
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

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current || locked) return;

      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        if (isResizing === "rotate" && onRotationChange) {
          // Calculate rotation based on mouse position relative to element center
          const angle =
            Math.atan2(e.clientY - centerY, e.clientX - centerX) *
            (180 / Math.PI);
          onRotationChange(angle + 90); // +90 to make top the 0 degree
          return;
        }

        // Handle resizing with smooth interpolation
        const getInterpolatedValue = (current: number, target: number) => {
          return current + (target - current) * 0.2; // Adjust this value for different smoothing effects
        };

        let targetWidth = startPosRef.current.width;
        let targetHeight = startPosRef.current.height;

        switch (isResizing) {
          case "br":
            targetWidth = Math.max(
              minWidth,
              startPosRef.current.width + (e.clientX - startPosRef.current.x)
            );
            targetHeight = Math.max(
              minHeight,
              startPosRef.current.height + (e.clientY - startPosRef.current.y)
            );
            break;
          case "bl":
            targetWidth = Math.max(
              minWidth,
              startPosRef.current.width - (e.clientX - startPosRef.current.x)
            );
            targetHeight = Math.max(
              minHeight,
              startPosRef.current.height + (e.clientY - startPosRef.current.y)
            );
            break;
          case "tr":
            targetWidth = Math.max(
              minWidth,
              startPosRef.current.width + (e.clientX - startPosRef.current.x)
            );
            targetHeight = Math.max(
              minHeight,
              startPosRef.current.height - (e.clientY - startPosRef.current.y)
            );
            break;
          case "tl":
            targetWidth = Math.max(
              minWidth,
              startPosRef.current.width - (e.clientX - startPosRef.current.x)
            );
            targetHeight = Math.max(
              minHeight,
              startPosRef.current.height - (e.clientY - startPosRef.current.y)
            );
            break;
        }

        // Maintain aspect ratio if required
        if (preserveAspectRatio) {
          const originalAspectRatio =
            startPosRef.current.width / startPosRef.current.height;
          if (targetWidth / targetHeight > originalAspectRatio) {
            targetWidth = targetHeight * originalAspectRatio;
          } else {
            targetHeight = targetWidth / originalAspectRatio;
          }
        }

        // Apply smooth interpolation
        const newWidth = getInterpolatedValue(position.width, targetWidth);
        const newHeight = getInterpolatedValue(position.height, targetHeight);

        onPositionChange({ width: newWidth, height: newHeight });
      });
    };

    const handleMouseUp = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      setIsResizing(null);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isResizing,
    locked,
    minHeight,
    minWidth,
    onPositionChange,
    onRotationChange,
    preserveAspectRatio,
  ]);

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
      className="relative"
      style={{
        transform: `rotate(${position.rotation}deg)`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        transition: isResizing
          ? "none"
          : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: isResizing ? "transform, width, height" : "auto",
      }}
    >
      {children}

      <div
        className={`resize-handle resize-handle-tl ${
          isResizing === "tl" ? "active" : ""
        }`}
        onMouseDown={handleResizeStart("tl")}
        style={{
          transition: "transform 0.1s ease-out, background-color 0.2s ease",
          transform: isResizing === "tl" ? "scale(1.2)" : "scale(1)",
        }}
      ></div>
      <div
        className={`resize-handle resize-handle-tr ${
          isResizing === "tr" ? "active" : ""
        }`}
        onMouseDown={handleResizeStart("tr")}
        style={{
          transition: "transform 0.1s ease-out, background-color 0.2s ease",
          transform: isResizing === "tr" ? "scale(1.2)" : "scale(1)",
        }}
      ></div>
      <div
        className={`resize-handle resize-handle-bl ${
          isResizing === "bl" ? "active" : ""
        }`}
        onMouseDown={handleResizeStart("bl")}
        style={{
          transition: "transform 0.1s ease-out, background-color 0.2s ease",
          transform: isResizing === "bl" ? "scale(1.2)" : "scale(1)",
        }}
      ></div>
      <div
        className={`resize-handle resize-handle-br ${
          isResizing === "br" ? "active" : ""
        }`}
        onMouseDown={handleResizeStart("br")}
        style={{
          transition: "transform 0.1s ease-out, background-color 0.2s ease",
          transform: isResizing === "br" ? "scale(1.2)" : "scale(1)",
        }}
      ></div>

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
