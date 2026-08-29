import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignInCardScreenProps {
  onLoginSuccess: () => void;
  onSwitchToMinimal: () => void;
}

export const SignInCardScreen: React.FC<SignInCardScreenProps> = ({
  onLoginSuccess,
  onSwitchToMinimal,
}) => {
  const [email, setEmail] = useState('user@bis.gov.in');
  const [password, setPassword] = useState('GovStandards@2024');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="bg-[#f4f3f8] min-h-screen flex items-center justify-center p-6 text-[#1a1c1f] antialiased select-none relative">
      {/* Top Banner Switcher Option */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onSwitchToMinimal}
          className="text-xs font-mono text-[#475569] hover:text-[#001e40] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded transition-colors shadow-2xs"
        >
          View Minimal Design (Screen 1) →
        </button>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px]">
        {/* Login Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Card Header */}
          <div className="p-8 flex flex-col items-center border-b border-[#E2E8F0] bg-white">
            <img
              alt="BIS Logo"
              className="h-20 w-auto mb-6 object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UfkAgw8LbXmxHdWIr_DTpDX7C5HwSuhHJb-gTvbB_djZNI0YXzNfG6nIFzODzrhyoen5nGkPsvOESgl-AI_rC85S2CZXdgOjWae18D9LKMl5kkUACdRTEiw6FxYyg2BeqGYPEnRJlRxngSZPWjcYtwJnVAN83RQr934nveBNJh35OcZh986nwzincs8_TIQ_a2179aPWqRiaaiagowgQ56_bXQ2HtO5N5mD-oOTSMgdwmUk3rNLsc_nD-C"
            />
            <h1 className="text-3xl font-semibold text-[#001e40] text-center tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-[#475569] text-center mt-2">
              Access the BIS AI Assistant Portal
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  className="block font-mono text-[13px] text-[#475569] mb-2 uppercase tracking-wide"
                  htmlFor="card-email"
                >
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737780]" />
                  <input
                    id="card-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@bis.gov.in"
                    className="w-full pl-11 pr-4 py-2.5 bg-[#F7F9FB] border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none transition-colors text-sm text-[#1a1c1f]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="font-mono text-[13px] text-[#475569] uppercase tracking-wide"
                    htmlFor="card-password"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Password reset verification token dispatched.'); }}
                    className="text-xs text-[#001e40] hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737780]" />
                  <input
                    id="card-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 bg-[#F7F9FB] border border-[#c3c6d1] rounded focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] outline-none transition-colors text-sm text-[#1a1c1f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737780] hover:text-[#001e40] transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#bb0013] text-white font-mono text-[13px] font-semibold uppercase rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_2px_8px_rgba(187,0,19,0.2)] tracking-wider"
              >
                <span>Authenticate securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-[#E2E8F0] flex-1"></div>
              <span className="font-mono text-[11px] text-[#737780] uppercase tracking-widest">
                Or
              </span>
              <div className="h-px bg-[#E2E8F0] flex-1"></div>
            </div>

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={onLoginSuccess}
              className="w-full py-3 px-6 bg-[#F7F9FB] text-[#001e40] font-mono text-[13px] font-medium uppercase rounded border border-[#c3c6d1] hover:bg-[#eeedf2] hover:border-[#001e40] transition-all flex items-center justify-center gap-3 active:scale-[0.98] tracking-wider"
            >
              <svg height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    fill="#34A853"
                  />
                  <path
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center items-center gap-4 text-[11px] font-mono text-[#475569]">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#001e40] transition-colors underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#001e40] transition-colors underline-offset-2 hover:underline"
          >
            Terms of Service
          </a>
          <span>•</span>
          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#001e40] transition-colors underline-offset-2 hover:underline"
          >
            Contact Support
          </a>
        </div>
        <div className="mt-3 text-center">
          <p className="font-mono text-[11px] text-[#737780]">
            © 2024 Bureau of Indian Standards.
          </p>
        </div>
      </main>
    </div>
  );
};
