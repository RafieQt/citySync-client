import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";

const AdminPayments = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#03373D]">Payments</h1>
        <div className="badge badge-lg bg-[#03373D] text-white p-4">Total Revenue: ৳{total}</div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400">No payments yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#03373D] bg-[#EAF8F7]">
                <th>Transaction ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Issue</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="hover">
                  <td className="text-xs text-gray-400 font-mono max-w-[120px] truncate">{p.transactionId}</td>
                  <td className="text-xs text-gray-600 max-w-[140px] truncate">{p.userEmail}</td>
                  <td>
                    <span className={`badge badge-sm capitalize ${p.type === "boost" ? "badge-warning" : "badge-info"}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500 max-w-[140px] truncate">{p.issueTitle || "—"}</td>
                  <td className="font-bold text-[#03373D]">৳{p.amount}</td>
                  <td className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;