
import { create } from "zustand";
import { CanvasState, DesignerElement } from "@/types/designer";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface CanvasStore extends CanvasState {
  // Canvas operations
  setCanvasSize: (width: number, height: number) => void;
  
  // Element operations
  addElement: (element: Omit<DesignerElement, "id" | "layerIndex">) => void;
  updateElement: (id: string, updates: Partial<Omit<DesignerElement, "id" | "type">>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  
  // Layer operations
  moveElementForward: (id: string) => void;
  moveElementBackward: (id: string) => void;
  moveElementToFront: (id: string) => void;
  moveElementToBack: (id: string) => void;
  
  // Lock/unlock
  toggleElementLock: (id: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  
  // Template operations
  loadTemplate: (elements: DesignerElement[], width: number, height: number) => void;
  
  // Export
  getCanvasData: () => {
    width: number;
    height: number;
    elements: DesignerElement[];
  };
  
  // Utility
  clearCanvas: () => void;
}

// Initial state for the canvas
const initialState: CanvasState = {
  width: 500,
  height: 300,
  elements: [],
  selectedElementId: null,
  history: {
    past: [],
    future: [],
  },
};

// Helper to save current state to history
const saveToHistory = (elements: DesignerElement[]) => {
  return {
    past: [...useCanvasStore.getState().history.past, elements],
    future: [],
  };
};

// Create the store
export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...initialState,

  setCanvasSize: (width, height) => {
    set({ width, height });
  },

  addElement: (element) => {
    const elements = get().elements;
    const newElement = {
      ...element,
      id: uuidv4(),
      layerIndex: elements.length,
    } as DesignerElement;

    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id,
      history: saveToHistory(state.elements),
    }));
    
    toast.success(`Added new ${element.type} element`);
  },

  updateElement: (id, updates) => {
    set((state) => {
      const elementIndex = state.elements.findIndex((el) => el.id === id);
      if (elementIndex === -1) return state;

      const updatedElements = [...state.elements];
      updatedElements[elementIndex] = {
        ...updatedElements[elementIndex],
        ...updates,
      } as DesignerElement;

      return {
        elements: updatedElements,
        history: saveToHistory(state.elements),
      };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const elementToRemove = state.elements.find((el) => el.id === id);
      if (!elementToRemove) return state;
      
      const filteredElements = state.elements.filter((el) => el.id !== id);
      
      toast.success(`Removed ${elementToRemove.type} element`);
      
      return {
        elements: filteredElements,
        selectedElementId: null,
        history: saveToHistory(state.elements),
      };
    });
  },

  duplicateElement: (id) => {
    set((state) => {
      const elementToDuplicate = state.elements.find((el) => el.id === id);
      if (!elementToDuplicate) return state;

      const duplicatedElement = {
        ...elementToDuplicate,
        id: uuidv4(),
        position: {
          ...elementToDuplicate.position,
          x: elementToDuplicate.position.x + 20,
          y: elementToDuplicate.position.y + 20,
        },
        layerIndex: state.elements.length,
      };

      toast.success(`Duplicated ${elementToDuplicate.type} element`);

      return {
        elements: [...state.elements, duplicatedElement],
        selectedElementId: duplicatedElement.id,
        history: saveToHistory(state.elements),
      };
    });
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  moveElementForward: (id) => {
    set((state) => {
      const elements = [...state.elements];
      const elementIndex = elements.findIndex((el) => el.id === id);
      if (elementIndex === -1 || elementIndex === elements.length - 1) return state;

      // Swap with the element above
      const temp = elements[elementIndex + 1];
      elements[elementIndex + 1] = elements[elementIndex];
      elements[elementIndex] = temp;

      // Update layer indices
      elements.forEach((el, index) => {
        el.layerIndex = index;
      });

      return {
        elements,
        history: saveToHistory(state.elements),
      };
    });
  },

  moveElementBackward: (id) => {
    set((state) => {
      const elements = [...state.elements];
      const elementIndex = elements.findIndex((el) => el.id === id);
      if (elementIndex <= 0) return state;

      // Swap with the element below
      const temp = elements[elementIndex - 1];
      elements[elementIndex - 1] = elements[elementIndex];
      elements[elementIndex] = temp;

      // Update layer indices
      elements.forEach((el, index) => {
        el.layerIndex = index;
      });

      return {
        elements,
        history: saveToHistory(state.elements),
      };
    });
  },

  moveElementToFront: (id) => {
    set((state) => {
      const elements = [...state.elements];
      const elementIndex = elements.findIndex((el) => el.id === id);
      if (elementIndex === -1 || elementIndex === elements.length - 1) return state;

      // Remove element and add it to the end (top)
      const element = elements.splice(elementIndex, 1)[0];
      elements.push(element);

      // Update layer indices
      elements.forEach((el, index) => {
        el.layerIndex = index;
      });

      return {
        elements,
        history: saveToHistory(state.elements),
      };
    });
  },

  moveElementToBack: (id) => {
    set((state) => {
      const elements = [...state.elements];
      const elementIndex = elements.findIndex((el) => el.id === id);
      if (elementIndex <= 0) return state;

      // Remove element and add it to the beginning (bottom)
      const element = elements.splice(elementIndex, 1)[0];
      elements.unshift(element);

      // Update layer indices
      elements.forEach((el, index) => {
        el.layerIndex = index;
      });

      return {
        elements,
        history: saveToHistory(state.elements),
      };
    });
  },

  toggleElementLock: (id) => {
    set((state) => {
      const elementIndex = state.elements.findIndex((el) => el.id === id);
      if (elementIndex === -1) return state;

      const updatedElements = [...state.elements];
      const isLocked = !updatedElements[elementIndex].locked;
      
      updatedElements[elementIndex] = {
        ...updatedElements[elementIndex],
        locked: isLocked,
      };

      toast.success(isLocked ? 'Element locked' : 'Element unlocked');

      return {
        elements: updatedElements,
        history: saveToHistory(state.elements),
      };
    });
  },

  undo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) {
        toast.error('Nothing to undo');
        return state;
      }

      const newPast = [...past];
      const previousElements = newPast.pop();
      
      if (!previousElements) return state;
      
      toast.success('Undo successful');

      return {
        elements: previousElements,
        selectedElementId: null,
        history: {
          past: newPast,
          future: [state.elements, ...future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) {
        toast.error('Nothing to redo');
        return state;
      }

      const newFuture = [...future];
      const nextElements = newFuture.shift();
      
      if (!nextElements) return state;
      
      toast.success('Redo successful');

      return {
        elements: nextElements,
        selectedElementId: null,
        history: {
          past: [...past, state.elements],
          future: newFuture,
        },
      };
    });
  },

  loadTemplate: (elements, width, height) => {
    set((state) => ({
      width,
      height,
      elements: elements.map((el) => ({
        ...el,
        id: uuidv4(), // Assign new IDs
      })),
      selectedElementId: null,
      history: {
        past: [],
        future: [],
      },
    }));
    
    toast.success('Template loaded');
  },

  getCanvasData: () => {
    const { width, height, elements } = get();
    return { width, height, elements };
  },

  clearCanvas: () => {
    set((state) => ({
      elements: [],
      selectedElementId: null,
      history: saveToHistory(state.elements),
    }));
    
    toast.success('Canvas cleared');
  },
}));
