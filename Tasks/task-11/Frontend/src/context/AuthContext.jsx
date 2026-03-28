import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile, sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) setFavorites(snap.data().favorites || []);
          else await setDoc(doc(db, 'users', u.uid), { favorites: [], displayName: u.displayName || '', email: u.email, createdAt: new Date().toISOString() });
        } catch {}
      } else setFavorites([]);
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, 'users', cred.user.uid), { favorites: [], displayName: name, email, createdAt: new Date().toISOString() });
    toast.success('Account created! Please check your email to verify.');
    return cred.user;
  };

  const resendVerification = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Check your inbox.');
    }
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      toast('Please verify your email to continue.', { icon: '📧', duration: 5000 });
    } else {
      toast.success(`Welcome back, ${cred.user.displayName || 'User'}!`);
    }
    return cred.user;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (!snap.exists()) await setDoc(doc(db, 'users', cred.user.uid), { favorites: [], displayName: cred.user.displayName, email: cred.user.email, createdAt: new Date().toISOString() });
    toast.success(`Welcome, ${cred.user.displayName}!`);
    return cred.user;
  };

  const logout = async () => { await signOut(auth); toast.success('Signed out'); };

  const toggleFavorite = async (item) => {
    if (!user) { toast.error('Sign in to save favorites'); return; }
    const ref = doc(db, 'users', user.uid);
    const exists = favorites.some(f => f.id === item.id && f.type === item.type);
    try {
      if (exists) {
        const toRemove = favorites.find(f => f.id === item.id && f.type === item.type);
        await updateDoc(ref, { favorites: arrayRemove(toRemove) });
        setFavorites(prev => prev.filter(f => !(f.id === item.id && f.type === item.type)));
        toast.success('Removed from watchlist');
      } else {
        const fav = { id: item.id, type: item.type, title: item.title, poster: item.poster, rating: item.rating };
        await updateDoc(ref, { favorites: arrayUnion(fav) });
        setFavorites(prev => [...prev, fav]);
        toast.success('Added to watchlist');
      }
    } catch { toast.error('Failed to update watchlist'); }
  };

  const isFavorite = (id, type) => favorites.some(f => f.id === id && f.type === type);

  return (
    <AuthContext.Provider value={{ user, loading, favorites, register, login, loginWithGoogle, logout, toggleFavorite, isFavorite, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
};
