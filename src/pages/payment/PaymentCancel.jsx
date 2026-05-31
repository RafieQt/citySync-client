import { Link } from "react-router";
import { XCircle } from "lucide-react";

const PaymentCancel = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
    <XCircle size={64} className="text-amber-500" />
    <h1 className="text-2xl font-bold text-[#03373D]">Payment cancelled</h1>
    <p className="text-gray-500">No charge was made. You can try again anytime.</p>
    <Link to="/dashboard/subscription" className="btn bg-[#03373D] text-white border-none rounded-xl">
      Back to Subscription
    </Link>
  </div>
);

export default PaymentCancel;
