
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const predefinedColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080",
  "#800000", "#808000", "#008000", "#800080", "#008080",
  "#000080", "#FFA500", "#A52A2A", "#F0F8FF", "#FAEBD7",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [selectedColor, setSelectedColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update the internal state when the prop changes
  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-8 h-8 p-0 border-2"
            style={{ backgroundColor: selectedColor }}
          >
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-2">
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((predefinedColor) => (
                <button
                  key={predefinedColor}
                  className={`w-8 h-8 rounded-md border-2 ${
                    selectedColor === predefinedColor ? "border-black" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: predefinedColor }}
                  onClick={() => handleColorChange(predefinedColor)}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <input
                ref={inputRef}
                type="color"
                className="w-8 h-8"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-2 py-1 border rounded-md"
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
