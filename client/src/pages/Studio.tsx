import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ElementData } from '@/lib/types';
import StudioHeader from '@/components/editor/StudioHeader';
import ElementsPanel from '@/components/editor/ElementsPanel';
import EditorToolbar from '@/components/editor/EditorToolbar';
import Canvas from '@/components/editor/Canvas';
import PropertiesPanel from '@/components/editor/PropertiesPanel';

export default function Studio() {
  const { templateId } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [viewportSize, setViewportSize] = useState('desktop');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elements, setElements] = useState<ElementData[]>([]);
  const [history, setHistory] = useState<ElementData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templateName, setTemplateName] = useState('');

  // Fetch template
  const { data: template, isLoading, error } = useQuery({
    queryKey: [`/api/templates/${templateId}`],
  });

  // Save template mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { name: string, content: string }) => {
      return apiRequest('PUT', `/api/templates/${templateId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/templates/${templateId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  useEffect(() => {
    if (template) {
      try {
        setTemplateName(template.name);
        
        // Parse content if it's a string, or use it directly if it's already an object
        let parsedContent: ElementData[];
        if (typeof template.content === 'string') {
          parsedContent = JSON.parse(template.content);
        } else {
          parsedContent = template.content;
        }
        
        setElements(parsedContent);
        // Initialize history with the current state
        setHistory([parsedContent]);
        setHistoryIndex(0);
      } catch (err) {
        console.error("Error parsing template content:", err);
        toast({
          title: "Error",
          description: "Failed to load template content",
          variant: "destructive",
        });
      }
    }
  }, [template]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Template</h1>
        <p className="text-gray-600 mb-6">The requested template could not be loaded.</p>
        <button 
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setLocation('/')}
        >
          Return to Templates
        </button>
      </div>
    );
  }

  const handleElementsChange = (newElements: ElementData[]) => {
    setElements(newElements);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const handleSave = async (name: string) => {
    try {
      await saveMutation.mutateAsync({
        name,
        content: JSON.stringify(elements),
      });
      setTemplateName(name);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId) || null 
    : null;

  return (
    <div>
      <StudioHeader 
        templateName={templateName} 
        templateId={templateId}
        onSave={handleSave}
      />
      
      <div className="flex studio-content">
        {/* Left Sidebar - Elements Panel */}
        <ElementsPanel />
        
        {/* Main Editor Area */}
        <div className="flex-grow bg-gray-200 overflow-y-auto relative">
          {/* Editor Toolbar */}
          <EditorToolbar 
            viewportSize={viewportSize}
            onViewportChange={setViewportSize}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          
          {/* Canvas */}
          <Canvas 
            elements={elements}
            viewportSize={viewportSize}
            selectedElementId={selectedElementId}
            onElementSelect={setSelectedElementId}
            onElementsChange={handleElementsChange}
          />
        </div>
        
        {/* Right Sidebar - Properties Panel */}
        <PropertiesPanel 
          selectedElement={selectedElement}
          onElementChange={(updatedElement) => {
            const updatedElements = elements.map(el => 
              el.id === updatedElement.id ? updatedElement : el
            );
            handleElementsChange(updatedElements);
          }}
        />
      </div>
    </div>
  );
}
