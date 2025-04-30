import { ElementType } from '@/lib/types';
import { useDrag } from 'react-dnd';
import {
  Type,
  Image,
  Square,
  Link,
  Menu,
  Images,
  Video,
  Table,
  FormInput,
  LayoutGrid,
  Heading,
  Text as TextIcon,
  MousePointer,
  Layers
} from 'lucide-react';

interface DraggableElementProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  description?: string;
  category: string;
}

function DraggableElement({ type, label, icon, description, category }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-md shadow-sm hover:shadow-md cursor-move 
      transition-all duration-200 border border-gray-100 hover:border-primary/40 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="flex items-center">
        <div className="text-primary mr-3 p-2 bg-primary/10 rounded-md">{icon}</div>
        <div>
          <span className="font-medium text-gray-800">{label}</span>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ElementsPanel() {
  // Group elements by category
  const elementCategories = {
    'Basic Elements': [
      { 
        type: 'text', 
        label: 'Text', 
        icon: <TextIcon size={18} />, 
        description: 'Add text content with custom styling',
        category: 'Basic Elements'
      },
      { 
        type: 'image', 
        label: 'Image', 
        icon: <Image size={18} />, 
        description: 'Insert image with custom dimensions',
        category: 'Basic Elements'
      },
      { 
        type: 'box', 
        label: 'Container', 
        icon: <Square size={18} />, 
        description: 'A flexible container for layout',
        category: 'Basic Elements'
      },
      { 
        type: 'button', 
        label: 'Button', 
        icon: <MousePointer size={18} />, 
        description: 'Interactive button with link',
        category: 'Basic Elements'
      },
    ],
    'Layout Components': [
      { 
        type: 'menu', 
        label: 'Navigation Menu', 
        icon: <Menu size={18} />, 
        description: 'Create navigation links',
        category: 'Layout Components'
      },
      { 
        type: 'gallery', 
        label: 'Image Gallery', 
        icon: <Images size={18} />, 
        description: 'Multiple images in grid layout',
        category: 'Layout Components'
      },
    ],
    'Advanced Components': [
      { 
        type: 'video', 
        label: 'Video Player', 
        icon: <Video size={18} />, 
        description: 'Embed video content',
        category: 'Advanced Components'
      },
      { 
        type: 'table', 
        label: 'Table', 
        icon: <Table size={18} />, 
        description: 'Display data in rows and columns',
        category: 'Advanced Components'
      },
      { 
        type: 'form', 
        label: 'Contact Form', 
        icon: <FormInput size={18} />, 
        description: 'Input fields for data collection',
        category: 'Advanced Components'
      },
    ]
  };

  // Flatten the elements for rendering
  const allElements = Object.values(elementCategories).flat();

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto shadow-inner">
      <div className="p-5">
        <div className="flex items-center mb-6">
          <Layers className="text-primary mr-2" />
          <h2 className="font-bold text-gray-800 text-lg">Elements</h2>
        </div>
        
        {Object.entries(elementCategories).map(([category, elements]) => (
          <div key={category} className="mb-6">
            <h3 className="font-medium text-gray-600 text-sm mb-3 uppercase tracking-wider">{category}</h3>
            <div className="space-y-3">
              {elements.map((element) => (
                <DraggableElement
                  key={element.type}
                  type={element.type}
                  label={element.label}
                  icon={element.icon}
                  description={element.description}
                  category={element.category}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-700 mb-2 flex items-center">
            <LayoutGrid size={16} className="mr-2" />
            Pro Tip
          </h4>
          <p className="text-sm text-blue-600">
            Drag elements onto the canvas and customize them using the properties panel on the right.
          </p>
        </div>
      </div>
    </div>
  );
}
