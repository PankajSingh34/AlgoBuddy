"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import { TriangleAlert } from "lucide-react";

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function ModuleCard({ moduleId, description, initialDone }) {
  const { user } = useUser() || {};
  const [isDone, setIsDone] = useState(initialDone);
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;
      try {
        const data = await apiFetch(`/api/progress?moduleId=${encodeURIComponent(moduleId)}`);
        setIsDone(data?.is_done ?? false);
      } catch (e) {
        console.error("Error fetching user progress:", e);
      }
    };
    fetchUserProgress();
  }, [user, moduleId]);

  async function toggleCompletion() {
    if (!user) {
      toast.custom((t) => (
        <div className="max-w-sm w-full bg-neutral-100 dark:bg-zinc-800 border border-[#a435f0] rounded-lg shadow-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TriangleAlert size={50} className="dark:text-yellow-500 text-red-500" />
            <span className="text-sm text-gray-800 dark:text-gray-100">
              You are in guest mode. Login or signup to track your progress.
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                window.location.href = "/login";
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 rounded-full font-medium bg-gradient-to-r from-[#a435f0] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition duration-300 shadow-md flex items-center gap-2"
            >
              Login/Signup
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 rounded-full font-medium bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-900 dark:bg-neutral-800 border border-[#a435f0] dark:text-white text-black transition duration-300 shadow-lg flex items-center"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      ));
      return;
    }

  }}