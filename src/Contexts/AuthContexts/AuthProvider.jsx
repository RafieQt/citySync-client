
import { AuthContext } from './AuthContext';
import {  createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../../firebase/firebase.init'
const AuthProvider = ({children}) => {

    const registerUser = (email, password)=>{
        return createUserWithEmailAndPassword(email, password, auth)
    }

    const signUser = (email, password)=>{
        return signInWithEmailAndPassword( email, password)
    }

    const authInfo = {
        registerUser,
        signUser
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;