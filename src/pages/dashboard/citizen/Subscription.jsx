import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useUser from "../../../hooks/useUser";
import axiosSecure from "../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { Crown, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { dbUser } = useUser();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { data } = await axiosSecure.post("/create-payment-intent", { amount: 500 });
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments", {
          type: "subscription",
          amount: 500,
          userEmail: user.email,
          transactionId: paymentIntent.id,
        });
        toast.success("You're now a Premium member! 🎉");
        queryClient.invalidateQueries(["dbUser"]);
      }
    } catch {
      toast.error("Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (dbUser?.isPremium) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Crown size={64} className="text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#03373D]">You're already Premium!</h2>
        <p className="text-gray-500 mt-2">Enjoy unlimited issue submissions and priority support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <Crown size={48} className="text-yellow-500 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-[#03373D]">Go Premium</h1>
        <p className="text-gray-500 mt-2">Unlock unlimited issue submissions and more.</p>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-[#EAF8F7] to-white rounded-2xl p-6 mb-6 border border-[#03373D]/10">
        <h2 className="font-bold text-[#03373D] mb-4 text-lg">Premium Benefits</h2>
        {[
          "Unlimited issue submissions (free = 3 max)",
          "Priority customer support",
          "Premium badge on your profile",
          "Boost any issue to high priority",
        ].map((b) => (
          <div key={b} className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500 shrink-0" />
            <span className="text-gray-700 text-sm">{b}</span>
          </div>
        ))}
        <div className="divider" />
        <p className="text-3xl font-extrabold text-[#03373D] text-center">৳500 <span className="text-base font-normal text-gray-400">/ one-time</span></p>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#03373D] mb-4">Payment Details</h3>
        <form onSubmit={handlePay} className="space-y-4">
          <div className="p-3 border border-gray-300 rounded-xl bg-gray-50">
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </div>
          <button
            type="submit"
            disabled={processing || !stripe}
            className="btn bg-[#03373D] hover:bg-[#05535D] text-white border-none w-full rounded-xl text-lg font-semibold"
          >
            {processing ? <span className="loading loading-spinner loading-sm" /> : "Pay ৳500 & Upgrade"}
          </button>
          <p className="text-xs text-gray-400 text-center">Payments are secure and encrypted via Stripe.</p>
        </form>
      </div>
    </div>
  );
};

const Subscription = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionForm />
  </Elements>
);

export default Subscription;