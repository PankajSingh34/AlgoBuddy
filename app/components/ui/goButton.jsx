"use client";
import React from "react";

const GoButton = ({ onGo, isAnimating }) => {
  return (
    <button
      type="submit"
      onClick={onGo}
      className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg disabled:opacity-50 transition-all duration-200 font-semibold"
      disabled={isAnimating}
    >
      Go
    </button>
  );
};

export default GoButton;
