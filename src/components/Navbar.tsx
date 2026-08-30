import React, { useState } from 'react';
import { SpaceType } from '../types';
import { BookOpen, FlaskConical, FolderKanban, User, Mail, Home, Menu, X, Compass } from 'lucide-react';

interface NavbarProps {
  currentSpace: SpaceType;
  onNavigate: (space: SpaceType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSpace, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: SpaceType; label: string; metaphor: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Inicio', metaphor: 'Portada', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'sobre-mi', label: 'Sobre mí', metaphor: 'Trayectoria', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'explora-experimenta', label: 'Explora y experimenta', metaphor: 'Simulaciones', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'laboratorio', label: 'Laboratorio', metaphor: 'Modelos', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'recursos', label: 'Biblioteca', metaphor: 'Recursos', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'proyectos', label: 'Proyectos y experiencias', metaphor: 'Iniciativas', icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { id: 'contacto', label: 'Contacto', metaphor: 'Buzón', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  const handleSelect = (space: SpaceType) => {
    onNavigate(space);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E5E5E5] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Brand / Educator Name */}
        <button
          type="button"
          onClick={() => handleSelect('inicio')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A]"
        >
          <img
            src="data:image/jpeg;base64,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"
            alt="Retrato de Daniel Bustos"
            width={40}
            height={40}
            className="w-10 h-10 shrink-0 rounded-full object-cover border border-[#E5E5E5] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              Daniel Bustos
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#888888] font-mono">
              Espacio Pedagógico
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#555555]">
          {navItems.map((item) => {
            const isActive = currentSpace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`transition-colors relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1 font-semibold'
                    : 'hover:text-[#1A1A1A]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#F9F9F9] border border-[#E5E5E5] focus:outline-none"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E5E5] bg-[#FFFFFF] px-6 pt-3 pb-6 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentSpace === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white font-medium'
                    : 'text-[#555555] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className={`text-[11px] font-mono ${isActive ? 'text-[#888888]' : 'text-[#888888]'}`}>
                  {item.metaphor}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
