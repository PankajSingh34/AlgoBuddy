"use client";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/app/components/Chatbot/Chatbot";
import Navbar from "@/app/components/navbar";

export default function ClientLayoutWrapper({ children }) {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      {children}
      <Chatbot />
    </>
  );
}
