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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold p-2"
        >
          &times;
        </button>

        {step === "details" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">{product.name}</h2>
            {product.imageUrls[0] && (
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-56 object-cover rounded-lg mb-4" />
            )}
            <p className="text-slate-700 mb-2 font-medium">{product.shortDescription}</p>
            <p className="text-slate-500 text-sm mb-4">{product.description}</p>
            <div className="text-xl font-bold text-blue-600 mb-6">KSh ${product.price.toFixed(2)}</div>
            
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Your Name</label>
                <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="254708130100" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold shadow transition">Continue to Payment</button>
            </form>
          </div>
        )}

        {step === "payment" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Select Payment Method</h2>
            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
              <p className="font-semibold text-slate-800">Total Price to Pay: <span className="text-blue-600">KSh ${product.price.toFixed(2)}</span></p>
            </div>
            
            <div className="flex gap-3 mb-4">
              <button type="button" onClick={() => setPaymentMethod("PAY_NOW")} className={`flex-1 py-2.5 rounded-xl border font-medium transition ${paymentMethod === "PAY_NOW" ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Pay Now</button>
              <button type="button" onClick={() => setPaymentMethod("PAY_LATTER")} className={`flex-1 py-2.5 rounded-xl border font-medium transition ${paymentMethod === "PAY_LATTER" ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>Pay Later</button>
            </div>

            <form onSubmit={handleProceedToDelivery}>
              {paymentMethod === "PAY_NOW" && (
                <div className="mb-4 bg-blue-50/70 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Account Details for Transfer:</p>
                  <p className="text-sm text-blue-800">Bank: Equity Bank / M-Pesa Till: 123456</p>
                  <p className="text-sm text-blue-800 mb-3">Account Name: Winstone Medical Centre</p>
                  <label className="block text-sm font-medium text-slate-700">Enter Payment ID / Transaction Code</label>
                  <input type="text" required value={paymentId} onChange={e => setPaymentId(e.target.value)} className="w-full border border-slate-200 rounded-xl p-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. QHX8923XYZ" />
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("details")} className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition">Back</button>
                <button type="submit" className="w-2/3 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold shadow transition">Continue</button>
              </div>
            </form>
          </div>
        )}

        {step === "delivery" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900">Choose Delivery Option</h2>
            <p className="text-slate-600 text-sm mb-6">Select how you would like to complete your order confirmation.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleFinalSubmit("WHATSAPP_1HR")}
                disabled={submitting}
                className="w-full text-left p-4 rounded-xl border-2 border-green-500 bg-green-50/60 hover:bg-green-100/70 transition flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-green-900">Confirm with WhatsApp (1hr delivery)</div>
                  <div className="text-xs text-green-700">Opens WhatsApp instantly with order details for express delivery.</div>
                </div>
                <span className="text-green-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-green-200 text-sm">1 Hr</span>
              </button>

              <button
                onClick={() => handleFinalSubmit("STANDARD_5HR")}
                disabled={submitting}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-slate-800">Continue without WhatsApp (5hrs delivery)</div>
                  <div className="text-xs text-slate-500">Saves order directly to the system for standard processing.</div>
                </div>
                <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-sm">5 Hrs</span>
              </button>
            </div>

            <button type="button" onClick={() => setStep("payment")} className="mt-6 text-sm text-blue-600 hover:underline font-medium">&larr; Back to Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPopup;
