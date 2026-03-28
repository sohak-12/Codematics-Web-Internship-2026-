"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log("Signup error details:", JSON.stringify(error));
      if (error.message.includes("already registered")) {
        throw new Error("This email is already registered. Try signing in.");
      }
      if (error.message.includes("not allowed") || error.message.includes("disabled")) {
        throw new Error("Email signup is currently disabled. Please use Google sign-in.");
      }
      throw error;
    }
    if (!data.user) throw new Error("Signup failed. Please try again.");
    return data;
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    if (error) throw error;
    if (!data.user) throw new Error("Verification failed. Please try again.");
    return data;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log("[Auth] Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("[Auth] Sign in error:", error.message, error.status, JSON.stringify(error));
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Email not confirmed. Please check your inbox or disable 'Confirm email' in Supabase Dashboard → Authentication → Providers → Email.");
      }
      if (error.message.includes("Invalid login")) {
        throw new Error("Invalid email or password. Try signing up first.");
      }
      throw error;
    }
    if (!data.user) throw new Error("Login failed. Please try again.");
    console.log("[Auth] Sign in success:", data.user.id);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, signUp, signIn, signInWithGoogle, signOut, verifyOtp };
}
