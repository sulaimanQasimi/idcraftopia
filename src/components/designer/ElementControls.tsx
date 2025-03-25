import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from "@/components/ui/ColorPicker";
import { useCanvasStore } from "@/lib/canvas-state";
import { DesignerElement, TextElement, ShapeElement, ImageElement, QRCodeElement } from "@/types/designer";
import { 
  Type, ImageIcon, Circle, Square, QrCode, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, Lock, Unlock, Trash2, Copy,
  ChevronUp, ChevronDown, MoveUp, MoveDown
} from "lucide-react";

const ElementControls: React.FC = () => {
  const { 
    elements, 
    selectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    moveElementForward, 
    moveElementBackward, 
    moveElementToFront, 
    moveElementToBack,
    toggleElementLock
  } = useCanvasStore();

  if (!selectedElementId) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Select an element to edit its properties
      </div>
    );
  }

  const selectedElement = elements.find(el => el.id === selectedElementId);
  if (!selectedElement) return null;

  const handleToggleLock = () => {
    toggleElementLock(selectedElementId);
  };

  const handleDuplicate = () => {
    duplicateElement(selectedElementId);
  };

  const handleRemove = () => {
    removeElement(selectedElementId);
  };

  const renderTextControls = (element: TextElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Text</Label>
        <Input 
          value={element.text} 
          onChange={(e) => updateElement(selectedElementId, { text: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Text Direction</Label>
        <div className="flex items-center gap-2">
          <Button
            variant={element.direction === 'ltr' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateElement(selectedElementId, { direction: 'ltr' })}
            className="flex-1"
          >
            <AlignLeft className="h-4 w-4 mr-2" />
            Left to Right
          </Button>
          <Button
            variant={element.direction === 'rtl' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateElement(selectedElementId, { direction: 'rtl' })}
            className="flex-1"
          >
            <AlignRight className="h-4 w-4 mr-2" />
            Right to Left
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Font Size</Label>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            min={8}
            max={72}
            value={element.fontSize} 
            onChange={(e) => updateElement(selectedElementId, { fontSize: Number(e.target.value) })}
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select 
          value={element.fontFamily}
          onValueChange={(value) => updateElement(selectedElementId, { fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Inter">Inter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Text Color</Label>
        <ColorPicker 
          color={element.color} 
          onChange={(color) => updateElement(selectedElementId, { color })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Style</Label>
        <div className="flex gap-2">
          <Toggle 
            pressed={element.fontWeight === 'bold'} 
            onPressedChange={(pressed) => updateElement(selectedElementId, { fontWeight: pressed ? 'bold' : 'normal' })}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={element.fontStyle === 'italic'} 
            onPressedChange={(pressed) => updateElement(selectedElementId, { fontStyle: pressed ? 'italic' : 'normal' })}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={element.textDecoration === 'underline'} 
            onPressedChange={(pressed) => updateElement(selectedElementId, { textDecoration: pressed ? 'underline' : 'none' })}
            size="sm"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Alignment</Label>
        <div className="flex gap-2">
          <Toggle 
            pressed={element.textAlign === 'left'} 
            onPressedChange={() => updateElement(selectedElementId, { textAlign: 'left' })}
            size="sm"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={element.textAlign === 'center'} 
            onPressedChange={() => updateElement(selectedElementId, { textAlign: 'center' })}
            size="sm"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={element.textAlign === 'right'} 
            onPressedChange={() => updateElement(selectedElementId, { textAlign: 'right' })}
            size="sm"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  );

  const renderShapeControls = (element: ShapeElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Shape</Label>
        <div className="flex gap-2">
          <Toggle 
            pressed={element.shape === 'rectangle'} 
            onPressedChange={() => updateElement(selectedElementId, { shape: 'rectangle' })}
            size="sm"
          >
            <Square className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={element.shape === 'circle'} 
            onPressedChange={() => updateElement(selectedElementId, { shape: 'circle' })}
            size="sm"
          >
            <Circle className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Fill Color</Label>
        <ColorPicker 
          color={element.backgroundColor} 
          onChange={(color) => updateElement(selectedElementId, { backgroundColor: color })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Border Color</Label>
        <ColorPicker 
          color={element.borderColor} 
          onChange={(color) => updateElement(selectedElementId, { borderColor: color })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Border Width</Label>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            min={0}
            max={20}
            value={element.borderWidth} 
            onChange={(e) => updateElement(selectedElementId, { borderWidth: Number(e.target.value) })}
          />
          <span className="text-sm text-muted-foreground">px</span>
        </div>
      </div>
      
      {element.shape === 'rectangle' && (
        <div className="space-y-2">
          <Label>Border Radius</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              min={0}
              max={100}
              value={element.borderRadius} 
              onChange={(e) => updateElement(selectedElementId, { borderRadius: Number(e.target.value) })}
            />
            <span className="text-sm text-muted-foreground">px</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderImageControls = (element: ImageElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input 
          value={element.alt} 
          onChange={(e) => updateElement(selectedElementId, { alt: e.target.value })}
          placeholder="Description of the image"
        />
      </div>
      
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Replace Image
        </Button>
      </div>
    </div>
  );

  const renderQRCodeControls = (element: QRCodeElement) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>QR Content</Label>
        <Input 
          value={element.value} 
          onChange={(e) => updateElement(selectedElementId, { value: e.target.value })}
          placeholder="URL or text for QR code"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Background Color</Label>
        <ColorPicker 
          color={element.backgroundColor} 
          onChange={(color) => updateElement(selectedElementId, { backgroundColor: color })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Foreground Color</Label>
        <ColorPicker 
          color={element.foregroundColor} 
          onChange={(color) => updateElement(selectedElementId, { foregroundColor: color })}
        />
      </div>
    </div>
  );

  const renderElementControls = () => {
    switch (selectedElement.type) {
      case 'text':
        return renderTextControls(selectedElement as TextElement);
      case 'shape':
        return renderShapeControls(selectedElement as ShapeElement);
      case 'image':
        return renderImageControls(selectedElement as ImageElement);
      case 'qrcode':
        return renderQRCodeControls(selectedElement as QRCodeElement);
      default:
        return null;
    }
  };

  const renderElementIcon = () => {
    switch (selectedElement.type) {
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'shape':
        return (selectedElement as ShapeElement).shape === 'circle' 
          ? <Circle className="h-4 w-4" /> 
          : <Square className="h-4 w-4" />;
      case 'qrcode':
        return <QrCode className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="style" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          <TabsTrigger value="arrange" className="flex-1">Arrange</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {renderElementIcon()}
              <span className="text-sm font-medium capitalize">{selectedElement.type}</span>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleLock}
                title={selectedElement.locked ? "Unlock" : "Lock"}
              >
                {selectedElement.locked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDuplicate}
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemove}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {renderElementControls()}
          </div>
        </TabsContent>
        
        <TabsContent value="arrange" className="pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">X</Label>
                  <Input 
                    type="number"
                    value={Math.round(selectedElement.position.x)} 
                    onChange={(e) => updateElement(selectedElementId, { 
                      position: { ...selectedElement.position, x: Number(e.target.value) } 
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Y</Label>
                  <Input 
                    type="number"
                    value={Math.round(selectedElement.position.y)} 
                    onChange={(e) => updateElement(selectedElementId, { 
                      position: { ...selectedElement.position, y: Number(e.target.value) } 
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Size</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Width</Label>
                  <Input 
                    type="number"
                    min={10}
                    value={Math.round(selectedElement.position.width)} 
                    onChange={(e) => updateElement(selectedElementId, { 
                      position: { ...selectedElement.position, width: Number(e.target.value) } 
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Height</Label>
                  <Input 
                    type="number"
                    min={10}
                    value={Math.round(selectedElement.position.height)} 
                    onChange={(e) => updateElement(selectedElementId, { 
                      position: { ...selectedElement.position, height: Number(e.target.value) } 
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rotation</Label>
              <Input 
                type="number"
                min={0}
                max={360}
                value={Math.round(selectedElement.position.rotation)} 
                onChange={(e) => updateElement(selectedElementId, { 
                  position: { ...selectedElement.position, rotation: Number(e.target.value) } 
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Layer</Label>
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => moveElementToBack(selectedElementId)}
                  title="Send to Back"
                >
                  <MoveDown className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => moveElementBackward(selectedElementId)}
                  title="Send Backward"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => moveElementForward(selectedElementId)}
                  title="Bring Forward"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => moveElementToFront(selectedElementId)}
                  title="Bring to Front"
                >
                  <MoveUp className="h-4 w-4 mr-1" />
                  Front
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementControls;
