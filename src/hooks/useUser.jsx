import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "../utils/axiosSecure";

const useUser = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      return res.data[0];
    },
  });

  return { dbUser, isLoading: isLoading || authLoading };
};

export default useUser;