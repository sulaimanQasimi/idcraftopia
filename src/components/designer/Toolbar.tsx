import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useCanvasStore } from "@/lib/canvas-state";
import { ToolType } from "@/types/designer";
import { toast } from "sonner";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle, 
  QrCode, 
  Undo2, 
  Redo2, 
  Download, 
  Trash,
  RotateCcw,
  MousePointer
} from "lucide-react";

interface ToolbarProps {
  onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport }) => {
  const { 
    undo, 
    redo, 
    clearCanvas,
    addElement,
    width,
    height,
    selectedElementId
  } = useCanvasStore();

  const handleAddElement = (type: ToolType) => {
    switch (type) {
      case "text":
        addElement({
          type: "text",
          position: { x: width / 2 - 100, y: height / 2 - 20, width: 200, height: 40, rotation: 0 },
          locked: false,
          text: "Double click to edit text",
          fontSize: 16,
          fontFamily: "Inter",
          color: "#000000",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
        });
        break;
      case "shape":
        addElement({
          type: "shape",
          position: { x: width / 2 - 50, y: height / 2 - 50, width: 100, height: 100, rotation: 0 },
          locked: false,
          shape: "rectangle",
          backgroundColor: "#4dabf7",
          borderColor: "#339af0",
          borderWidth: 2,
          borderRadius: 4,
        });
        break;
      case "qrcode":
        addElement({
          type: "qrcode",
          position: { x: width / 2 - 75, y: height / 2 - 75, width: 150, height: 150, rotation: 0 },
          locked: false,
          value: "https://example.com",
          backgroundColor: "#FFFFFF",
          foregroundColor: "#000000",
        });
        break;
      default:
        break;
    }
  };

  const handleAddCircle = () => {
    addElement({
      type: "shape",
      position: { x: width / 2 - 50, y: height / 2 - 50, width: 100, height: 100, rotation: 0 },
      locked: false,
      shape: "circle",
      backgroundColor: "#FF6B6B",
      borderColor: "#FA5252",
      borderWidth: 2,
      borderRadius: 0,
    });
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    toast.error("Image upload is not implemented in this demo");
    // Simulating image addition with a placeholder
    addElement({
      type: "image",
      position: { x: width / 2 - 75, y: height / 2 - 75, width: 150, height: 150, rotation: 0 },
      locked: false,
      src: "https://placehold.co/150x150",
      aspectRatio: 1,
      alt: "Placeholder image",
    });
  };

  return (
    <div className="glass-panel p-2 rounded-lg flex items-center space-x-1">
      <ToolButton 
        icon={<MousePointer size={18} />} 
        label="Select" 
        selected={!!selectedElementId}
        onClick={() => {}}
      />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <ToolButton 
        icon={<Type size={18} />} 
        label="Text" 
        onClick={() => handleAddElement("text")}
      />
      <ToolButton 
        icon={<ImageIcon size={18} />} 
        label="Image" 
        onClick={handleAddImage}
      />
      <ToolButton 
        icon={<Square size={18} />} 
        label="Rectangle" 
        onClick={() => handleAddElement("shape")}
      />
      <ToolButton 
        icon={<Circle size={18} />} 
        label="Circle" 
        onClick={handleAddCircle}
      />
      <ToolButton 
        icon={<QrCode size={18} />} 
        label="QR Code" 
        onClick={() => handleAddElement("qrcode")}
      />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <ToolButton 
        icon={<Undo2 size={18} />} 
        label="Undo" 
        onClick={undo}
      />
      <ToolButton 
        icon={<Redo2 size={18} />} 
        label="Redo" 
        onClick={redo}
      />
      
      <Separator orientation="vertical" className="h-8 mx-1" />
      
      <ToolButton 
        icon={<Download size={18} />} 
        label="Export" 
        onClick={onExport}
      />
      <ToolButton 
        icon={<Trash size={18} />} 
        label="Clear" 
        onClick={() => {
          if (confirm("Are you sure you want to clear the canvas? This action cannot be undone.")) {
            clearCanvas();
          }
        }}
      />
      <ToolButton 
        icon={<RotateCcw size={18} />} 
        label="Reset View" 
        onClick={() => {
          // This will be handled by the Canvas component
          document.dispatchEvent(new KeyboardEvent('keydown', {
            key: '0',
            ctrlKey: true,
            bubbles: true
          }));
        }}
      />
    </div>
  );
};

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, selected, onClick }) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant={selected ? "default" : "ghost"}
          size="icon"
          onClick={onClick}
          className="w-9 h-9"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
};

export default Toolbar;
