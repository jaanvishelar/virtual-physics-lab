import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';
import { isFirebaseConfigured } from '../../lib/firebase';

export function FirebaseSetupBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const configured = isFirebaseConfigured();

  if (configured) return null;

  const envSample = `VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456`;

  const copySample = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Firebase Project Setup Needed:</strong> To store live student registrations and experiment attempts in your own Firebase project, configure your environment keys.
          </span>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-950 cursor-pointer"
          >
            <span>{isOpen ? 'Hide Instructions' : 'View Setup Steps'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-amber-950 mb-1">Steps in your Firebase Console:</h4>
            <ol className="list-decimal list-inside space-y-1 text-amber-900/90 leading-relaxed">
              <li>
                Open{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium inline-flex items-center gap-0.5"
                >
                  console.firebase.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                with your Google Account.
              </li>
              <li>Click <strong>Add Project</strong> (or choose your existing project).</li>
              <li>Under <strong>Build &gt; Authentication</strong>, click <strong>Get Started</strong> and enable <strong>Email/Password</strong>.</li>
              <li>Under <strong>Build &gt; Firestore Database</strong>, click <strong>Create Database</strong>.</li>
              <li>In Project Settings &gt; General &gt; <strong>Your apps</strong>, click <strong>&lt;/&gt; (Web)</strong> to register an app.</li>
              <li>Copy the configuration keys into your local <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> or Vercel Project Environment Variables.</li>
            </ol>
          </div>

          <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-200/70">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-amber-950 font-mono text-[11px]">.env / Vercel Keys</span>
              <button
                onClick={copySample}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-200/80 hover:bg-amber-200 text-amber-950 text-[11px] font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] overflow-x-auto text-amber-950/90 whitespace-pre">
              {envSample}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
