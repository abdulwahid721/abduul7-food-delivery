import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, LogOut, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, user, onUserChange, onOpenAdmin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onUserChange(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, phone, address });
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#a61919] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {user ? 'My Abduul Account' : isLogin ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-red-100">
                {user ? `Logged in as ${user.email}` : 'Access your orders & saved delivery addresses'}
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
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
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
                <p className="text-stone-500">{user.email}</p>
                {user.phone && <p className="text-stone-600 font-mono">📱 {user.phone}</p>}
                {user.address && <p className="text-stone-600">📍 {user.address}</p>}
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
                  <span>Open Admin Dashboard (Orders &amp; Dishes)</span>
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
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Login / Register Form */
            <>
              {/* Quick Demo Pre-fill Pills */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                <p className="text-[11px] font-bold text-stone-500 mb-1.5">⚡ Quick Demo Accounts:</p>
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs font-semibold">
                  {error}
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
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Phone</label>
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
                  disabled={loading}
                  className="w-full bg-[#a61919] hover:bg-[#881414] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
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
