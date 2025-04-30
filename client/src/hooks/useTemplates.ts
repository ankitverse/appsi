import { useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Template, InsertTemplate } from '@/lib/types';

export function useTemplates() {
  const templatesQuery = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: InsertTemplate) => {
      const res = await apiRequest('POST', '/api/templates', template);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, template }: { id: string, template: Partial<Template> }) => {
      const res = await apiRequest('PUT', `/api/templates/${id}`, template);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      queryClient.invalidateQueries({ queryKey: [`/api/templates/${variables.id}`] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const getTemplate = useCallback((id: string) => {
    return useQuery<Template>({
      queryKey: [`/api/templates/${id}`],
    });
  }, []);

  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error,
    getTemplate,
    createTemplate: createTemplateMutation.mutateAsync,
    updateTemplate: updateTemplateMutation.mutateAsync,
    deleteTemplate: deleteTemplateMutation.mutateAsync,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
  };
}
