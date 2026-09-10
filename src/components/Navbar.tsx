import React, { useState } from 'react';
import { Atom, Menu, X, ArrowUpRight, Compass, BookOpen, HelpCircle, Info, Layers } from 'lucide-react';
import { ActiveNavSection } from '../types';

interface NavbarProps {
  activeSection: ActiveNavSection;
  onNavigate: (section: ActiveNavSection) => void;
  onOpenLabs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenLabs }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; id: ActiveNavSection; icon: React.ReactNode }[] = [
    { label: 'Home', id: 'home', icon: <Compass className="w-4 h-4" /> },
    { label: 'Virtual Labs', id: 'labs', icon: <Layers className="w-4 h-4" /> },
    { label: 'How It Works', id: 'how-it-works', icon: <Atom className="w-4 h-4" /> },
    { label: 'Mentoring', id: 'mentoring', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Resources', id: 'resources', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'About', id: 'about', icon: <Info className="w-4 h-4" /> },
  ];

  const handleLinkClick = (id: ActiveNavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Identity */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 text-indigo-200 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight font-sans">
                  Virtual Physics Lab
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Community Engagement Project
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Prominent CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="cta-explore-labs-navbar"
              onClick={onOpenLabs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-sm shadow-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <span>Explore Labs</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="cta-explore-labs-mobile-quick"
              onClick={onOpenLabs}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Explore
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Navigation Menu
          </div>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`mobile-nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-left transition-colors ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {link.icon}
                </span>
                {link.label}
              </button>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-100">
            <button
              id="mobile-cta-explore-labs"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLabs();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <span>Explore Virtual Labs</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
              University Community Engagement Project Prototype
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
