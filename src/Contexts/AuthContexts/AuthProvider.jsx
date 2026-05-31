import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from '../../firebase/firebase.init';
import { useEffect, useState } from 'react';
import axios from 'axios';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (name, photo) => {
    return updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
  };

  const signUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    return signOut(auth);
  };

  const syncSession = async (currentUser) => {
  const api = import.meta.env.VITE_API_URL;
  if (!api) {
    console.error("VITE_API_URL is not set in citysync-client/.env");
    return;
  }
  try {
    // ✅ Only save to DB if profile is complete
    if (currentUser.displayName && currentUser.photoURL) {
      await axios.post(`${api}/users`, {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      });
    }
    const res = await axios.post(`${api}/jwt`, { email: currentUser.email });
    localStorage.setItem("token", res.data.token);
  } catch (err) {
    console.error("Auth sync error:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        syncSession(currentUser);
      } else {
        localStorage.removeItem('token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    registerUser,
    updateUser,
    loading,
    user,
    signUser,
    signInGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;