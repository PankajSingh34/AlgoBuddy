"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill email if coming from login page
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset link sent to your email!");
      // Optionally redirect to login after success
      // router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-udemy-surface dark:bg-udemy-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-udemy-dark-surface rounded-xl shadow-lg overflow-hidden border border-udemy-border dark:border-udemy-dark-border"
      >
        {/* Header */}
        <div className="bg-udemy-purple p-6 text-white">
          <div className="mb-4">
            <Link
              href="/login"
              className="text-white hover:text-white/80 hover:-translate-x-1 transition inline-flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
          <h1 className="text-2xl font-bold font-sans">Reset Password</h1>
          <p className="text-purple-200 text-sm mt-1">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 w-10 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                  placeholder="Enter your email address"
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || !!emailError}
              className={`w-full py-3 px-4 rounded text-white font-bold transition-all flex items-center justify-center ${
                loading || !email || !!emailError
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-udemy-muted dark:text-udemy-dark-muted">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-udemy-purple hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
