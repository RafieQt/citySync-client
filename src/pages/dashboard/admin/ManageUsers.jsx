import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../utils/axiosSecure";
import toast from "react-hot-toast";
import { Crown, Ban, CheckCircle } from "lucide-react";

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=citizen");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ email, updates }) => axiosSecure.patch(`/users/${email}`, updates),
    onSuccess: () => {
      toast.success("User updated!");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleBlock = (email, currentStatus) => {
    updateMutation.mutate({
      email,
      updates: { status: currentStatus === "active" ? "blocked" : "active" },
    });
  };

  const handleMakePremium = (email) => {
    updateMutation.mutate({ email, updates: { isPremium: true } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#03373D] mb-6">Manage Users</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-[#03373D]" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#03373D] bg-[#EAF8F7]">
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Premium</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-[#03373D] text-white">
                          <span className="text-sm">{u.name?.charAt(0) || u.email?.charAt(0)?.toUpperCase()}</span>
                        </div>
                      </div>
                      <p className="font-medium text-sm">{u.name || "—"}</p>
                    </div>
                  </td>
                  <td className="text-xs text-gray-500">{u.email}</td>
                  <td>
                    <span className={`badge badge-sm ${u.status === "active" ? "badge-success" : "badge-error"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.isPremium
                      ? <span className="badge badge-warning badge-sm">Premium</span>
                      : <span className="badge badge-ghost badge-sm">Free</span>
                    }
                  </td>
                  <td className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBlock(u.email, u.status)}
                        className={`btn btn-xs px-2 rounded-lg gap-1 ${u.status === "active" ? "btn-error btn-outline" : "btn-success btn-outline"}`}
                      >
                        {u.status === "active" ? <><Ban size={12} /> Block</> : <><CheckCircle size={12} /> Unblock</>}
                      </button>
                      {!u.isPremium && (
                        <button
                          onClick={() => handleMakePremium(u.email)}
                          className="btn btn-xs px-2 btn-warning btn-outline rounded-lg gap-1"
                        >
                          <Crown size={12} /> Premium
                        </button>
                      )}
                    </div>
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

export default ManageUsers;