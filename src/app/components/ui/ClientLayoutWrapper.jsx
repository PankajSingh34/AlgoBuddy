"use client";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Chatbot from "@/app/components/ui/Chatbot";
import Navbar from "@/app/components/navbar";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <>
      <Toaster position="top-right" />
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Chatbot />}
    </>
  );
}
