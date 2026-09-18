"use client";

import React, { useEffect, useState } from "react";
import LogoLoader from "./LogoLoader";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Reveal content after brief initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    // Unmount from DOM after smooth fade-out transition
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={!loading}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white/95 backdrop-blur-xs transition-opacity duration-500 ease-out ${
        loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <LogoLoader size="lg" text="Global Cybersecurity Community Forums" />
    </div>
  );
}
