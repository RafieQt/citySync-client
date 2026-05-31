import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";

const ManageStaff = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staffList"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=staff");
      return res.data;
    },
  });

  const makeStaffMutation = useMutation({
    mutationFn: (staffEmail) => axiosSecure.patch(`/users/${staffEmail}`, { role: "staff" }),
    onSuccess: () => {
      toast.success("User promoted to staff!");
      setEmail("");
      queryClient.invalidateQueries(["staffList"]);
    },
    onError: () => toast.error("User not found or already staff"),
  });

  const removeStaffMutation = useMutation({
    mutationFn: (staffEmail) => axiosSecure.patch(`/users/${staffEmail}`, { role: "citizen" }),
    onSuccess: () => {
      toast.success("Staff removed");
      queryClient.invalidateQueries(["staffList"]);
    },
    onError: () => toast.error("Failed to remove staff"),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#03373D] mb-6">Manage Staff</h1>

      {/* Add Staff */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 max-w-lg">
        <h2 className="font-bold text-[#03373D] mb-3">Promote User to Staff</h2>
        <p className="text-sm text-gray-500 mb-4">Enter a registered user's email to make them a staff member.</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered flex-1 rounded-xl"
            placeholder="user@email.com"
          />
          <button
            onClick={() => { if (email) makeStaffMutation.mutate(email); }}
            disabled={makeStaffMutation.isPending || !email}
            className="btn bg-[#03373D] text-white border-none rounded-xl gap-2"
          >
            {makeStaffMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : <><UserPlus size={16} /> Add</>}
          </button>
        </div>
      </div>

      {/* Staff Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>
      ) : staffList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400">No staff members yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#03373D] bg-[#EAF8F7]">
                <th>Staff Member</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-[#03373D] text-white">
                          <span>{s.name?.charAt(0) || "S"}</span>
                        </div>
                      </div>
                      <p className="font-medium text-sm">{s.name || "Staff"}</p>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500">{s.email}</td>
                  <td><span className={`badge badge-sm ${s.status === "active" ? "badge-success" : "badge-error"}`}>{s.status}</span></td>
                  <td className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => { if (window.confirm("Remove this staff member?")) removeStaffMutation.mutate(s.email); }}
                      className="btn btn-xs btn-error btn-outline rounded-lg gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;