import React from 'react';
import { Bike, Phone, Mail, MapPin, Heart, ShieldCheck, Lock } from 'lucide-react';

export default function Footer({ onOpenAdmin, onOpenPrivacy }) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#871212] border-2 border-white flex flex-col items-center justify-center text-white shrink-0">
                <Bike className="w-3.5 h-3.5 -mb-0.5" />
                <span className="text-[7px] font-black uppercase">Abduul</span>
              </div>
              <div>
                <span className="text-base font-black text-white">Abduul Delivery</span>
                <p className="text-[10px] text-stone-400">Addis Ababa Real Restaurants Platform</p>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Connecting food lovers in Addis Ababa with the city’s top dining spots — Totot, Kategna, Yod Abyssinia, Effoi, Moyos, Castelli, and more.
            </p>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px] border border-stone-700">
                Telebirr Verified
              </span>
              <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px] border border-stone-700">
                CBE Birr Ready
              </span>
            </div>
          </div>

          {/* Real Addis Restaurants */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Featured Addis Restaurants</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#featured-restaurants" className="hover:text-white transition">Totot Traditional (Gerji)</a></li>
              <li><a href="#featured-restaurants" className="hover:text-white transition">Kategna Restaurant (Bole &amp; Sarbet)</a></li>
              <li><a href="#featured-restaurants" className="hover:text-white transition">Yod Abyssinia (Bole)</a></li>
              <li><a href="#featured-restaurants" className="hover:text-white transition">Effoi Artisanal Pizza (Atlas)</a></li>
              <li><a href="#featured-restaurants" className="hover:text-white transition">Moyos Smashed Burger (Bole)</a></li>
              <li><a href="#featured-restaurants" className="hover:text-white transition">Ristorante Castelli (Piazza)</a></li>
            </ul>
          </div>

          {/* Delivery Zones in Addis */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Delivery Coverage</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {['Bole Medhanialem', 'Gerji', 'Sarbet', 'Bole Atlas', 'Piazza', 'Kazanchis', 'Bisrate Gebriel', 'Summit', 'CMC Michael', 'Old Airport', 'Mexico', 'Megenagna'].map((zone) => (
                <span key={zone} className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700/50">
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Security & Customer Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Support &amp; Governance</h4>
            <div className="space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#a61919]" />
                <span className="font-mono text-white">+251 91 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#a61919]" />
                <span>orders@abduul-delivery.et</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#a61919] shrink-0 mt-0.5" />
                <span>Bole Road, Mega Building, Addis Ababa</span>
              </div>

              {/* Quick links for Admin and Privacy Policy (PP) */}
              <div className="pt-2 flex flex-col gap-1.5 border-t border-stone-800">
                <button
                  onClick={onOpenPrivacy}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-white transition text-[11px] text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy &amp; Data Security (PP)</span>
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition text-[11px] text-left font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Store Admin Portal (Dispatch &amp; Orders)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Abduul Food Delivery. Addis Ababa, Ethiopia.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Ethiopian cuisine lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
