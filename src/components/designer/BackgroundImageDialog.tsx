import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload } from "lucide-react";

interface BackgroundImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: {
    opacity: number;
    fit: 'cover' | 'contain' | 'fill';
    blur: number;
  }) => void;
}

const BackgroundImageDialog: React.FC<BackgroundImageDialogProps> = ({ isOpen, onClose, onApply }) => {
  const [opacity, setOpacity] = useState(100);
  const [fit, setFit] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [blur, setBlur] = useState(0);

  const handleApply = () => {
    onApply({ opacity, fit, blur });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Background Image Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[opacity]}
                onValueChange={(value) => setOpacity(value[0])}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{opacity}%</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Fit</Label>
            <Select value={fit} onValueChange={(value: 'cover' | 'contain' | 'fill') => setFit(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Blur</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[blur]}
                onValueChange={(value) => setBlur(value[0])}
                min={0}
                max={20}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{blur}px</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundImageDialog; 