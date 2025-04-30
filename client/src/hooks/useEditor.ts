import { useState, useCallback } from 'react';
import { ElementData } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function useEditor(initialElements: ElementData[] = []) {
  const [elements, setElements] = useState<ElementData[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<ElementData[][]>([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addElement = useCallback((element: Omit<ElementData, 'id'>) => {
    const newElement = { ...element, id: uuidv4() };
    const newElements = [...elements, newElement];
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    setElements(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSelectedElementId(newElement.id);
    
    return newElement.id;
  }, [elements, history, historyIndex]);

  const updateElement = useCallback((id: string, updates: Partial<ElementData>) => {
    const newElements = elements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    );
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    setElements(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  const removeElement = useCallback((id: string) => {
    const newElements = elements.filter(element => element.id !== id);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    
    setElements(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [elements, selectedElementId, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    elements,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
