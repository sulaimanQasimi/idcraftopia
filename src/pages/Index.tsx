import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Canvas from "@/components/designer/Canvas";
import Toolbar from "@/components/designer/Toolbar";
import ElementControls from "@/components/designer/ElementControls";
import TemplateGallery from "@/components/designer/TemplateGallery";
import { useCanvasStore } from "@/lib/canvas-state";
import { LayoutGrid, Settings, FilePlus } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { width, height, setCanvasSize, getCanvasData } = useCanvasStore();
  const [isNewCardDialogOpen, setIsNewCardDialogOpen] = useState(false);
  const [newCardWidth, setNewCardWidth] = useState(350);
  const [newCardHeight, setNewCardHeight] = useState(500);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle canvas export
  const handleExport = async () => {
    try {
      toast.info("Preparing download...");
      
      // In a real app, this would capture the canvas as an image
      // For this demo, we'll just show a success message
      setTimeout(() => {
        toast.success("ID Card exported successfully!");
      }, 1000);
      
      // In a real implementation, we would do:
      // 1. Use html2canvas to capture the canvas
      // 2. Convert to a downloadable image
      // 3. Trigger the download
    } catch (error) {
      toast.error("Failed to export ID Card");
      console.error(error);
    }
  };

  // Handle creating a new card
  const handleCreateNewCard = () => {
    setCanvasSize(newCardWidth, newCardHeight);
    setIsNewCardDialogOpen(false);
    toast.success(`Created new ${newCardWidth}×${newCardHeight} ID card`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ID Card Designer
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={isNewCardDialogOpen} onOpenChange={setIsNewCardDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FilePlus size={16} />
                  <span>New Card</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <h2 className="text-xl font-semibold mb-4">Create New ID Card</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        min={100}
                        max={1000}
                        value={newCardWidth}
                        onChange={(e) => setNewCardWidth(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        min={100}
                        max={1000}
                        value={newCardHeight}
                        onChange={(e) => setNewCardHeight(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsNewCardDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateNewCard}>
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isTemplateGalleryOpen} onOpenChange={setIsTemplateGalleryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <LayoutGrid size={16} />
                  <span>Templates</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <TemplateGallery onClose={() => setIsTemplateGalleryOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button size="sm" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={80} minSize={70}>
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b flex justify-center">
                <Toolbar onExport={handleExport} />
              </div>
              
              {/* Canvas */}
              <div ref={canvasRef} className="flex-1 relative overflow-hidden">
                <Canvas />
              </div>
              
              {/* Status Bar */}
              <div className="p-2 border-t bg-white/80 backdrop-blur-sm flex items-center justify-between text-sm text-gray-500">
                <div>
                  Canvas: {width} × {height}px
                </div>
                <div className="flex items-center space-x-2">
                  <span>Use Alt + drag to pan</span>
                  <span>•</span>
                  <span>Ctrl + scroll to zoom</span>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={20} minSize={15}>
            <Tabs defaultValue="elements" className="h-full flex flex-col">
              <TabsList className="w-full justify-start px-4 pt-4 bg-transparent">
                <TabsTrigger value="elements" className="flex items-center gap-1">
                  <Settings size={14} />
                  <span>Elements</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="elements" className="flex-1 overflow-auto">
                <ElementControls />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default Index;
