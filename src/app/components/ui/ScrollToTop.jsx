"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  // ye variable track karta hai ki button dikhna chahiye ya nahi
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // jab bhi user scroll kare, ye function chalega
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);   // 300px se zyada scroll = button dikho
      } else {
        setIsVisible(false);  // wapas top pe = button chhupo
      }
    };

    // scroll event pe ye function attach karo
    window.addEventListener("scroll", handleScroll);

    // cleanup: jab component band ho toh event hatao
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // button click pe smoothly top pe jao
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // agar visible nahi hai toh kuch render mat karo
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        fixed bottom-6 right-6 z-50
        bg-purple-600 hover:bg-purple-700
        text-white
        w-12 h-12 rounded-full
        flex items-center justify-center
        shadow-lg
        transition-all duration-300
        cursor-pointer
      "
    >
      {/* Upar ka arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}