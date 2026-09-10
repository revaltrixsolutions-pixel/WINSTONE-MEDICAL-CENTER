import React, { useState } from "react";
import { shopApi } from "../../../../api/shop";
import type { Product } from "../../../../api/shop";


interface Props {
  product: Product;
  onClose: () => void;
}


export const ProductPopup: React.FC<Props> = ({ product, onClose }) => {
  const [step, setStep] = useState<"details" | "payment" | "delivery">("details");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_NOW" | "PAY_LATTER">("PAY_NOW");
  const [paymentId, setPaymentId] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return alert("Please enter name and phone");
    setStep("payment");
  };


  const handleProceedToDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "PAY_NOW" && !paymentId) return alert("Please enter your Payment ID");
    setStep("delivery");
  };


  const handleFinalSubmit = async (deliveryType: "WHATSAPP_1HR" | "STANDARD_5HR") => {
    try {
      setSubmitting(true);
      const order = await shopApi.createOrder({
        productId: product.id,
        customerName,
        customerPhone,
        paymentMethod,
        paymentId: paymentMethod === "PAY_NOW" ? paymentId : undefined,
        deliveryType
      });


      if (deliveryType === "WHATSAPP_1HR") {
        const businessPhone = "254708130100";
        const message = encodeURIComponent(
          `Hello! I just ordered ${product.name} (KSh ${product.price}).\nOrder ID: ${order.id}\nCustomer: ${customerName} (${customerPhone})\nPayment: ${paymentMethod} ${paymentId ? `(ID: ${paymentId})` : ""}\nRequesting 1-Hour WhatsApp Express Delivery!`
        );
        window.location.href = `https://wa.me/${businessPhone}?text=${message}`;
      } else {
        alert("Order placed successfully! Standard 5-hour delivery selected.");
        onClose();
      }
    } catch (err: any) {
      alert("Error creating order: " + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-0 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/60">
        {/* Header gradient bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl" />


        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all rounded-full p-2 text-2xl font-bold z-10"
        >
          &times;
        </button>


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
            <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">KSh ${product.price.toFixed(2)}</div>
            
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm" placeholder="254708130100" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Continue to Payment</button>
            </form>
          </div>
        )}


        {step === "payment" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm shadow">2</span>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Select Payment Method</h2>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl mb-5 border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-800">Total Price to Pay: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold">KSh ${product.price.toFixed(2)}</span></p>
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
                <button type="button" onClick={() => setStep("details")} className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition shadow-sm">Back</button>
                <button type="submit" className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">Continue</button>
              </div>
            </form>
          </div>
        )}


        {step === "delivery" && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-sm shadow">3</span>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Choose Delivery Option</h2>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">Select how you would like to complete your order confirmation.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleFinalSubmit("WHATSAPP_1HR")}
                disabled={submitting}
                className="w-full text-left p-5 rounded-2xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition flex justify-between items-center shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="font-extrabold text-green-900 text-lg">Confirm with WhatsApp (1hr delivery)</div>
                  <div className="text-xs text-green-700 mt-1">Opens WhatsApp instantly with order details for express delivery.</div>
                </div>
                <span className="text-green-800 font-extrabold bg-white px-3 py-1.5 rounded-xl border border-green-300 text-sm shadow-sm">1 Hr</span>
              </button>


              <button
                onClick={() => handleFinalSubmit("STANDARD_5HR")}
                disabled={submitting}
                className="w-full text-left p-5 rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 transition flex justify-between items-center shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="font-extrabold text-slate-800 text-lg">Continue without WhatsApp (5hrs delivery)</div>
                  <div className="text-xs text-slate-500 mt-1">Saves order directly to the system for standard processing.</div>
                </div>
                <span className="text-slate-800 font-extrabold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 text-sm shadow-sm">5 Hrs</span>
              </button>
            </div>


            <button type="button" onClick={() => setStep("payment")} className="mt-6 text-sm text-blue-600 hover:text-blue-800 hover:underline font-bold">&larr; Back to Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProductPopup;