import React, { useState } from 'react';
import { ScreenView } from '../types';

interface LoginMinimalScreenProps {
  onLoginSuccess: () => void;
  onSwitchToCard: () => void;
}

export const LoginMinimalScreen: React.FC<LoginMinimalScreenProps> = ({
  onLoginSuccess,
  onSwitchToCard,
}) => {
  const [email, setEmail] = useState('officer.compliance@bis.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] antialiased flex flex-col items-center justify-center p-6 select-none relative">
      {/* Top Banner Switcher Option */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onSwitchToCard}
          className="text-xs font-mono text-[#475569] hover:text-[#001e40] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors"
        >
          View Card Design (Screen 2) →
        </button>
      </div>

      <main className="w-full max-w-md px-6 py-10 md:py-16 flex flex-col items-center">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <div className="w-24 h-24 mb-6 flex items-center justify-center">
            <img
              alt="BIS Official Logo"
              className="w-full h-full object-contain drop-shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPxabaki830UY_7VywWhNS9NQogSgHM29QQRk6IqUZ4rCOJgVaI34htBD4M9z9xNxOMIC139mTrJYC6aK3wcYkpd7jaNZKkkkfemXEwmVWgUEwrymA7TyTqSCHKPUh7ptQSCv7UrzrxhnnJzvGSxqor8iObXpFgx0vMkNOqsZ8SN_3ZThwrg9ukPMe78bKwytJb1n4187lV8mqB1nwRQ9Kh5i6DXmQn5skp7sHBnk_5XiB2WWruT0X7A"
            />
          </div>
          <h1 className="text-5xl font-semibold text-[#001e40] tracking-tighter mb-2">
            BIS
          </h1>
          <p className="text-lg text-[#475569]">AI Assistant Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[11px] font-mono uppercase text-[#475569] tracking-wider"
              htmlFor="email-minimal"
            >
              Email Address
            </label>
            <input
              id="email-minimal"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-white border-b border-[#E2E8F0] px-0 py-3 text-base focus:outline-none focus:border-[#001e40] transition-colors placeholder:text-[#475569]/50"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[11px] font-mono uppercase text-[#475569] tracking-wider"
              htmlFor="password-minimal"
            >
              Password
            </label>
            <input
              id="password-minimal"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white border-b border-[#E2E8F0] px-0 py-3 text-base focus:outline-none focus:border-[#001e40] transition-colors placeholder:text-[#475569]/50"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-2">
            <a
              href="#forgot"
              onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered BIS domain.'); }}
              className="text-[11px] font-mono text-[#475569] hover:text-[#001e40] transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Primary Button */}
            <button
              type="submit"
              className="w-full bg-[#001e40] text-white font-mono text-[13px] uppercase h-14 rounded flex items-center justify-center hover:bg-[#003366] transition-all active:scale-[0.98] font-semibold tracking-wider shadow-sm"
            >
              Continue
            </button>

            {/* Secondary Button (Google) */}
            <button
              type="button"
              onClick={onLoginSuccess}
              className="w-full bg-white text-[#001e40] border border-[#E2E8F0] font-mono text-[13px] uppercase h-14 rounded flex items-center justify-center gap-3 hover:bg-[#f4f3f8] transition-all active:scale-[0.98] font-medium tracking-wider"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Footer / Sign Up Link */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#475569]">
            Don't have an account?{' '}
            <button
              onClick={onLoginSuccess}
              className="text-[#001e40] font-semibold hover:underline underline-offset-4 decoration-[#E2E8F0]"
            >
              Create one
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};
