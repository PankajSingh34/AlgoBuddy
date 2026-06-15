"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user has valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        router.push("/auth/forgot-password");
      }
    };

    checkSession();
  }, [router]);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("Password updated successfully! You can now sign in.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      toast.error(err.message || "Failed to update password");
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
          <h1 className="text-2xl font-bold font-sans">Create New Password</h1>
          <p className="text-purple-200 text-sm mt-1">
            Enter your new password below
          </p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="New password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-udemy-border dark:border-udemy-dark-border focus:outline-none focus:ring-2 focus:ring-udemy-purple bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text"
                placeholder="Confirm new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className={`w-full py-3 px-4 rounded text-white font-bold transition-all flex items-center justify-center ${
                loading || !password || !confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-udemy-purple hover:bg-udemy-purple-dark shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
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
