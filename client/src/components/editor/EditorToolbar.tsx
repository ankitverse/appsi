import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

interface EditorToolbarProps {
  viewportSize: string;
  onViewportChange: (size: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function EditorToolbar({
  viewportSize,
  onViewportChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: EditorToolbarProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="h-6 border-r border-gray-300"></div>
        <Button
          variant={viewportSize === 'desktop' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onViewportChange('desktop')}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={viewportSize === 'tablet' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onViewportChange('tablet')}
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={viewportSize === 'mobile' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onViewportChange('mobile')}
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center">
        <Select 
          value={viewportSize === 'custom' ? 'custom' : '100'}
          onValueChange={(value) => {
            if (value !== '100') {
              onViewportChange('custom');
            }
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="50">50%</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
