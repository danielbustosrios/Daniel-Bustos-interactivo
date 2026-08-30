import React, { useState, useMemo } from 'react';
import { ResourceItem } from '../types';
import { educationalResourcesData } from '../data/resources';
import { ResourceCard } from '../components/ResourceCard';
import { Search, BookOpen, X } from 'lucide-react';

interface ResourcesViewProps {
  onOpenResource: (resource: ResourceItem) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onOpenResource }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedFormat, setSelectedFormat] = useState<string>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<string>('Todos');

  const categories: string[] = ['Todas', 'Geometría', 'Física', 'Ciencias de la Computación', 'Pedagogía y Didáctica', 'Pensamiento Visual', 'Matemáticas'];
  const formats: string[] = ['Todos', 'Video', 'Guía interactiva', 'Simulación', 'Artículo', 'Micro-sitio', 'Taller'];

  const filteredResources = useMemo(() => {
    return educationalResourcesData.filter((item) => {
      // Search term
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;

      // Format
      const matchesFormat = selectedFormat === 'Todos' || item.format === selectedFormat;

      // Location
      const matchesLocation =
        selectedLocation === 'Todos' ||
        (selectedLocation === 'Interno' && item.location === 'internal') ||
        (selectedLocation === 'Externo' && item.location === 'external');

      return matchesSearch && matchesCategory && matchesFormat && matchesLocation;
    });
  }, [searchQuery, selectedCategory, selectedFormat, selectedLocation]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedFormat('Todos');
    setSelectedLocation('Todos');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'Todas' ||
    selectedFormat !== 'Todos' ||
    selectedLocation !== 'Todos';

  return (
    <div className="space-y-12 max-w-6xl mx-auto text-left">
      {/* Header */}
      <header className="space-y-3 border-b border-[#E5E5E5] pb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] font-mono block">
          Espacio Pedagógico • Biblioteca
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight">
          Biblioteca de Recursos & Guías Didácticas
        </h1>
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-3xl font-sans">
          Colección estructurada de artículos, simulaciones manipulables, guías de aula y micrositios complementarios. Diseñado con una base de datos modular y desacoplada en <code className="font-mono text-xs bg-[#F9F9F9] border border-[#E5E5E5] px-1.5 py-0.5 text-[#1A1A1A]">src/data/resources.ts</code> para facilitar la adición continua de nuevos materiales.
        </p>
      </header>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por concepto, temática o etiqueta (ej. Poincaré, ondas, grafos, péndulo)..."
            className="w-full pl-11 pr-10 py-3 bg-[#F9F9F9] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#888888] focus:outline-none focus:border-[#1A1A1A] transition-colors font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#1A1A1A] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
            <span className="uppercase tracking-wider text-[10px] font-bold">Área Temática</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#1A1A1A] hover:underline flex items-center gap-1 font-medium"
              >
                <X className="w-3 h-3" />
                <span>Restablecer filtros</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'bg-[#F9F9F9] hover:bg-[#E5E5E5] text-[#555555] border border-[#E5E5E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Formats & Location Bar */}
        <div className="pt-4 border-t border-[#EEEEEE] flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Format pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-[#888888] uppercase tracking-wider">Formato:</span>
            {formats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 font-mono text-[11px] transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white hover:bg-[#F9F9F9] text-[#666666] border border-[#E5E5E5]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Location toggle */}
          <div className="flex items-center border border-[#E5E5E5] bg-[#F9F9F9] font-mono text-[11px]">
            {['Todos', 'Interno', 'Externo'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1 transition-colors ${
                  selectedLocation === loc
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Resource Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#888888] border-b border-[#E5E5E5] pb-2">
          <span>Mostrando {filteredResources.length} de {educationalResourcesData.length} recursos catalogados</span>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onOpenInternal={onOpenResource}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white border border-[#E5E5E5] space-y-4">
            <BookOpen className="w-8 h-8 text-[#888888] mx-auto" />
            <h3 className="text-lg font-medium text-[#1A1A1A]">
              No se encontraron recursos coincidentes
            </h3>
            <p className="text-xs text-[#666666] max-w-sm mx-auto font-sans">
              Prueba modificando los términos de búsqueda o restableciendo los filtros temáticos.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono hover:bg-[#333333] transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
