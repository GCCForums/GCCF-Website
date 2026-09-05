"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { WebsitePopupConfig, initialPopupConfig } from "../admin/types";

export default function WebsitePopup() {
  const [config, setConfig] = useState<WebsitePopupConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndShowPopup = () => {
      try {
        const dismissed = sessionStorage.getItem("gccf_popup_dismissed");
        if (dismissed === "true") return;

        const stored = localStorage.getItem("gccf_website_popup_config");
        const parsed: WebsitePopupConfig = stored
          ? JSON.parse(stored)
          : initialPopupConfig;

        if (parsed && parsed.enabled && parsed.imageUrl) {
          setConfig(parsed);
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, (parsed.delaySeconds || 3) * 1000);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Popup check error", err);
      }
    };

    checkAndShowPopup();

    // Listen to localStorage changes across tabs/admin saves
    window.addEventListener("storage", checkAndShowPopup);
    return () => window.removeEventListener("storage", checkAndShowPopup);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gccf_popup_dismissed", "true");
    }
  };

  if (!isOpen || !config || !config.enabled || !config.imageUrl) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        zIndex: 99999,
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "560px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          animation: "scaleIn 0.25s ease-out",
          background: "#000000",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close pop-up"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            cursor: "pointer",
            zIndex: 20,
            transition: "all 0.15s ease",
          }}
        >
          <FaTimes style={{ fontSize: "0.9rem" }} />
        </button>

        {/* Just the Image */}
        <img
          src={config.imageUrl}
          alt={config.name || "Announcement"}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            display: "block",
            objectFit: "contain",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80";
          }}
        />
      </div>
    </div>
  );
}
export { WebsitePopup };
