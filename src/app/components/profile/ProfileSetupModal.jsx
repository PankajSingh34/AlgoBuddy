"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/features/user/UserContext";
import { useProfileForm } from "@/app/hooks/useProfileForm";
import ProfileForm from "@/app/components/profile/ProfileForm";
import { isOnboardingStep1Valid, shouldShowProfileSetup } from "@/lib/profileUtils";

const TOTAL_STEPS = 2;

export default function ProfileSetupModal() {
  const { user, setUser, loading } = useUser();
  const [step, setStep] = useState(1);
  const blockSaveRef = useRef(false);
  const {
    formData,
    saving,
    savingAvatar,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    saveProfile,
  } = useProfileForm(user, setUser);

  const shouldShow = !loading && shouldShowProfileSetup(user);
  const canProceed = isOnboardingStep1Valid(formData);

  useEffect(() => {
    if (shouldShow) {
      setStep(1);
    }
  }, [shouldShow]);

  const handleOnboardingAvatarChange = useCallback(
    (event) => handleAvatarChange(event, { persistImmediately: false }),
    [handleAvatarChange],
  );

  const handleNext = () => {
    if (!canProceed) return;

    blockSaveRef.current = true;
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        blockSaveRef.current = false;
      }, 350);
    }, 0);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSave = async () => {
    if (blockSaveRef.current || saving) return;

    const result = await saveProfile({
      mode: "onboarding",
      markSetupSeen: true,
      onSuccess: () => toast.success("Profile saved! Welcome to AlgoBuddy."),
    });
    if (!result.ok) return;
  };

  const handleFormKeyDown = (event) => {
    if (event.key !== "Enter") return;

    const tag = event.target?.tagName?.toLowerCase();
    if (tag === "textarea") return;

    event.preventDefault();

    if (step === 1 && canProceed) {
      handleNext();
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleFormKeyDown}
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-neutral-800 dark:bg-neutral-900"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
          >
            <div className="border-b border-slate-100 px-6 py-5 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
                    Step {step} of {TOTAL_STEPS}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#111331] dark:text-white">Welcome to AlgoBuddy</h2>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-500 dark:text-neutral-400">
                    {step === 1
                      ? "Complete your profile to personalize your AlgoBuddy experience."
                      : "Add more details to make your profile stand out."}
                  </p>
                </div>
              </div>
            </div>

            <ProfileForm
              mode="onboarding"
              onboardingStep={step}
              formData={formData}
              onChange={handleChange}
              user={user}
              fileInputRef={fileInputRef}
              savingAvatar={savingAvatar}
              onAvatarChange={handleOnboardingAvatarChange}
            />

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/60">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 transition hover:bg-white disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <span aria-hidden="true" />
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60 dark:bg-violet-500 dark:shadow-none"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-60 dark:bg-violet-500 dark:shadow-none"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
