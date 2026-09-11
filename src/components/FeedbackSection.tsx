import React from 'react';

export const FeedbackSection: React.FC = () => {
  return (
    <section
      id="feedback-section"
      className="py-20 bg-white border-t border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            Student Feedback
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Tell Us About Your Experience
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-relaxed">
            Your feedback helps us understand how useful and easy to use the
            Virtual Physics Lab is and helps us improve the learning experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeDFQJej7R_8uuklnTe8BKcOoP189LlU03r04JHBIhm0n4jAA/viewform?embedded=true"
            width="100%"
            height="900"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Virtual Physics Lab Student Feedback Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
};