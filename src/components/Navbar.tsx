import React, { useState } from 'react';
import {
  Atom,
  Menu,
  X,
  ArrowUpRight,
  Compass,
  BookOpen,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
  User,
  GraduationCap,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { ActiveNavSection } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeSection: ActiveNavSection;
  onNavigate: (section: ActiveNavSection) => void;
  onOpenLabs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenLabs }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  const navLinks: { label: string; id: ActiveNavSection; icon: React.ReactNode }[] = [
    { label: 'Home', id: 'home', icon: <Compass className="w-4 h-4" /> },
    { label: 'Virtual Labs', id: 'labs', icon: <Layers className="w-4 h-4" /> },
    { label: 'How It Works', id: 'how-it-works', icon: <Atom className="w-4 h-4" /> },
    { label: 'Mentoring', id: 'mentoring', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Resources', id: 'resources', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'About', id: 'about', icon: <Info className="w-4 h-4" /> },
    { label: 'Student Feedback', id: 'feedback', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleLinkClick = (id: ActiveNavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
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
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
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

          {/* Authentication & Action Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                {profile?.role === 'teacher' ? (
                  <button
                    onClick={() => handleLinkClick('teacher-dashboard')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      activeSection === 'teacher-dashboard'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teacher Dashboard</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[11px]">
                        {(profile?.displayName || user?.displayName || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left leading-tight">
                        <div className="text-xs font-semibold text-slate-900 max-w-[120px] truncate">
                          {profile?.displayName || user?.displayName || 'Student'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {profile?.classGrade || 'Class 9'} Div {profile?.division || 'A'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLinkClick('student-dashboard')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        activeSection === 'student-dashboard'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>My Dashboard</span>
                      <span className="text-[10px] opacity-80 font-mono">
                        ({profile?.classGrade || 'Class 9'} Div {profile?.division || 'A'})
                      </span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleLinkClick('register')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-2xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            <button
              id="cta-explore-labs-navbar"
              onClick={onOpenLabs}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>Labs</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={() =>
                  handleLinkClick(
                    profile?.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
                  )
                }
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('login')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100"
              >
                Sign In
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {/* User Status in Mobile Menu */}
          {user ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {(profile?.displayName || user?.displayName || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {profile?.displayName || user?.displayName || 'Student'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {profile?.role === 'teacher'
                      ? 'Faculty Teacher'
                      : `${profile?.classGrade || 'Class 9'} Div ${profile?.division || 'A'}`}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleLinkClick('login')}
                className="w-full py-2 text-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
              >
                Sign In
              </button>
              <button
                onClick={() => handleLinkClick('register')}
                className="w-full py-2 text-center rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                Register
              </button>
            </div>
          )}

          {user && (
            <button
              onClick={() =>
                handleLinkClick(
                  profile?.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard'
                )
              }
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold mb-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{profile?.role === 'teacher' ? 'Teacher Dashboard' : 'Student Lab Dashboard'}</span>
            </button>
          )}

          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`mobile-nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
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

          <div className="pt-3 mt-2 border-t border-slate-100">
            <button
              id="mobile-cta-explore-labs"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLabs();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs"
            >
              <span>Explore Virtual Labs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
