import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (role: 'student' | 'teacher') => void;
  onBackToHome: () => void;
  authNotice?: string | null;
}

export function LoginPage({
  onNavigateToRegister,
  onLoginSuccess,
  onBackToHome,
  authNotice,
}: LoginPageProps) {
  const { login, isConfigured, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AUTOMATIC NAVIGATION: If user is already authenticated or auth succeeds, navigate immediately
  useEffect(() => {
    if (!loading && (user || auth?.currentUser)) {
      onLoginSuccess(profile?.role || 'student');
    }
  }, [user, profile, loading, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(
        'Firebase configuration is missing in environment variables. Please check your .env file or Vercel settings.'
      );
      return;
    }

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userProfile = await login(email, password);
      onLoginSuccess(userProfile.role);
    } catch (err: any) {
      // If Firebase Auth has successfully authenticated the user, do not show a false login failure
      if (auth?.currentUser) {
        console.warn(
          'Firebase Authentication succeeded; profile resolution deferred to AuthContext:',
          err
        );
        onLoginSuccess('student');
        return;
      }

      console.error('Login error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials or register.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a few moments and try again.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already authenticated or signing in, show clean redirecting state
  if (!loading && (user || auth?.currentUser)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <span className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Signed In Successfully</h3>
            <p className="text-sm text-slate-500 mt-1">
              Loading your student dashboard and assigned practicals...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Lab Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your student experiments or teacher dashboard
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Firebase Configuration Pending</p>
                <p className="mt-1">
                  Add your Firebase project keys to <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> or Vercel environment variables to enable live cloud authentication.
                </p>
              </div>
            </div>
          </div>
        )}

        {authNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-2.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-indigo-950">Authentication Required</p>
              <p className="mt-0.5 leading-relaxed">{authNotice}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.edu"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3 text-center text-xs text-slate-500">
          <p>
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
            >
              Register as a Student
            </button>
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Teacher Notice:</span> Teacher accounts are verified through the institutional registry. If you are a faculty member, please sign in with your authorized school email.
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mt-1"
          >
            ← Back to Virtual Physics Lab Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
