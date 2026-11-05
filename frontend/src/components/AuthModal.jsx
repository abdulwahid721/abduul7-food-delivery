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
  Smile,
  FileText,
} from 'lucide-react';

const AVATAR_OPTIONS = ['☕', '🦁', '🇪🇹', '👨‍🍳', '🥘', '🛵', '👑', '🌟'];

export default function AuthModal({ isOpen, onClose, user, onUserChange, onOpenAdmin, onOpenPrivacy }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Bole Medhanialem');
  const [avatar, setAvatar] = useState('☕');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Authenticating securely...');

  // Client-side brute force defense (cooldown timer)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

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

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setError(null);
    setLoading(true);
    setLoadingMsg('Connecting to secure Supabase backend...');

    const timer = setTimeout(() => {
      setLoadingMsg('Verifying credentials (free-tier server waking up)...');
    }, 2500);

    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      clearTimeout(timer);
      setFailedAttempts(0);
      onUserChange(res.user);
      onClose();
    } catch (err) {
      clearTimeout(timer);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

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
    setLoadingMsg('Creating encrypted user profile...');
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        address: address.trim(),
        avatar,
      });
      onUserChange(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = async () => {
    setIsLogin(true);
    setEmail('customer@abduul.et');
    setPassword('Customer@123');
    setError(null);
    setLoading(true);
    setLoadingMsg('Signing into Demo Customer account...');
    try {
      const res = await api.login('customer@abduul.et', 'Customer@123');
      onUserChange(res.user);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = async () => {
    setIsLogin(true);
    setEmail('admin@abduul.et');
    setPassword('Admin@123');
    setError(null);
    setLoading(true);
    setLoadingMsg('Signing into Store Admin account...');
    try {
      const res = await api.login('admin@abduul.et', 'Admin@123');
      onUserChange(res.user);
      onClose();
      if (onOpenAdmin) onOpenAdmin();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              {user?.avatar || '🛵'}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {user ? user.name : isLogin ? 'Secure Sign In' : 'Create Protected Account'}
              </h3>
              <p className="text-[11px] text-red-100">
                {user ? user.email : 'Protected with industry-grade Bcrypt hashing'}
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 bg-white rounded-lg shadow-2xs border border-stone-200">
                      {user.avatar || '☕'}
                    </span>
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">{user.name}</span>
                      <span className="text-stone-500 font-mono text-[10px]">{user.email}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-[#a61919]'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {user.phone && <p className="text-stone-600 font-mono text-[11px]">📱 {user.phone}</p>}
                {user.address && <p className="text-stone-600 text-[11px]">📍 {user.address}</p>}

                {/* Change Avatar / Profile Picture */}
                <div className="pt-2 border-t border-stone-200">
                  <p className="text-[10px] font-bold text-stone-500 mb-1 flex items-center gap-1">
                    <Smile className="w-3 h-3 text-stone-400" />
                    <span>Choose Profile Avatar (PP):</span>
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av}
                        onClick={() => {
                          const updated = api.updateProfile({ avatar: av });
                          if (updated) onUserChange(updated);
                        }}
                        className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition ${
                          user.avatar === av
                            ? 'bg-[#a61919] text-white shadow-xs'
                            : 'bg-white border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[10px] text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Session authenticated via Supabase PostgreSQL</span>
                </div>
              </div>

              {/* Admin Portal Button */}
              {user.role === 'admin' ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Open Store Admin Portal</span>
                </button>
              ) : (
                <button
                  onClick={fillDemoAdmin}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Switch to Store Admin View</span>
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
                <p className="text-[11px] font-bold text-stone-600 mb-1.5">⚡ Instant 1-Click Access:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    disabled={loading}
                    className="flex-1 bg-white hover:bg-stone-100 border border-stone-300 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-stone-700 transition flex items-center justify-center gap-1"
                  >
                    <span>☕ Demo Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    disabled={loading}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 py-1.5 px-2 rounded-lg text-[11px] font-bold text-amber-900 transition flex items-center justify-center gap-1"
                  >
                    <span>🛡️ Store Admin</span>
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
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Phone (Telebirr)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0911 234567"
                          className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Delivery Subcity</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Bole Medhanialem"
                          className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                        />
                      </div>
                    </div>

                    {/* Choose Avatar (PP) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Select Profile Avatar (PP)
                      </label>
                      <div className="flex gap-2">
                        {AVATAR_OPTIONS.map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setAvatar(av)}
                            className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                              avatar === av
                                ? 'bg-[#a61919] text-white shadow-xs scale-105'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading || lockoutTimer > 0 || (!isLogin && !passwordsMatch)}
                  className="w-full bg-[#a61919] hover:bg-[#881414] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
                >
                  {loading
                    ? loadingMsg
                    : lockoutTimer > 0
                    ? `Please wait ${lockoutTimer}s`
                    : isLogin
                    ? 'Sign In Securely'
                    : 'Create Protected Account'}
                </button>
              </form>

              {/* Privacy Policy & Terms Link */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setConfirmPassword('');
                  }}
                  className="font-semibold text-[#a61919] hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>

                {onOpenPrivacy && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPrivacy();
                    }}
                    className="flex items-center gap-1 text-stone-500 hover:text-stone-800 hover:underline"
                  >
                    <FileText className="w-3 h-3 text-stone-400" />
                    <span>Privacy Policy (PP)</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
