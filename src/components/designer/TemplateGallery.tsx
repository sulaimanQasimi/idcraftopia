
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { defaultTemplates } from "@/lib/templates";
import { useCanvasStore } from "@/lib/canvas-state";

interface TemplateGalleryProps {
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose }) => {
  const { loadTemplate } = useCanvasStore();

  const handleSelectTemplate = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (template) {
      loadTemplate(template.elements, template.width, template.height);
      onClose();
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 gap-4">
          {defaultTemplates.map((template) => (
            <div 
              key={template.id}
              className="group border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="aspect-[7/10] bg-gray-100 relative">
                {/* In a real app, we would display actual thumbnails */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{template.name}</span>
                </div>
                
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="p-2">
                <h4 className="text-sm font-medium">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.width} × {template.height}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TemplateGallery;
