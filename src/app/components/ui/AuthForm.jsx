"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LogIn, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "@/features/user/UserContext";
import { api } from "@/lib/apiClient";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false },
);

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function AuthForm({ isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const router = useRouter();
  const { setUser } = useUser();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("");
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleAuth = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setLoading(false);
      return;
    }

    try {
      if (!captchaToken) throw new Error("Please complete captcha");

      if (isLogin) {
        const data = await api.request("/api/auth", {
          method: "POST",
          body: { email, password, captchaToken, action: "login" },
        });
        if (!data.success) throw new Error(data.message || "Login failed");

        // The API route set the session as cookies.
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user || null);
        router.push("/arena");
      } else {
        const data = await api.request("/api/auth", {
          method: "POST",
          body: { email, password, captchaToken, action: "signup", name },
        });
        if (!data.success) throw new Error(data.message || "Signup failed");
        toast.success(data.message || "Account created! Please sign in.");
        router.push("/login");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) setError(error.message);
  };

  // Safe Turnstile sitekey fallback for testing/dev environments
  const turnstileSiteKey =
    (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY !== "Your Cloudfare Captcha Key")
      ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      : "1x00000000000000000000AA";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-udemy-surface dark:bg-udemy-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-udemy-dark-surface rounded-xl shadow-lg overflow-hidden border border-udemy-border dark:border-udemy-dark-border"
      >
        {/* Header */}
        <div className="bg-udemy-purple p-6 text-white">
          <div className="mb-4 text-white hover:text-white/80 hover:-translate-x-1 transition cursor-pointer">
            <Link href="/">
              ← Back To Home
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              {isLogin
                ? "Sign in to access Arena"
                : "Join us to get started"}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center p-6">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-udemy-border dark:border-udemy-dark-border bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text font-medium hover:bg-udemy-surface dark:hover:bg-udemy-dark-bg duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span className="mx-2">Continue with Google</span>
          </button>
        </div>

        <div className="relative flex items-center px-6">
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
          <span className="flex-shrink mx-4 text-udemy-muted dark:text-udemy-dark-muted">
            or
          </span>
          <div className="flex-grow border-t border-udemy-border dark:border-udemy-dark-border"></div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              id="error-message"
              role="alert"
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} noValidate className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 w-10 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  aria-label="Email address"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="password"
                aria-label="Password"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  aria-label="Full name"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Turnstile for both login and signup */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => setCaptchaToken(null)}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !captchaToken || (email && emailError)}
              className={`w-full flex items-center justify-center py-3 px-4 rounded text-white font-bold transition-all ${loading || !captchaToken || (email && emailError)
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={18} className="mr-2" /> Continue
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" /> Continue
                </>
              )}
            </button>
          </form>

          {/* Switch forms */}
          <div className="text-center text-sm text-udemy-muted dark:text-udemy-dark-muted">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-udemy-purple dark:text-udemy-purple-light hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>

          <div className="text-center text-xs text-udemy-muted dark:text-udemy-dark-muted mt-6">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-udemy-purple dark:text-udemy-purple-light hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
