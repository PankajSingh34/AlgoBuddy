"use client";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Chatbot from "@/app/components/ui/Chatbot";
import Navbar from "@/app/components/navbar";
import { CommandPalette } from "@/app/components/CommandPalette";
import { useGlobalKeyboardShortcuts } from "@/app/hooks/useGlobalKeyboardShortcuts";
import GlobalShortcutsModal from "@/app/components/ui/GlobalShortcutsModal";
import ProfileSetupModal from "@/app/components/profile/ProfileSetupModal";
import ErrorBoundary from "@/app/components/ErrorBoundary";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useGlobalKeyboardShortcuts();

  return (
    <>
      <Toaster position="top-right" />
      {!isAuthPage && <Navbar />}
      <ErrorBoundary>{children}</ErrorBoundary>
      {!isAuthPage && <Chatbot />}
      {!isAuthPage && <CommandPalette />}
      {!isAuthPage && <ProfileSetupModal />}
      <GlobalShortcutsModal />
    </>
  );
}
