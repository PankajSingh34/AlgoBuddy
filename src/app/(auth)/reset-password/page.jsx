"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestingReset, setRequestingReset] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message || "Unable to verify reset session.");
      }

      setHasSession(Boolean(session));
      setEmail(session?.user?.email || "");
      setLoading(false);
    };

    syncSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const callbackError = searchParams.get("error");
    if (callbackError === "auth_callback_failed") {
      setError("Your reset link is invalid or expired. Request a new one below.");
    }
  }, [searchParams]);

  const passwordMatches = newPassword && newPassword === confirmPassword;
  const passwordMeetsLength = newPassword.length >= 8;

  const requestResetLink = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setRequestingReset(true);

    try {
      const targetEmail = email.trim();
      if (!targetEmail) {
        throw new Error("Please enter the email address for your account.");
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=/reset-password`
          : "/auth/callback?next=/reset-password";

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        targetEmail,
        {
          redirectTo,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setMessage("Reset link sent. Check your email to continue.");
      toast.success("Reset link sent.");
    } catch (err) {
      setError(err?.message || "Unable to send reset link.");
    } finally {
      setRequestingReset(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!passwordMeetsLength) {
      setError("Use at least 8 characters for your new password.");
      return;
    }

    if (!passwordMatches) {
      setError("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut();
      toast.success("Password updated. Please sign in again.");
      router.push("/login?reset=success");
    } catch (err) {
      setError(err?.message || "Unable to update your password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-udemy-surface dark:bg-udemy-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-udemy-dark-surface rounded-xl shadow-lg overflow-hidden border border-udemy-border dark:border-udemy-dark-border"
      >
        <div className="bg-udemy-purple p-6 text-white">
          <div className="mb-4 text-white hover:text-white/80 hover:-translate-x-1 transition cursor-pointer">
            <Link href="/login" className="inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back To Sign In
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans">Reset Password</h1>
            <p className="text-purple-200 text-sm mt-1">
              {hasSession
                ? "Set a new password for your account"
                : "Request a reset link to continue"}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded flex items-start gap-3"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              role="status"
              className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-3 rounded flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-udemy-purple" />
            </div>
          ) : hasSession ? (
            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-udemy-text dark:text-udemy-dark-text mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                    placeholder="Enter a new password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-udemy-text dark:text-udemy-dark-text mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword || !passwordMeetsLength || !passwordMatches}
                className={`w-full flex items-center justify-center py-3 px-4 rounded text-white font-bold transition-all ${
                  updatingPassword || !passwordMeetsLength || !passwordMatches
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
                }`}
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={requestResetLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-udemy-text dark:text-udemy-dark-text mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestingReset}
                className="w-full flex items-center justify-center py-3 px-4 rounded text-white font-bold transition-all bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestingReset ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-udemy-muted dark:text-udemy-dark-muted">
            {hasSession
              ? "Use the form above after opening the reset email link."
              : "We’ll email you a secure link that brings you back here to set a new password."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
