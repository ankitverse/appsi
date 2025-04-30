import { ElementData } from '@/lib/types';
import { useRef, useState, useEffect } from 'react';
import { Grip } from 'lucide-react';

interface EditableElementProps {
  element: ElementData;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (element: ElementData) => void;
}

export default function EditableElement({
  element,
  isSelected,
  onSelect,
  onChange,
}: EditableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementRect, setElementRect] = useState({ width: 0, height: 0 });

  // Update element dimensions when it changes
  useEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setElementRect({ width, height });
    }
  }, [element, isSelected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      if (isSelected) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          y: e.clientY,
        });
        
        // Set cursor style on body during drag
        document.body.style.cursor = 'move';
        
        // Prevent text selection during drag
        e.preventDefault();
      }
      
      // Always select the element when clicking on it
      if (!isSelected) {
        onSelect();
      }
    }
  };

  // Use document events for mouse move and up to ensure drag works even if cursor moves fast
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && elementRef.current) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        setDragStart({
          x: e.clientX,
          y: e.clientY,
        });

        // Get current position from styles
        const leftStr = element.style?.left as string || '0px';
        const topStr = element.style?.top as string || '0px';
        const currentLeft = parseInt(leftStr);
        const currentTop = parseInt(topStr);

        // Update the element's position
        onChange({
          ...element,
          style: {
            ...element.style,
            left: `${currentLeft + dx}px`,
            top: `${currentTop + dy}px`,
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, element, onChange]);

  const handleContentChange = (e: React.FormEvent<HTMLElement>) => {
    // Only update content if not dragging
    if (!isDragging) {
      const content = e.currentTarget.textContent || '';
      onChange({
        ...element,
        content,
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onSelect();
    }
  };

  // Common style for wrapper
  const wrapperStyle = {
    position: 'absolute',
    left: element.style?.left || '0px',
    top: element.style?.top || '0px',
    zIndex: element.style?.zIndex || 'auto',
  };

  // Render drag handle for selected elements
  const renderDragHandle = () => {
    if (!isSelected) return null;
    
    return (
      <div 
        className="absolute -top-7 left-0 bg-primary text-white px-2 py-1 rounded-t-md flex items-center text-xs font-medium"
        onMouseDown={handleMouseDown}
      >
        <Grip size={14} className="mr-1" />
        {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
      </div>
    );
  };

  const renderElement = () => {
    const elementClasses = `${isSelected ? 'element-selected' : ''} ${isDragging ? 'dragging' : ''}`;
    
    switch (element.type) {
      case 'text':
        return (
          <div 
            className="element-wrapper relative" 
            style={wrapperStyle as React.CSSProperties}
            ref={elementRef}
          >
            {renderDragHandle()}
            <div
              className={elementClasses}
              style={{
                ...element.style,
                // Remove position properties from the inner element
                position: 'static',
                left: 'auto',
                top: 'auto',
              } as React.CSSProperties}
              onClick={handleClick}
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={handleContentChange}
            >
              {element.content}
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div 
            className="element-wrapper relative" 
            style={wrapperStyle as React.CSSProperties}
            ref={elementRef}
          >
            {renderDragHandle()}
            <img
              className={elementClasses}
              src={element.src || ''}
              alt={element.alt || ''}
              style={{
                ...element.style,
                // Remove position properties from the inner element
                position: 'static',
                left: 'auto',
                top: 'auto',
              } as React.CSSProperties}
              onClick={handleClick}
            />
          </div>
        );
        
      case 'button':
        return (
          <div 
            className="element-wrapper relative" 
            style={wrapperStyle as React.CSSProperties}
            ref={elementRef}
          >
            {renderDragHandle()}
            <button
              className={elementClasses}
              style={{
                ...element.style,
                // Remove position properties from the inner element
                position: 'static',
                left: 'auto',
                top: 'auto',
              } as React.CSSProperties}
              onClick={handleClick}
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={handleContentChange}
            >
              {element.content}
            </button>
          </div>
        );
        
      case 'box':
        return (
          <div 
            className="element-wrapper relative" 
            style={wrapperStyle as React.CSSProperties}
            ref={elementRef}
          >
            {renderDragHandle()}
            <div
              className={`${elementClasses} min-h-[50px] min-w-[50px]`}
              style={{
                ...element.style,
                // Remove position properties from the inner element
                position: 'static',
                left: 'auto',
                top: 'auto',
              } as React.CSSProperties}
              onClick={handleClick}
            >
              {element.content}
            </div>
          </div>
        );
        
      default:
        return (
          <div 
            className="element-wrapper relative" 
            style={wrapperStyle as React.CSSProperties}
            ref={elementRef}
          >
            {renderDragHandle()}
            <div
              className={elementClasses}
              style={{
                ...element.style,
                // Remove position properties from the inner element
                position: 'static',
                left: 'auto',
                top: 'auto',
              } as React.CSSProperties}
              onClick={handleClick}
            >
              {element.content || `Unsupported element: ${element.type}`}
            </div>
          </div>
        );
    }
  };

  return renderElement();
}
