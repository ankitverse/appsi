import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TemplateCard from '@/components/TemplateCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Template } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['/api/templates'],
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error loading templates</h2>
          <p className="mt-2 text-sm text-red-700">Please try again later</p>
        </div>
      </div>
    );
  }

  // Extract unique categories from templates
  const categories = templates 
    ? [...new Set(templates.map((template: Template) => template.category))]
    : [];

  // Filter templates by active category
  const filteredTemplates = templates
    ? activeCategory === "All"
      ? templates
      : templates.filter((template: Template) => template.category === activeCategory)
    : [];

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">Choose a Template</h1>
          <p className="mt-1 text-sm text-gray-500">Select a template to start building your website.</p>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Template Categories */}
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {isLoading ? (
              // Loading state with skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              // Templates display
              filteredTemplates.map((template: Template) => (
                <TemplateCard key={template.id} template={template} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
