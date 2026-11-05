import React from 'react';
import { X, ShieldCheck, Lock, Eye, KeyRound, MapPin, Database } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Privacy Policy &amp; Data Security</h3>
              <p className="text-[11px] text-stone-400">Abduul Food Delivery (Ethiopia)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1">
            <p className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Your Information is 100% Protected</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              We employ military-grade 256-bit SSL encryption, Bcrypt password hashing, and tokenized JWT authentication across all endpoints.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <KeyRound className="w-3.5 h-3.5 text-[#a61919]" />
              <span>1. Password &amp; Credential Protection</span>
            </h4>
            <p className="text-[11px] text-stone-600">
              Your password is never stored in plaintext. We utilize one-way salted <strong>Bcrypt hashing</strong> with constant-time verification. Even system administrators cannot see or reconstruct your raw password.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#a61919]" />
              <span>2. Delivery Address &amp; Contact Privacy</span>
            </h4>
            <p className="text-[11px] text-stone-600">
              Your Addis Ababa neighborhood, landmark, and phone number (e.g. Telebirr number) are only utilized by our authorized dispatchers and assigned courier to deliver your meal. We never sell, rent, or share personal contact data with third-party advertisers.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5 text-[#a61919]" />
              <span>3. Database Storage &amp; Encryption</span>
            </h4>
            <p className="text-[11px] text-stone-600">
              Our PostgreSQL database hosted on Supabase enforces Row Level Security (RLS) and encrypted connections (SSL-mode `require`), shielding all tables against SQL injection, data tampering, and eavesdropping.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <Eye className="w-3.5 h-3.5 text-[#a61919]" />
              <span>4. Account Control &amp; Data Rights</span>
            </h4>
            <p className="text-[11px] text-stone-600">
              You retain the right to edit your profile details, update delivery subcities, or request account closure at any time by contacting our support team at <strong className="text-stone-900 font-mono">privacy@abduul-delivery.et</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
}
