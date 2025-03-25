import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useCanvasStore } from "@/lib/canvas-state";
import { ToolType, ImageElement, TextElement, ShapeElement, QRCodeElement } from "@/types/designer";
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
  MousePointer,
  ImagePlus,
  Settings,
  AlignLeft,
  AlignRight
} from "lucide-react";
import BackgroundImageDialog from "./BackgroundImageDialog";
import ImageUploadDialog from "./ImageUploadDialog";

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
  const [showBackgroundDialog, setShowBackgroundDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [backgroundSettings, setBackgroundSettings] = useState<{
    opacity: number;
    fit: 'cover' | 'contain' | 'fill';
    blur: number;
  }>({
    opacity: 100,
    fit: 'cover',
    blur: 0
  });

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
          direction: "ltr"
        } as TextElement);
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
        } as ShapeElement);
        break;
      case "qrcode":
        addElement({
          type: "qrcode",
          position: { x: width / 2 - 75, y: height / 2 - 75, width: 150, height: 150, rotation: 0 },
          locked: false,
          value: "https://example.com",
          backgroundColor: "#FFFFFF",
          foregroundColor: "#000000",
        } as QRCodeElement);
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
    } as ShapeElement);
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
    } as ImageElement);
  };

  const handleAddBackgroundImage = () => {
    setShowUploadDialog(true);
  };

  const handleBackgroundSettingsApply = (settings: { opacity: number; fit: 'cover' | 'contain' | 'fill'; blur: number }) => {
    setBackgroundSettings(settings);
    // Update existing background image if it exists
    const elements = useCanvasStore.getState().elements;
    const backgroundImage = elements.find(el => el.type === 'image' && el.locked);
    if (backgroundImage) {
      useCanvasStore.getState().updateElement(backgroundImage.id, {
        style: {
          opacity: settings.opacity / 100,
          objectFit: settings.fit,
          filter: settings.blur > 0 ? `blur(${settings.blur}px)` : 'none'
        }
      });
    }
  };

  const handleImageUpload = (file: File) => {
    // In a real app, you would upload the file to your server
    // For now, we'll use a placeholder
    const imageUrl = URL.createObjectURL(file);
    addElement({
      type: "image",
      position: { x: 0, y: 0, width: width, height: height, rotation: 0 },
      locked: true,
      src: imageUrl,
      aspectRatio: width / height,
      alt: "Background image",
      style: {
        opacity: backgroundSettings.opacity / 100,
        objectFit: backgroundSettings.fit,
        filter: backgroundSettings.blur > 0 ? `blur(${backgroundSettings.blur}px)` : 'none'
      }
    } as ImageElement);
  };

  const handleSetTextDirection = (direction: 'ltr' | 'rtl') => {
    const { selectedElementId, elements, updateElement } = useCanvasStore.getState();
    if (!selectedElementId) return;

    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (!selectedElement || selectedElement.type !== 'text') return;

    updateElement(selectedElementId, {
      direction
    } as Partial<TextElement>);
  };

  return (
    <>
      <div className="glass-panel p-2 rounded-lg flex items-center space-x-1">
        <ToolButton 
          icon={<MousePointer size={18} />} 
          label="Select" 
          selected={!!selectedElementId}
          onClick={() => {}}
        />
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        
        <ToolButton 
          icon={<ImagePlus size={18} />} 
          label="Background" 
          onClick={handleAddBackgroundImage}
        />
        <ToolButton 
          icon={<Settings size={18} />} 
          label="Background Settings" 
          onClick={() => setShowBackgroundDialog(true)}
        />
        <ToolButton 
          icon={<Type size={18} />} 
          label="Text" 
          onClick={() => handleAddElement("text")}
        />
        <ToolButton 
          icon={<AlignLeft size={18} />} 
          label="Left to Right" 
          onClick={() => handleSetTextDirection('ltr')}
        />
        <ToolButton 
          icon={<AlignRight size={18} />} 
          label="Right to Left" 
          onClick={() => handleSetTextDirection('rtl')}
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

      <BackgroundImageDialog
        isOpen={showBackgroundDialog}
        onClose={() => setShowBackgroundDialog(false)}
        onApply={handleBackgroundSettingsApply}
      />

      <ImageUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleImageUpload}
      />
    </>
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
