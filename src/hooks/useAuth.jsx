import { use } from "react";
import { AuthContext } from "../Contexts/AuthContexts/AuthContext";

const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;