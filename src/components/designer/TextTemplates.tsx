import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanvasStore } from "@/lib/canvas-state";
import { TextElement } from "@/types/designer";

const textTemplates = [
  { text: "Welcome!", fontSize: 32, fontFamily: "Arial", color: "#000000", fontWeight: "bold" },
  { text: "Contact Us", fontSize: 24, fontFamily: "Arial", color: "#000000", fontWeight: "bold" },
  { text: "About Us", fontSize: 24, fontFamily: "Arial", color: "#000000", fontWeight: "bold" },
  { text: "Our Services", fontSize: 24, fontFamily: "Arial", color: "#000000", fontWeight: "bold" },
  { text: "Get in Touch", fontSize: 20, fontFamily: "Arial", color: "#000000", fontWeight: "normal" },
  { text: "Follow Us", fontSize: 20, fontFamily: "Arial", color: "#000000", fontWeight: "normal" },
  { text: "© 2024 All Rights Reserved", fontSize: 14, fontFamily: "Arial", color: "#666666", fontWeight: "normal" },
  { text: "Phone: (123) 456-7890", fontSize: 16, fontFamily: "Arial", color: "#000000", fontWeight: "normal" },
  { text: "Email: info@example.com", fontSize: 16, fontFamily: "Arial", color: "#000000", fontWeight: "normal" },
  { text: "Address: 123 Main St", fontSize: 16, fontFamily: "Arial", color: "#000000", fontWeight: "normal" },
];

const TextTemplates: React.FC = () => {
  const { addElement } = useCanvasStore();

  const handleTemplateClick = (template: typeof textTemplates[0]) => {
    const newTextElement: TextElement = {
      id: `text-${Date.now()}`,
      type: "text",
      text: template.text,
      position: {
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0
      },
      style: {
        fontSize: template.fontSize,
        fontFamily: template.fontFamily,
        color: template.color,
        fontWeight: template.fontWeight,
        textAlign: "left",
        opacity: 1
      }
    };

    addElement(newTextElement);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium">Text Templates</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {textTemplates.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleTemplateClick(template)}
            >
              {template.text}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TextTemplates; 