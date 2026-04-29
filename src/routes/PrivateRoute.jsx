import { Navigate } from "react-router";
import Loading from "../components/Loading/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({children}) => {

    const {user, loading} = useAuth();

    if(loading){
        return <Loading></Loading>
    }

    if(!user){
        return <Navigate to='/login' state={location.pathname}></Navigate>
    }

    return children;
};

export default PrivateRoute;