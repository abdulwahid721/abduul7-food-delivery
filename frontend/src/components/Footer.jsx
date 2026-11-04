import React from 'react';
import { Bike, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#a61919] border-2 border-white flex flex-col items-center justify-center text-white shrink-0">
                <Bike className="w-3.5 h-3.5 -mb-0.5" />
                <span className="text-[6px] font-black uppercase tracking-tight">Deliver</span>
                <span className="text-[7px] font-black uppercase">Addis</span>
              </div>
              <div>
                <span className="text-base font-black text-white">Deliver Addis</span>
                <p className="text-[10px] text-stone-400">Online Food &amp; Grocery Delivery</p>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Bringing food from top restaurants across Addis Ababa straight to your doorstep or workplace with speed and care.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px] border border-stone-700">
                Telebirr Verified
              </span>
              <span className="inline-block px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px] border border-stone-700">
                CBE Birr Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#featured-restaurants" className="hover:text-white transition">Featured Restaurants</a></li>
              <li><a href="#menu-catalog" className="hover:text-white transition">Menu &amp; Dishes</a></li>
              <li><a href="#menu-catalog" className="hover:text-white transition">Gurage Kitfo Specials</a></li>
              <li><a href="#menu-catalog" className="hover:text-white transition">Fasting Beyaynetu</a></li>
              <li><a href="#menu-catalog" className="hover:text-white transition">Drinks &amp; Spirits</a></li>
            </ul>
          </div>

          {/* Delivery Zones in Addis */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Delivery Coverage</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {['Bole Medhanialem', 'Bisrate Gebriel', 'Summit', 'Bole Atlas', 'Kazanchis', 'Sarbet', 'CMC', 'Gerji', 'Old Airport', 'Piazza', 'Mexico'].map((zone) => (
                <span key={zone} className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700/50">
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Customer Support</h4>
            <div className="space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#a61919]" />
                <span className="font-mono text-white">+251 91 123 4567 / +251 11 667 8901</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#a61919]" />
                <span>support@deliveraddis.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#a61919] shrink-0 mt-0.5" />
                <span>Bole Road, Mega Building 4th Floor, Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Deliver Addis Clone. Built with React &amp; Tailwind CSS for Addis Ababa.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Ethiopian cuisine lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
