import { useEffect, useState } from 'react';
import { ElementData, TextElementStyles, ImageElementStyles, ButtonElementStyles } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sliders,
  Type,
  Image as ImageIcon,
  Link,
  Box,
  Trash2,
  Copy,
  Move
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
  selectedElement: ElementData | null;
  onElementChange: (element: ElementData) => void;
}

export default function PropertiesPanel({
  selectedElement,
  onElementChange,
}: PropertiesPanelProps) {
  const [textStyles, setTextStyles] = useState<TextElementStyles>({});
  const [imageStyles, setImageStyles] = useState<ImageElementStyles>({});
  const [buttonStyles, setButtonStyles] = useState<ButtonElementStyles>({});
  const [activeTab, setActiveTab] = useState('style');

  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.type === 'text') {
        setTextStyles({
          fontSize: selectedElement.style?.fontSize as string || '16px',
          fontWeight: selectedElement.style?.fontWeight as string || 'normal',
          fontFamily: selectedElement.style?.fontFamily as string || 'Inter',
          color: selectedElement.style?.color as string || '#000000',
          textAlign: selectedElement.style?.textAlign as string || 'left',
        });
      } else if (selectedElement.type === 'image') {
        setImageStyles({
          width: selectedElement.style?.width as string || '100%',
          height: selectedElement.style?.height as string || 'auto',
          objectFit: selectedElement.style?.objectFit as 'cover' | 'contain' | 'fill' | 'none' || 'cover',
        });
      } else if (selectedElement.type === 'button') {
        setButtonStyles({
          backgroundColor: selectedElement.style?.backgroundColor as string || 'hsl(var(--primary))',
          color: selectedElement.style?.color as string || 'white',
          borderRadius: selectedElement.style?.borderRadius as string || '4px',
          border: selectedElement.style?.border as string || 'none',
          padding: selectedElement.style?.padding as string || '10px 20px',
        });
      }
    }
  }, [selectedElement]);

  const handleContentChange = (content: string) => {
    if (selectedElement) {
      onElementChange({
        ...selectedElement,
        content,
      });
    }
  };

  const handleSrcChange = (src: string) => {
    if (selectedElement) {
      onElementChange({
        ...selectedElement,
        src,
      });
    }
  };

  const handleAltChange = (alt: string) => {
    if (selectedElement) {
      onElementChange({
        ...selectedElement,
        alt,
      });
    }
  };

  const handleHrefChange = (href: string) => {
    if (selectedElement) {
      onElementChange({
        ...selectedElement,
        href,
      });
    }
  };

  const updateTextStyles = (newStyles: Partial<TextElementStyles>) => {
    if (selectedElement) {
      const updatedTextStyles = { ...textStyles, ...newStyles };
      setTextStyles(updatedTextStyles);
      
      onElementChange({
        ...selectedElement,
        style: {
          ...selectedElement.style,
          ...updatedTextStyles,
        },
      });
    }
  };

  const updateImageStyles = (newStyles: Partial<ImageElementStyles>) => {
    if (selectedElement) {
      const updatedImageStyles = { ...imageStyles, ...newStyles };
      setImageStyles(updatedImageStyles);
      
      onElementChange({
        ...selectedElement,
        style: {
          ...selectedElement.style,
          ...updatedImageStyles,
        },
      });
    }
  };

  const updateButtonStyles = (newStyles: Partial<ButtonElementStyles>) => {
    if (selectedElement) {
      const updatedButtonStyles = { ...buttonStyles, ...newStyles };
      setButtonStyles(updatedButtonStyles);
      
      onElementChange({
        ...selectedElement,
        style: {
          ...selectedElement.style,
          ...updatedButtonStyles,
        },
      });
    }
  };
  
  const getElementIcon = () => {
    if (!selectedElement) return null;
    
    switch (selectedElement.type) {
      case 'text':
        return <Type size={18} />;
      case 'image':
        return <ImageIcon size={18} />;
      case 'button':
        return <Link size={18} />;
      case 'box':
        return <Box size={18} />;
      default:
        return <Sliders size={18} />;
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-72 bg-gray-50 border-l border-gray-200 overflow-y-auto shadow-inner">
        <div className="p-5">
          <div className="flex items-center mb-6">
            <Sliders className="text-primary mr-2" />
            <h2 className="font-bold text-gray-800 text-lg">Properties</h2>
          </div>
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Move className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
              Select an element on the canvas to customize its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 overflow-hidden shadow-inner">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary mr-3">
              {getElementIcon()}
            </div>
            <h2 className="font-bold text-gray-800">
              {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
            </h2>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Layout</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100vh-190px)]">
            <div className="px-1">
              <TabsContent value="content" className="mt-0">
                {/* Content Tab - Element-specific content controls */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Text Content</Label>
                      <Textarea
                        className="resize-y min-h-[100px]"
                        placeholder="Enter text..."
                        value={selectedElement.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'button' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Button Text</Label>
                      <Input
                        placeholder="Enter button text..."
                        value={selectedElement.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Link URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={selectedElement.href || '#'}
                        onChange={(e) => handleHrefChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'image' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Image URL</Label>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={selectedElement.src || ''}
                        onChange={(e) => handleSrcChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Alt Text</Label>
                      <Input
                        placeholder="Image description..."
                        value={selectedElement.alt || ''}
                        onChange={(e) => handleAltChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'box' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Box Content</Label>
                      <p className="text-xs text-gray-500 mb-2">
                        Boxes are containers that can hold other elements.
                        Drag elements into this box on the canvas.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="style" className="mt-0">
                {/* Style Tab - Element-specific styling controls */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Font</Label>
                      <Select
                        value={textStyles.fontFamily}
                        onValueChange={(value) => updateTextStyles({ fontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Size</Label>
                        <Select
                          value={textStyles.fontSize}
                          onValueChange={(value) => updateTextStyles({ fontSize: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Size..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12px">12px</SelectItem>
                            <SelectItem value="14px">14px</SelectItem>
                            <SelectItem value="16px">16px</SelectItem>
                            <SelectItem value="18px">18px</SelectItem>
                            <SelectItem value="20px">20px</SelectItem>
                            <SelectItem value="24px">24px</SelectItem>
                            <SelectItem value="32px">32px</SelectItem>
                            <SelectItem value="40px">40px</SelectItem>
                            <SelectItem value="48px">48px</SelectItem>
                            <SelectItem value="64px">64px</SelectItem>
                            <SelectItem value="80px">80px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Weight</Label>
                        <Select
                          value={textStyles.fontWeight}
                          onValueChange={(value) => updateTextStyles({ fontWeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Weight..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Regular</SelectItem>
                            <SelectItem value="500">Medium</SelectItem>
                            <SelectItem value="600">Semibold</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="800">Extrabold</SelectItem>
                            <SelectItem value="900">Black</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Text Color</Label>
                      <div className="flex items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded-md mr-2 overflow-hidden">
                          <input
                            type="color"
                            value={textStyles.color || '#000000'}
                            onChange={(e) => updateTextStyles({ color: e.target.value })}
                            className="w-10 h-10 cursor-pointer transform -translate-y-1 -translate-x-1"
                          />
                        </div>
                        <Input
                          value={textStyles.color || '#000000'}
                          onChange={(e) => updateTextStyles({ color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Alignment</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={textStyles.textAlign === 'left' ? 'default' : 'outline'}
                          className={cn("flex-1 py-1.5", textStyles.textAlign === 'left' ? 'bg-primary text-primary-foreground' : 'bg-transparent')}
                          onClick={() => updateTextStyles({ textAlign: 'left' })}
                        >
                          <AlignLeft size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={textStyles.textAlign === 'center' ? 'default' : 'outline'}
                          className={cn("flex-1 py-1.5", textStyles.textAlign === 'center' ? 'bg-primary text-primary-foreground' : 'bg-transparent')}
                          onClick={() => updateTextStyles({ textAlign: 'center' })}
                        >
                          <AlignCenter size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={textStyles.textAlign === 'right' ? 'default' : 'outline'}
                          className={cn("flex-1 py-1.5", textStyles.textAlign === 'right' ? 'bg-primary text-primary-foreground' : 'bg-transparent')}
                          onClick={() => updateTextStyles({ textAlign: 'right' })}
                        >
                          <AlignRight size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={textStyles.textAlign === 'justify' ? 'default' : 'outline'}
                          className={cn("flex-1 py-1.5", textStyles.textAlign === 'justify' ? 'bg-primary text-primary-foreground' : 'bg-transparent')}
                          onClick={() => updateTextStyles({ textAlign: 'justify' })}
                        >
                          <AlignJustify size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'image' && (
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Width</Label>
                        <Input
                          placeholder="100%"
                          value={imageStyles.width || '100%'}
                          onChange={(e) => updateImageStyles({ width: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Height</Label>
                        <Input
                          placeholder="auto"
                          value={imageStyles.height || 'auto'}
                          onChange={(e) => updateImageStyles({ height: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Fit</Label>
                      <Select
                        value={imageStyles.objectFit || 'cover'}
                        onValueChange={(value: 'cover' | 'contain' | 'fill' | 'none') => updateImageStyles({ objectFit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fit..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover</SelectItem>
                          <SelectItem value="contain">Contain</SelectItem>
                          <SelectItem value="fill">Fill</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Border Radius</Label>
                      <Select
                        value={selectedElement.style?.borderRadius as string || '0'}
                        onValueChange={(value) => onElementChange({
                          ...selectedElement,
                          style: {
                            ...selectedElement.style,
                            borderRadius: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select radius..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="4px">Small (4px)</SelectItem>
                          <SelectItem value="8px">Medium (8px)</SelectItem>
                          <SelectItem value="12px">Large (12px)</SelectItem>
                          <SelectItem value="9999px">Rounded</SelectItem>
                          <SelectItem value="50%">Circle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'button' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Background</Label>
                      <div className="flex items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded-md mr-2 overflow-hidden">
                          <input
                            type="color"
                            value={buttonStyles.backgroundColor || 'hsl(var(--primary))'}
                            onChange={(e) => updateButtonStyles({ backgroundColor: e.target.value })}
                            className="w-10 h-10 cursor-pointer transform -translate-y-1 -translate-x-1"
                          />
                        </div>
                        <Input
                          value={buttonStyles.backgroundColor || 'hsl(var(--primary))'}
                          onChange={(e) => updateButtonStyles({ backgroundColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Text Color</Label>
                      <div className="flex items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded-md mr-2 overflow-hidden">
                          <input
                            type="color"
                            value={buttonStyles.color || '#ffffff'}
                            onChange={(e) => updateButtonStyles({ color: e.target.value })}
                            className="w-10 h-10 cursor-pointer transform -translate-y-1 -translate-x-1"
                          />
                        </div>
                        <Input
                          value={buttonStyles.color || '#ffffff'}
                          onChange={(e) => updateButtonStyles({ color: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Border Radius</Label>
                        <Select
                          value={buttonStyles.borderRadius || '4px'}
                          onValueChange={(value) => updateButtonStyles({ borderRadius: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select radius..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="4px">Small (4px)</SelectItem>
                            <SelectItem value="8px">Medium (8px)</SelectItem>
                            <SelectItem value="12px">Large (12px)</SelectItem>
                            <SelectItem value="9999px">Pill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Padding</Label>
                        <Select
                          value={buttonStyles.padding || '10px 20px'}
                          onValueChange={(value) => updateButtonStyles({ padding: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select padding..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5px 10px">XS</SelectItem>
                            <SelectItem value="8px 16px">Small</SelectItem>
                            <SelectItem value="10px 20px">Medium</SelectItem>
                            <SelectItem value="12px 24px">Large</SelectItem>
                            <SelectItem value="16px 32px">XL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedElement.type === 'box' && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Background</Label>
                      <div className="flex items-center">
                        <div className="w-8 h-8 border border-gray-300 rounded-md mr-2 overflow-hidden">
                          <input
                            type="color"
                            value={selectedElement.style?.backgroundColor as string || '#ffffff'}
                            onChange={(e) => onElementChange({
                              ...selectedElement,
                              style: {
                                ...selectedElement.style,
                                backgroundColor: e.target.value
                              }
                            })}
                            className="w-10 h-10 cursor-pointer transform -translate-y-1 -translate-x-1"
                          />
                        </div>
                        <Input
                          value={selectedElement.style?.backgroundColor as string || '#ffffff'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              backgroundColor: e.target.value
                            }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Border</Label>
                        <Select
                          value={selectedElement.style?.border as string || 'none'}
                          onValueChange={(value) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              border: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select border..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="1px solid #e2e8f0">Thin</SelectItem>
                            <SelectItem value="2px solid #e2e8f0">Medium</SelectItem>
                            <SelectItem value="3px solid #e2e8f0">Thick</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Radius</Label>
                        <Select
                          value={selectedElement.style?.borderRadius as string || '0'}
                          onValueChange={(value) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              borderRadius: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select radius..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="4px">Small (4px)</SelectItem>
                            <SelectItem value="8px">Medium (8px)</SelectItem>
                            <SelectItem value="12px">Large (12px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Padding</Label>
                      <Select
                        value={selectedElement.style?.padding as string || '0'}
                        onValueChange={(value) => onElementChange({
                          ...selectedElement,
                          style: {
                            ...selectedElement.style,
                            padding: value
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select padding..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">None</SelectItem>
                          <SelectItem value="10px">Small (10px)</SelectItem>
                          <SelectItem value="20px">Medium (20px)</SelectItem>
                          <SelectItem value="40px">Large (40px)</SelectItem>
                          <SelectItem value="5%">Percentage (5%)</SelectItem>
                          <SelectItem value="10%">Percentage (10%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                {/* Advanced Tab - Position & Size */}
                <div className="space-y-4 py-2">
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-3">Position</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Left</Label>
                        <Input
                          placeholder="auto"
                          value={selectedElement.style?.left as string || 'auto'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              left: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Top</Label>
                        <Input
                          placeholder="auto"
                          value={selectedElement.style?.top as string || 'auto'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              top: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-3">Size</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Width</Label>
                        <Input
                          placeholder="auto"
                          value={selectedElement.style?.width as string || 'auto'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              width: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Height</Label>
                        <Input
                          placeholder="auto"
                          value={selectedElement.style?.height as string || 'auto'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              height: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-3">Spacing</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Margin</Label>
                        <Input
                          placeholder="0"
                          value={selectedElement.style?.margin as string || '0'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              margin: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600 mb-1.5 block">Padding</Label>
                        <Input
                          placeholder="0"
                          value={selectedElement.style?.padding as string || '0'}
                          onChange={(e) => onElementChange({
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              padding: e.target.value
                            }
                          })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-3">Z-Index</h4>
                    <Input
                      type="number"
                      placeholder="0"
                      value={selectedElement.style?.zIndex as string || '0'}
                      onChange={(e) => onElementChange({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          zIndex: e.target.value
                        }
                      })}
                      className="text-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Higher values bring elements to the front.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
        
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <Copy size={14} className="mr-1" /> Duplicate
          </Button>
        </div>
      </div>
    </div>
  );
}