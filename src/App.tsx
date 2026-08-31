import React, { useState, useEffect } from 'react';
import { SpaceType, ResourceItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ExploreView } from './views/ExploreView';
import { LabView } from './views/LabView';
import { ProjectsView } from './views/ProjectsView';
import { ContactView } from './views/ContactView';
import { InternalGuideModal } from './components/InternalGuideModal';
import { educationalResourcesData } from './data/resources';

export default function App() {
  const [currentSpace, setCurrentSpace] = useState<SpaceType>('inicio');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  // Handle hash changes if user navigated via anchor links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash === 'sobre-mi' || 
        hash === 'explora-experimenta' ||
        hash === 'laboratorio' || 
        hash === 'proyectos' || 
        hash === 'contacto' || 
        hash === 'inicio'
      ) {
        setCurrentSpace(hash as SpaceType);
      } else if (hash === 'recursos') {
        setCurrentSpace('inicio');
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else if (hash === 'cuanto-cuesta-hoy') {
        setCurrentSpace('explora-experimenta');
      } else if (hash === 'poincare-guide') {
        const found = educationalResourcesData.find((r) => r.id === 'disco-poincare-intro');
        if (found) setSelectedResource(found);
      } else if (hash === 'wave-lab') {
        const found = educationalResourcesData.find((r) => r.id === 'ondas-interferencia-ciechanowski');
        if (found) setSelectedResource(found);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (space: SpaceType) => {
    setCurrentSpace(space);
    window.location.hash = space === 'inicio' ? '' : space;
  };

  const handleOpenResource = (resource: ResourceItem) => {
    setSelectedResource(resource);
  };

  const handleCloseResource = () => {
    setSelectedResource(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FFFFFF]">
      {/* Top Navigation */}
      <Navbar currentSpace={currentSpace} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {currentSpace === 'inicio' && (
          <HomeView onNavigate={handleNavigate} onOpenResource={handleOpenResource} />
        )}
        {currentSpace === 'sobre-mi' && (
          <AboutView onNavigate={handleNavigate} />
        )}
        {currentSpace === 'explora-experimenta' && (
          <ExploreView />
        )}
        {currentSpace === 'laboratorio' && (
          <LabView />
        )}
        {currentSpace === 'proyectos' && (
          <ProjectsView />
        )}
        {currentSpace === 'contacto' && (
          <ContactView />
        )}
      </main>

      {/* Article / Interactive Guide Modal */}
      {selectedResource && (
        <InternalGuideModal resource={selectedResource} onClose={handleCloseResource} />
      )}

      {/* Persistent Pedagogical Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
