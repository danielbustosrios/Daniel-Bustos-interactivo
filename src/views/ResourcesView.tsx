import React from 'react';
import { ResourceItem } from '../types';

interface ResourcesViewProps {
  onOpenResource: (resource: ResourceItem) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = () => {
  return (
    <div className="max-w-6xl mx-auto text-left">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] tracking-tight">
        Biblioteca de Recursos &amp; Guías Didácticas
      </h1>
    </div>
  );
};
