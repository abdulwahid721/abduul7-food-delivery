import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, Truck, MapPin, Phone, User, Smartphone, Banknote, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ADDIS_NEIGHBORHOODS } from '../data/locations';

export default function CheckoutModal({ currentUser, currentNeighborhood }) {
  const { isCheckoutOpen, setIsCheckoutOpen, total, subtotal, deliveryFee, tax, placeOrder } = useCart();

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Alex / ዮናስ');
  const [phone, setPhone] = useState(currentUser?.phone || '0911 23 45 67');
  const [subcity, setSubcity] = useState(currentNeighborhood?.name || 'Bole Medhanialem');
  const [address, setAddress] = useState(currentUser?.address || 'Cameroon St, House #342');
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentNeighborhood) {
      setSubcity(currentNeighborhood.name);
    }
  }, [currentNeighborhood]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        subcity: subcity.trim(),
        address: address.trim(),
        paymentMethod,
        userId: currentUser?.id || null,
      });

      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#a61919] text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Checkout &amp; Delivery</h3>
              <p className="text-[11px] text-stone-500">Fast delivery across Addis Ababa (25 - 35 mins)</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-7 h-7 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#a61919]" /> 1. Delivery Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg pl-8 pr-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Phone Number (Telebirr)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg pl-8 pr-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                    placeholder="0911 234567"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Location in Addis Ababa</label>
              <select
                value={subcity}
                onChange={(e) => setSubcity(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919] bg-white font-medium"
              >
                {ADDIS_NEIGHBORHOODS.map((nh) => (
                  <option key={nh.id} value={nh.name}>
                    {nh.name} ({nh.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">Street Address / Landmark</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-2 text-stone-900 focus:outline-none focus:border-[#a61919]"
                placeholder="House number, landmark, office, building"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Payment Provider (PP)
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('telebirr')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'telebirr'
                    ? 'border-[#a61919] bg-red-50 text-[#a61919] font-bold shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span className="text-[11px]">Telebirr</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cbe_birr')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'cbe_birr'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="text-[11px]">CBE Birr</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px]">Cash</span>
              </button>
            </div>

            {/* Payment Specific Guidance */}
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600">
              {paymentMethod === 'telebirr' && (
                <p>
                  📱 <strong>Telebirr:</strong> Pay upon driver arrival or verify using Telebirr merchant code <strong>#84920</strong> (Abduul Delivery).
                </p>
              )}
              {paymentMethod === 'cbe_birr' && (
                <p>
                  🏦 <strong>CBE Birr:</strong> Pay via CBE Mobile Banking or CBE Birr account <strong>10008492019</strong>.
                </p>
              )}
              {paymentMethod === 'cash' && (
                <p>
                  💵 <strong>Cash on Delivery:</strong> Please prepare exact cash in Ethiopian Birr (`ብር`) for the courier upon arrival.
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-stone-50 rounded-xl p-3 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">{subtotal.toLocaleString()} ብር</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery &amp; 15% VAT</span>
              <span className="font-mono">{(deliveryFee + tax).toLocaleString()} ብር</span>
            </div>
            <div className="flex justify-between font-black text-sm text-stone-900 pt-1 border-t border-stone-200">
              <span>Total Payable</span>
              <span className="font-mono text-[#a61919]">{total.toLocaleString()} ብር</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#a61919] hover:bg-[#881414] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition"
          >
            {isSubmitting ? (
              <span>Placing Order with Dispatch...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Place Order • {total.toLocaleString()} ብር</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
