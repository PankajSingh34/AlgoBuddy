"use client";
import { Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { useGlobalKeyboardShortcuts } from "@/app/hooks/useGlobalKeyboardShortcuts";
import GlobalShortcutsModal from "@/app/components/ui/GlobalShortcutsModal";

const Chatbot = lazy(() => import("@/app/components/ui/Chatbot"));
const CommandPalette = lazy(() =>
  import("@/app/components/CommandPalette").then((m) => ({ default: m.CommandPalette }))
);
const ProfileSetupModal = lazy(() => import("@/app/components/profile/ProfileSetupModal"));
const VoiceAgent = dynamic(() => import("@/app/components/VoiceAgent"), { ssr: false });

function LazyLoader({ children }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useGlobalKeyboardShortcuts();

  return (
    <>
      <Toaster position="top-right" />
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <LazyLoader><Chatbot /></LazyLoader>}
      {!isAuthPage && <LazyLoader><CommandPalette /></LazyLoader>}
      {!isAuthPage && <LazyLoader><ProfileSetupModal /></LazyLoader>}
      <VoiceAgent />
      <GlobalShortcutsModal />
    </>
  );
}
