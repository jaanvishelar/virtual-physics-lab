import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Mission } from './components/Mission';
import { LabPreview } from './components/LabPreview';
import { HowItWorks } from './components/HowItWorks';
import { MentoringPreview } from './components/MentoringPreview';
import { ResourcePreview } from './components/ResourcePreview';
import { AboutSection } from './components/AboutSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { LabModuleView } from './components/LabModuleView';
import { OhmsLawLab } from './components/labs/ohms-law/OhmsLawLab';
import { SimplePendulumLab } from './components/labs/simple-pendulum/SimplePendulumLab';
import { HookesLawLab } from './components/labs/hookes-law/HookesLawLab';
import { ProjectileMotionLab } from './components/labs/projectile-motion/ProjectileMotionLab';
import { ConvexLensLab } from './components/labs/convex-lens/ConvexLensLab';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { FirebaseSetupBanner } from './components/common/FirebaseSetupBanner';
import { Experiment, ActiveNavSection } from './types';
import { EXPERIMENTS } from './data/experiments';
import { isPracticalAssignedToClass } from './data/practicalCatalog';
import { auth } from './lib/firebase';

function AppContent() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('home');
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [doubtModalTopic, setDoubtModalTopic] = useState<string | undefined>(undefined);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const { user, profile, loading } = useAuth();

  // Handle hash-based and pathname routing on load and changes
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const isAuthenticated = !!(user || auth?.currentUser);

      // Check for direct practical URL routing
      if (hash.startsWith('#/labs/') || hash.startsWith('#labs/') || pathname.startsWith('/labs/')) {
        let slug = '';
        if (hash.startsWith('#/labs/')) {
          slug = hash.replace('#/labs/', '');
        } else if (hash.startsWith('#labs/')) {
          slug = hash.replace('#labs/', '');
        } else if (pathname.startsWith('/labs/')) {
          slug = pathname.replace('/labs/', '');
        }

        // Clean up any trailing hashes or query params
        slug = slug.split('?')[0].split('#')[0];

        // While auth is still initializing, don't trigger premature redirect
        if (loading) {
          return;
        }

        // MANDATORY GATE: Unauthenticated visitors MUST NOT open any practical
        if (!isAuthenticated) {
          setActiveExperiment(null);
          setAuthNotice(
            'Student authentication is required to access the Virtual Physics Laboratory. Please sign in or register to begin.'
          );
          setActiveSection('login');
          window.location.hash = '#login';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const matched = EXPERIMENTS.find((e) => e.slug === slug);
        if (matched) {
          // CLASS-SPECIFIC RULE: If student, ensure practical is assigned to their standard
          if (profile?.role === 'student' && !isPracticalAssignedToClass(matched.slug, profile.classGrade)) {
            setActiveExperiment(null);
            setActiveSection('student-dashboard');
            window.location.hash = '#student-dashboard';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          setActiveExperiment(matched);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Standard section & auth navigation
      setActiveExperiment(null);
      if (hash === '#login' || hash === '#register') {
        if (isAuthenticated) {
          const target = profile?.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard';
          setActiveSection(target);
          window.location.hash = `#${target}`;
        } else {
          setActiveSection(hash === '#register' ? 'register' : 'login');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#student-dashboard' || hash === '#dashboard') {
        if (!isAuthenticated) {
          if (loading) return;
          setAuthNotice('Please sign in with your student account to access your laboratory dashboard.');
          setActiveSection('login');
          window.location.hash = '#login';
        } else {
          setActiveSection('student-dashboard');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#teacher-dashboard' || hash === '#teacher') {
        if (!isAuthenticated) {
          if (loading) return;
          setAuthNotice('Please sign in to access the educator dashboard.');
          setActiveSection('login');
          window.location.hash = '#login';
        } else {
          setActiveSection('teacher-dashboard');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#labs' || hash === '#virtual-labs') {
        setActiveSection('labs');
        document.getElementById('virtual-labs-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#how-it-works') {
        setActiveSection('how-it-works');
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#mentoring') {
        setActiveSection('mentoring');
        document.getElementById('mentoring-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#resources') {
        setActiveSection('resources');
        document.getElementById('resources-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#about') {
        setActiveSection('about');
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#feedback') {
        setActiveSection('feedback');
        document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveSection('home');
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [user, profile, loading]);

  const navigateToSection = (section: ActiveNavSection) => {
    setActiveSection(section);
    setActiveExperiment(null);
    window.location.hash = section === 'home' ? '' : `#${section}`;

    if (
      section === 'home' ||
      section === 'login' ||
      section === 'register' ||
      section === 'student-dashboard' ||
      section === 'teacher-dashboard'
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionIdMap: Partial<Record<ActiveNavSection, string>> = {
        'labs': 'virtual-labs-section',
        'how-it-works': 'how-it-works-section',
        'mentoring': 'mentoring-section',
        'resources': 'resources-section',
        'about': 'about-section',
        'feedback': 'feedback-section',
      };
      const elementId = sectionIdMap[section];
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Gatekeeper for opening any laboratory
  const handleOpenLab = (exp: Experiment) => {
    // 1. Unauthenticated gate
    if (!user) {
      setAuthNotice(
        'Student authentication is required to access the Virtual Physics Laboratory. Please sign in or register to begin.'
      );
      navigateToSection('login');
      return;
    }

    // 2. Class-specific syllabus gate
    if (profile?.role === 'student' && !isPracticalAssignedToClass(exp.slug, profile.classGrade)) {
      navigateToSection('student-dashboard');
      return;
    }

    setActiveExperiment(exp);
    window.location.hash = `#/labs/${exp.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalogue = () => {
    setActiveExperiment(null);
    if (user && profile?.role === 'student') {
      navigateToSection('student-dashboard');
    } else {
      window.location.hash = '#labs';
      setTimeout(() => {
        document.getElementById('virtual-labs-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleOpenDoubtModal = (topic?: string) => {
    setDoubtModalTopic(topic);
    setIsDoubtModalOpen(true);
  };

  // Global action when clicking "Virtual Labs" or "Explore Labs"
  const handleExploreLabsAction = () => {
    if (activeExperiment) {
      setActiveExperiment(null);
    }
    if (!user) {
      setAuthNotice(
        'Student authentication is required to access the Virtual Physics Laboratory. Please sign in with your student credentials or register your standard.'
      );
      navigateToSection('login');
    } else if (profile?.role === 'student') {
      navigateToSection('student-dashboard');
    } else {
      navigateToSection('labs');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Firebase Setup Notice (appears only if environment credentials are not configured) */}
      <FirebaseSetupBanner />

      {/* Universal Responsive Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        onOpenLabs={handleExploreLabsAction}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Strictly prevent unauthenticated visitors from viewing any lab component */}
        {activeExperiment && user ? (
          activeExperiment.slug === 'ohms-law' ? (
            /* Interactive Virtual Laboratory - Experiment 01 */
            <OhmsLawLab
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
            />
          ) : activeExperiment.slug === 'simple-pendulum' ? (
            /* Interactive Virtual Laboratory - Experiment 02 */
            <SimplePendulumLab
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
            />
          ) : activeExperiment.slug === 'hookes-law' ? (
            /* Interactive Virtual Laboratory - Experiment 03 */
            <HookesLawLab
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
            />
          ) : activeExperiment.slug === 'projectile-motion' ? (
            /* Interactive Virtual Laboratory - Experiment 04 */
            <ProjectileMotionLab
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
            />
          ) : activeExperiment.slug === 'convex-lens' ? (
            /* Interactive Virtual Laboratory - Experiment 05 */
            <ConvexLensLab
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
            />
          ) : (
            /* Other Experiment Modules (Development Architecture View) */
            <LabModuleView
              experiment={activeExperiment}
              onBack={handleBackToCatalogue}
              onSelectExperiment={handleOpenLab}
              onOpenDoubtModal={handleOpenDoubtModal}
            />
          )
        ) : activeSection === 'login' ? (
          <LoginPage
            authNotice={authNotice}
            onNavigateToRegister={() => {
              setAuthNotice(null);
              navigateToSection('register');
            }}
            onLoginSuccess={(role) => {
              setAuthNotice(null);
              navigateToSection(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
            }}
            onBackToHome={() => {
              setAuthNotice(null);
              navigateToSection('home');
            }}
          />
        ) : activeSection === 'register' ? (
          <RegisterPage
            authNotice={authNotice}
            onNavigateToLogin={() => {
              setAuthNotice(null);
              navigateToSection('login');
            }}
            onRegisterSuccess={() => {
              setAuthNotice(null);
              navigateToSection('student-dashboard');
            }}
            onBackToHome={() => {
              setAuthNotice(null);
              navigateToSection('home');
            }}
          />
        ) : activeSection === 'student-dashboard' ? (
          <StudentDashboard
            onStartExperiment={handleOpenLab}
            onNavigateHome={() => navigateToSection('home')}
          />
        ) : activeSection === 'teacher-dashboard' ? (
          <TeacherDashboard onNavigateHome={() => navigateToSection('home')} />
        ) : (
          /* Homepage Full Experience */
          <>
            <Hero
              onExploreLabs={handleExploreLabsAction}
              onHowItWorks={() => navigateToSection('how-it-works')}
            />

            <Mission />

            <LabPreview onOpenLab={handleOpenLab} />

            <HowItWorks onExploreLabs={handleExploreLabsAction} />

            <MentoringPreview
              initialExperimentTopic={doubtModalTopic}
              isOpenModalDirectly={isDoubtModalOpen}
              onCloseModalDirectly={() => setIsDoubtModalOpen(false)}
            />

            <ResourcePreview />

            <AboutSection />

            <FeedbackSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateToSection}
        onOpenLabs={handleExploreLabsAction}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
