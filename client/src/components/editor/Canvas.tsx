import { useDrop } from 'react-dnd';
import { ElementData, ElementType } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import EditableElement from './EditableElement';
import { v4 as uuidv4 } from 'uuid';

interface CanvasProps {
  elements: ElementData[];
  viewportSize: string;
  selectedElementId: string | null;
  onElementSelect: (id: string | null) => void;
  onElementsChange: (elements: ElementData[]) => void;
}

export default function Canvas({
  elements,
  viewportSize,
  selectedElementId,
  onElementSelect,
  onElementsChange
}: CanvasProps) {
  const [dropIndicator, setDropIndicator] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case 'text':
        return 'New Text Element';
      case 'button':
        return 'Button';
      case 'image':
        return '';
      default:
        return '';
    }
  };

  const getDefaultStyle = (type: ElementType) => {
    switch (type) {
      case 'text':
        return { 
          color: '#000000', 
          fontSize: '16px',
          fontWeight: 'normal',
          textAlign: 'left',
          padding: '10px'
        };
      case 'button':
        return { 
          backgroundColor: 'hsl(var(--primary))', 
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        };
      case 'image':
        return { 
          width: '100%', 
          height: 'auto',
          objectFit: 'cover'
        };
      case 'box':
        return {
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '4px',
          border: '1px solid #e9ecef',
          minHeight: '100px',
          width: '100%'
        };
      default:
        return {};
    }
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item: { type: ElementType }, monitor) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const dropOffset = monitor.getClientOffset();
      if (!dropOffset) return;

      // Calculate position relative to the canvas
      const x = dropOffset.x - canvasRect.left;
      const y = dropOffset.y - canvasRect.top;

      // Ensure we're not dropping outside reasonable bounds
      if (x < 0 || y < 0 || x > canvasRect.width || y > canvasRect.height) {
        return;
      }

      const defaultStyleForType = getDefaultStyle(item.type);
      
      // Create new element with unique ID
      const newElement: ElementData = {
        id: uuidv4(),
        type: item.type,
        content: getDefaultContent(item.type),
        style: {
<<<<<<< HEAD
          position: 'absolute',
          left: `${finalX}px`,
          top: `${finalY}px`,
          zIndex: elements.length + 1,
          width: `${elementDimensions.width}px`,
          height: `${elementDimensions.height}px`,
          ...Object.fromEntries(
            Object.entries(defaultStyleForType).filter(([_, value]) => value !== undefined)
          )
=======
          ...defaultStyleForType,
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: elements.length + 1, // Ensure new elements appear on top
>>>>>>> a8690e00187076c3634d145746423c32b7aec096
        }
      };

      // Add specific properties based on element type
      if (item.type === 'image') {
        newElement.src = 'https://via.placeholder.com/300x200';
        newElement.alt = 'Placeholder Image';
      }

      if (item.type === 'button') {
        newElement.href = '#';
      }

      // Preserve existing elements and add the new one
      const updatedElements = [...elements, newElement];
      onElementsChange(updatedElements);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isOver && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        
        // Make sure we're showing the indicator within the canvas bounds
        const x = Math.min(Math.max(e.clientX - canvasRect.left, 0), canvasRect.width);
        const y = Math.min(Math.max(e.clientY - canvasRect.top, 0), canvasRect.height);
        
        setDropIndicator({
          x: x,
          y: y,
          width: 100,
          height: 50,
          visible: true,
        });
      } else {
        setDropIndicator(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOver]);

  const getCanvasWidth = () => {
    switch (viewportSize) {
      case 'desktop':
        return 'w-full max-w-4xl';
      case 'tablet':
        return 'w-[768px]';
      case 'mobile':
        return 'w-[375px]';
      default:
        return 'w-full max-w-4xl';
    }
  };

  const handleElementUpdate = (updatedElement: ElementData) => {
    const updatedElements = elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    onElementsChange(updatedElements);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicking the canvas itself, deselect any element
    if (e.target === canvasRef.current) {
      onElementSelect(null);
    }
  };

  return (
    <div className="p-8 flex justify-center overflow-x-auto">
      <div 
        ref={drop}
        className={`bg-white shadow-lg ${getCanvasWidth()} h-[800px] overflow-y-auto relative canvas-container`}
        onClick={handleCanvasClick}
      >
        <div ref={canvasRef} className="relative min-h-full">
          {elements.map((element) => (
            <EditableElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={() => onElementSelect(element.id)}
              onChange={handleElementUpdate}
            />
          ))}
          
          {dropIndicator.visible && (
            <div
              className="drop-indicator"
              style={{
                left: `${dropIndicator.x - dropIndicator.width / 2}px`,
                top: `${dropIndicator.y - dropIndicator.height / 2}px`,
                width: `${dropIndicator.width}px`,
                height: `${dropIndicator.height}px`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
