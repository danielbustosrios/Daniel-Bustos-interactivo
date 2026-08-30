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
    { id: 'recursos', label: 'Biblioteca', metaphor: 'Recursos', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'laboratorio', label: 'Laboratorio', metaphor: 'Modelos', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'proyectos', label: 'Proyectos', metaphor: 'Iniciativas', icon: <FolderKanban className="w-3.5 h-3.5" /> },
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
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white text-[10px] font-bold group-hover:scale-105 transition-transform">
            DB
          </div>
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
        <div className="flex items-center gap-3">
          {/* Institutional note pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F9F9F9] border border-[#E5E5E5] text-[11px] font-mono text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
            <span>I.E. Carlos Vieco Ortiz</span>
          </div>

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
