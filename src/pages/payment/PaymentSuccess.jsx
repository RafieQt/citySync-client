import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import axiosSecure from "../../utils/axiosSecure";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("loading");

  const type = searchParams.get("type");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    axiosSecure
      .post("/verify-checkout-session", { sessionId })
      .then(() => {
        setStatus("success");
        queryClient.invalidateQueries(["dbUser"]);
        queryClient.invalidateQueries(["citizenStats"]);
        queryClient.invalidateQueries(["myIssues"]);
        const issueId = searchParams.get("issueId");
        if (issueId) queryClient.invalidateQueries(["issue", issueId]);
        if (type === "boost") {
          toast.success("Issue boosted to high priority!");
        } else {
          toast.success("Premium activated!");
        }
      })
      .catch(() => {
        setStatus("error");
        toast.error("Could not verify payment. Contact support if you were charged.");
      });
  }, [sessionId, type, queryClient]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-lg text-[#03373D]" />
        <p className="text-gray-500">Confirming your payment…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-red-600 font-semibold">Payment verification failed</p>
        <Link to="/dashboard" className="btn bg-[#03373D] text-white border-none rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <CheckCircle size={64} className="text-green-500" />
      <h1 className="text-2xl font-bold text-[#03373D]">Payment successful</h1>
      <p className="text-gray-500 max-w-md">
        {type === "boost"
          ? "Your issue has been boosted to high priority."
          : "You are now a Premium member with unlimited issue submissions."}
      </p>
      <Link to="/dashboard" className="btn bg-[#03373D] text-white border-none rounded-xl">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default PaymentSuccess;
