import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { BarcodeElement as BarcodeElementType } from '@/types/designer';

interface BarcodeElementProps {
  element: BarcodeElementType;
}

const BarcodeElement: React.FC<BarcodeElementProps> = ({ element }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && element.value) {
      try {
        JsBarcode(barcodeRef.current, element.value, {
          format: element.format,
          width: element.position.width,
          height: element.position.height,
          displayValue: true,
          backgroundColor: element.backgroundColor,
          lineColor: element.foregroundColor,
          margin: 10,
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [element.value, element.format, element.position.width, element.position.height, element.backgroundColor, element.foregroundColor]);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.position.width,
        height: element.position.height,
        transform: `rotate(${element.position.rotation}deg)`,
        ...element.style
      }}
    >
      <svg
        ref={barcodeRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default BarcodeElement; 