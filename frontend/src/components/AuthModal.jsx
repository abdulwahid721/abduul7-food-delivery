import React, { useState, useMemo } from 'react';
import { api } from '../services/api';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Shield,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, user, onUserChange, onOpenAdmin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Client-side brute force defense (cooldown timer)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  if (!isOpen) return null;

  // Calculate password strength score (0 to 4)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-stone-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-500' };
      default:
        return { score: 1, label: 'Too Weak', color: 'bg-red-500' };
    }
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (isLogin || !confirmPassword) return true;
    return password === confirmPassword;
  }, [isLogin, password, confirmPassword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      setFailedAttempts(0);
      onUserChange(res.user);
      onClose();
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      // Trigger 30-second cooldown after 4 consecutive failed attempts
      if (newAttempts >= 4) {
        setLockoutTimer(30);
        const interval = setInterval(() => {
          setLockoutTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      setError(err.message || 'Invalid email address or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for your security.');
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must contain both letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      });
      onUserChange(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setIsLogin(true);
    setEmail('customer@abduul.et');
    setPassword('Customer@123');
    setError(null);
  };

  const fillDemoAdmin = () => {
    setIsLogin(true);
    setEmail('admin@abduul.et');
    setPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Security Verified Banner */}
        <div className="bg-stone-900 px-4 py-2 text-white text-[11px] flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-1.5 text-stone-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted &amp; Rate-Limited</span>
          </div>
          <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
            Bcrypt + JWT
          </span>
        </div>

        {/* Header */}
        <div className="p-4 bg-[#a61919] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {user ? 'My Abduul Account' : isLogin ? 'Secure Sign In' : 'Create Protected Account'}
              </h3>
              <p className="text-[11px] text-red-100">
                {user ? user.email : 'Protected with industry-grade password hashing'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{user.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#a61919]'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-stone-500 font-mono text-[11px]">{user.email}</p>
                {user.phone && <p className="text-stone-600 font-mono">📱 {user.phone}</p>}
                {user.address && <p className="text-stone-600">📍 {user.address}</p>}

                <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[10px] text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Session authenticated via Supabase PostgreSQL</span>
                </div>
              </div>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Open Admin Control Panel (Orders &amp; Dishes)</span>
                </button>
              )}

              <button
                onClick={() => {
                  api.logout();
                  onUserChange(null);
                }}
                className="w-full bg-red-50 hover:bg-red-100 text-[#a61919] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Securely</span>
              </button>
            </div>
          ) : (
            /* Login / Register Form */
            <>
              {/* Quick Demo Credentials */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                <p className="text-[11px] font-bold text-stone-500 mb-1.5">⚡ Verified Demo Accounts:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="flex-1 bg-white hover:bg-stone-100 border border-stone-300 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-stone-700 transition"
                  >
                    👤 Customer
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="flex-1 bg-white hover:bg-stone-100 border border-stone-300 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-stone-700 transition"
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Cooldown Lockout Warning */}
              {lockoutTimer > 0 && (
                <div className="bg-amber-50 border border-amber-300 text-amber-800 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Too many failed attempts. Cooldown active: {lockoutTimer}s</span>
                </div>
              )}

              <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-3">
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex / ዮናስ"
                        className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-semibold text-stone-700">Password</label>
                    {!isLogin && (
                      <span className="text-[10px] text-stone-400">Min. 8 characters</span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-9 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Meter (Registration only) */}
                {!isLogin && password && (
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">Security strength:</span>
                      <span className="font-bold text-stone-800">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 h-full rounded-full transition-all duration-300 ${
                            step <= passwordStrength.score ? passwordStrength.color : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password (Registration only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`w-full text-xs border rounded-lg pl-9 pr-8 py-2 text-stone-900 focus:outline-none ${
                          confirmPassword && !passwordsMatch
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-stone-200 focus:border-[#a61919]'
                        }`}
                      />
                      {confirmPassword && passwordsMatch && (
                        <CheckCircle2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                      )}
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-[10px] text-red-500 mt-1 font-medium">Passwords do not match</p>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0911 234567"
                        className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Location</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Bole, Addis"
                        className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || lockoutTimer > 0 || (!isLogin && !passwordsMatch)}
                  className="w-full bg-[#a61919] hover:bg-[#881414] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
                >
                  {loading
                    ? 'Authenticating securely...'
                    : lockoutTimer > 0
                    ? `Please wait ${lockoutTimer}s`
                    : isLogin
                    ? 'Sign In Securely'
                    : 'Create Protected Account'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setConfirmPassword('');
                  }}
                  className="text-xs font-semibold text-[#a61919] hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
