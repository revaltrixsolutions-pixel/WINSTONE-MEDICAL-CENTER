import React, { useRef, useState } from "react";
import { shopApi } from "../../../../api/shop";
import type { Product } from "../../../../api/shop";

interface Props {
  product: Product;
  onClose: () => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const ProductPopup: React.FC<Props> = ({ product, onClose }) => {
  const [step, setStep] = useState<"details" | "customer" | "payment" | "delivery">("details");

  // Quantity and Notes state
  const [quantity, setQuantity] = useState<number>(1);
  const [customerNote, setCustomerNote] = useState<string>("");

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState({
    county: "",
    town: "",
    place: "",
    road: "",
    building: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"PAY_NOW" | "PAY_LATTER">("PAY_NOW");
  const [paymentId, setPaymentId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Guards against a fast double-click creating two orders. useState alone can
  // lag a render behind a rapid second click; a ref is checked/set synchronously.
  const orderInFlight = useRef(false);

  // Computed total price
  const totalPrice = product.price * quantity;

  const handleProceedToCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return alert("Please select a valid quantity");
    }
    setStep("customer");
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const email = customerEmail.trim();

    if (!name || !phone) {
      return alert("Please enter your name and phone number");
    }
    if (email && !isValidEmail(email)) {
      return alert("Please enter a valid email address, or leave it blank");
    }

    const county = location.county.trim();
    const town = location.town.trim();
    const place = location.place.trim();
    const road = location.road.trim();

    if (!county || !town || !place || !road) {
      return alert("Please fill in County, Town, Place/Area, and Road/Street so we can deliver your order");
    }

    // Persist trimmed values so nothing with stray whitespace gets sent later.
    setCustomerName(name);
    setCustomerPhone(phone);
    setCustomerEmail(email);
    setLocation(prev => ({ ...prev, county, town, place, road, building: prev.building.trim() }));

    setStep("payment");
  };

  const handleProceedToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (paymentMethod === "PAY_NOW" && !paymentId.trim()) {
      return alert("Please enter your Payment ID / Transaction Code");
    }
    if (paymentMethod === "PAY_NOW") {
      setPaymentId(paymentId.trim());
    }
    setStep("delivery");
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
      },
      () => alert("Unable to retrieve your location. Please enter manually.")
    );
  };

  const handleFinalSubmit = async (deliveryType: "WHATSAPP_1HR" | "STANDARD_5HR") => {
    if (orderInFlight.current) return; // already submitting, ignore extra clicks
    orderInFlight.current = true;
    setErrorMsg(null);

    try {
      setSubmitting(true);

      const payload = {
        productId: product.id,
        quantity,
        customerNote: customerNote.trim() || undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        location: {
          county: location.county.trim(),
          town: location.town.trim(),
          place: location.place.trim(),
          road: location.road.trim(),
          building: location.building.trim() || undefined,
          lat: location.lat ?? undefined,
          lng: location.lng ?? undefined,
        },
        paymentMethod,
        paymentId: paymentMethod === "PAY_NOW" ? paymentId.trim() : undefined,
        deliveryType,
      };

      const order = await shopApi.createOrder(payload);

      if (!order || !order.id) {
        // The request didn't throw, but we didn't get back a saved record either.
        throw new Error("The server did not confirm the order was saved. Please try again.");
      }

      if (deliveryType === "WHATSAPP_1HR") {
        const businessPhone = "254708130100";
        const locText = [
          location.county, location.town, location.place, location.road, location.building
        ].filter(Boolean).join(", ") || "Not provided";
        const mapsLink = location.lat && location.lng
          ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
          : "No location pin";
        const message = encodeURIComponent(
          `Hello! I just ordered ${quantity}x ${product.name} (Total: KSh ${totalPrice.toFixed(2)}).\n` +
          `Order ID: ${order.id}\n` +
          (payload.customerNote ? `Note: ${payload.customerNote}\n` : "") +
          `Customer: ${payload.customerName}\n` +
          `Phone: ${payload.customerPhone}\n` +
          (payload.customerEmail ? `Email: ${payload.customerEmail}\n` : "") +
          `Location: ${locText}\n` +
          `Maps: ${mapsLink}\n` +
          `Payment: ${paymentMethod}${payload.paymentId ? ` (ID: ${payload.paymentId})` : ""}\n` +
          `Requesting 1-Hour WhatsApp Express Delivery!`
        );
        window.location.href = `https://wa.me/${businessPhone}?text=${message}`;
      } else {
        alert(`Order placed successfully! Order ID: ${order.id}. Standard 5-hour delivery selected.`);
        onClose();
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Unknown error";
      setErrorMsg(message);
      alert("Error creating order: " + message);
    } finally {
      setSubmitting(false);
      orderInFlight.current = false;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-0 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/60">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all rounded-full p-2 text-2xl font-bold z-10"
        >
          &times;
        </button>

        {errorMsg && (
          <div className="mx-6 mt-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {step === "details" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow">1</span>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{product.name}</h2>
            </div>
            {product.imageUrls[0] && (
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-64 object-cover rounded-2xl mb-5 shadow-md border border-slate-200" />
            )}
            <p className="text-slate-700 mb-2 font-semibold">{product.shortDescription}</p>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Unit Price</div>
                <div className="text-lg font-extrabold text-slate-700">KSh {product.price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Amount</div>
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  KSh {totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <form onSubmit={handleProceedToCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Order Note (Optional)</label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm"
                    placeholder="e.g. Call before delivery"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-4">
                Buy Now
              </button>
            </form>
          </div>
        )}

        {step === "customer" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm shadow">2</span>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Details</h2>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="254708130100" />
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-slate-800 mb-3">Delivery Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">County *</label>
                    <input type="text" required value={location.county} onChange={e => setLocation(prev => ({ ...prev, county: e.target.value }))} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="e.g. Nairobi" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Town *</label>
                    <input type="text" required value={location.town} onChange={e => setLocation(prev => ({ ...prev, town: e.target.value }))} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="e.g. Thika" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Place/Area *</label>
                    <input type="text" required value={location.place} onChange={e => setLocation(prev => ({ ...prev, place: e.target.value }))} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="e.g. Githunguri" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Road/Street *</label>
                    <input type="text" required value={location.road} onChange={e => setLocation(prev => ({ ...prev, road: e.target.value }))} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="e.g. Kimanzi Road" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Building/House Name</label>
                  <input type="text" value={location.building} onChange={e => setLocation(prev => ({ ...prev, building: e.target.value }))} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="e.g. WMC Plaza, Room 12" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" onClick={handleGetLocation} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-md">
                    📍 Get My Location
                  </button>
                  {location.lat && location.lng && (
                    <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep("details")} className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition shadow-sm">Back</button>
                <button type="submit" className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Continue to Payment</button>
              </div>
            </form>
          </div>
        )}

        {step === "payment" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-sm shadow">3</span>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Select Payment Method</h2>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl mb-5 border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold">Qty: {quantity} item(s)</p>
                <p className="font-bold text-slate-800">Total Price to Pay:</p>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold text-xl">KSh {totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex gap-3 mb-5">
              <button type="button" onClick={() => setPaymentMethod("PAY_NOW")} className={`flex-1 py-3 rounded-2xl border-2 font-bold transition shadow-sm ${paymentMethod === "PAY_NOW" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Pay Now</button>
              <button type="button" onClick={() => setPaymentMethod("PAY_LATTER")} className={`flex-1 py-3 rounded-2xl border-2 font-bold transition shadow-sm ${paymentMethod === "PAY_LATTER" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Pay Later</button>
            </div>

            <form onSubmit={handleProceedToDelivery}>
              {paymentMethod === "PAY_NOW" && (
                <div className="mb-5 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
                  <p className="text-sm font-bold text-blue-900 mb-2">Account Details for Transfer:</p>
                  <p className="text-sm text-blue-800 font-medium">Pay Bill No.: <span className="font-extrabold">100400</span></p>
                  <p className="text-sm text-blue-800 font-medium mb-3">Account No.: <span className="font-extrabold">WMC</span></p>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Enter Payment ID / Transaction Code</label>
                  <input type="text" required value={paymentId} onChange={e => setPaymentId(e.target.value)} className="w-full border border-blue-200 rounded-2xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm" placeholder="e.g. QHX8923XYZ" />
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("customer")} className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition shadow-sm">Back</button>
                <button type="submit" className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Continue</button>
              </div>
            </form>
          </div>
        )}

        {step === "delivery" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm shadow">4</span>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Choose Delivery Option</h2>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">Select how you would like to complete your order confirmation.</p>

            <div className="space-y-3">
              <button
                onClick={() => handleFinalSubmit("WHATSAPP_1HR")}
                disabled={submitting}
                className="w-full text-left p-5 rounded-2xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition flex justify-between items-center shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-extrabold text-green-900 text-lg">Confirm with WhatsApp (1hr delivery)</div>
                  <div className="text-xs text-green-700 mt-1">Opens WhatsApp instantly with order details for express delivery.</div>
                </div>
                <span className="text-green-800 font-extrabold bg-white px-3 py-1.5 rounded-xl border border-green-300 text-sm shadow-sm">
                  {submitting ? "Saving…" : "1 Hr"}
                </span>
              </button>

              <button
                onClick={() => handleFinalSubmit("STANDARD_5HR")}
                disabled={submitting}
                className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 transition flex justify-between items-center shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div>
                  <div className="font-extrabold text-slate-800 text-lg">Continue without WhatsApp (5hrs delivery)</div>
                  <div className="text-xs text-slate-500 mt-1">Saves order directly to the system for standard processing.</div>
                </div>
                <span className="text-slate-800 font-extrabold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 text-sm shadow-sm">
                  {submitting ? "Saving…" : "5 Hrs"}
                </span>
              </button>
            </div>

            <button type="button" disabled={submitting} onClick={() => setStep("payment")} className="mt-6 text-sm text-blue-600 hover:text-blue-800 hover:underline font-bold disabled:opacity-50">&larr; Back to Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPopup;