export type ElementType = 'text' | 'image' | 'shape' | 'qrcode';

export type ElementPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export interface BaseElement {
  id: string;
  type: ElementType;
  position: ElementPosition;
  locked: boolean;
  layerIndex: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  aspectRatio: number;
  alt: string;
  style?: {
    opacity?: number;
    objectFit?: 'cover' | 'contain' | 'fill';
    filter?: string;
  };
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'rectangle' | 'circle';
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode';
  value: string;
  backgroundColor: string;
  foregroundColor: string;
}

export type DesignerElement = TextElement | ImageElement | ShapeElement | QRCodeElement;

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  width: number;
  height: number;
  elements: DesignerElement[];
}

export interface CanvasState {
  width: number;
  height: number;
  elements: DesignerElement[];
  selectedElementId: string | null;
  history: {
    past: DesignerElement[][];
    future: DesignerElement[][];
  };
}

export type ToolType = 'select' | 'text' | 'image' | 'shape' | 'qrcode';

export interface Tool {
  id: ToolType;
  name: string;
  icon: string;
}
