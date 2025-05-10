import { useLocation } from 'wouter';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [_, setLocation] = useLocation();

  const handleSelectTemplate = () => {
    setLocation(`/studio/${template.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          className="h-64 w-full object-cover" 
          src={template.thumbnail} 
          alt={`${template.name} template preview`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm opacity-90">{template.description}</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{template.category}</span>
        <Button 
          size="sm"
          onClick={handleSelectTemplate}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
