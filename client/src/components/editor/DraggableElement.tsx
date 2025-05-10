import { useDrag } from 'react-dnd';
import { ElementType } from '@/lib/types';

interface DraggableElementProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
}

export default function DraggableElement({ type, label, icon }: DraggableElementProps) {
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
      className={`bg-white p-3 rounded shadow-sm hover:shadow cursor-move flex items-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="text-gray-500 mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
