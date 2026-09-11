import React, { useState, useEffect } from 'react';
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
import { Experiment, ActiveNavSection } from './types';
import { EXPERIMENTS } from './data/experiments';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('home');
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [doubtModalTopic, setDoubtModalTopic] = useState<string | undefined>(undefined);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);

  // Handle hash-based and pathname routing on load and changes
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;

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

        const matched = EXPERIMENTS.find((e) => e.slug === slug);
        if (matched) {
          setActiveExperiment(matched);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Standard section navigation
      setActiveExperiment(null);
      if (hash === '#labs' || hash === '#virtual-labs') {
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
  }, []);

  const navigateToSection = (section: ActiveNavSection) => {
    setActiveSection(section);
    setActiveExperiment(null);
    window.location.hash = section === 'home' ? '' : `#${section}`;

    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionIdMap: Record<ActiveNavSection, string> = {
        'home': 'root',
        'labs': 'virtual-labs-section',
        'how-it-works': 'how-it-works-section',
        'mentoring': 'mentoring-section',
        'resources': 'resources-section',
        'about': 'about-section',
        'feedback': 'feedback-section',
      };
      const element = document.getElementById(sectionIdMap[section]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenLab = (exp: Experiment) => {
    setActiveExperiment(exp);
    window.location.hash = `#/labs/${exp.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalogue = () => {
    setActiveExperiment(null);
    window.location.hash = '#labs';
    setTimeout(() => {
      document.getElementById('virtual-labs-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenDoubtModal = (topic?: string) => {
    setDoubtModalTopic(topic);
    setIsDoubtModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Universal Responsive Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        onOpenLabs={() => {
          if (activeExperiment) {
            setActiveExperiment(null);
          }
          navigateToSection('labs');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeExperiment ? (
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
        ) : (
          /* Homepage Full Experience */
          <>
            <Hero
              onExploreLabs={() => navigateToSection('labs')}
              onHowItWorks={() => navigateToSection('how-it-works')}
            />

            <Mission />

            <LabPreview onOpenLab={handleOpenLab} />

            <HowItWorks onExploreLabs={() => navigateToSection('labs')} />

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
        onOpenLabs={() => {
          if (activeExperiment) {
            setActiveExperiment(null);
          }
          navigateToSection('labs');
        }}
      />

    </div>
  );
}
