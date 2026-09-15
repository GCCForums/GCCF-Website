"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { WebsitePopupConfig, initialPopupConfig } from "../admin/types";
import { popupsApi } from "@/lib/api";

export default function WebsitePopup() {
  const [config, setConfig] = useState<WebsitePopupConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer: NodeJS.Timeout | null = null;

    const checkAndShowPopup = async () => {
      try {
        const dismissed = sessionStorage.getItem("gccf_popup_dismissed");
        if (dismissed === "true") return;

        let activeConfig: WebsitePopupConfig | null = null;
        try {
          const backendActive = await popupsApi.getActive();
          if (backendActive && backendActive.enabled && backendActive.imageUrl) {
            activeConfig = {
              name: backendActive.name,
              imageUrl: backendActive.imageUrl,
              delaySeconds: backendActive.delaySeconds || 3,
              enabled: true,
            };
          }
        } catch (e) {
          // Backend not reachable, fallback to localStorage
        }

        if (!activeConfig) {
          const stored = localStorage.getItem("gccf_website_popup_config");
          activeConfig = stored
            ? JSON.parse(stored)
            : initialPopupConfig;
        }

        if (activeConfig && activeConfig.enabled && activeConfig.imageUrl) {
          setConfig(activeConfig);
          timer = setTimeout(() => {
            setIsOpen(true);
          }, (activeConfig.delaySeconds || 3) * 1000);
        }
      } catch (err) {
        console.error("Popup check error", err);
      }
    };

    checkAndShowPopup();

    // Listen to localStorage changes across tabs/admin saves
    window.addEventListener("storage", checkAndShowPopup);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("storage", checkAndShowPopup);
    };
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
          maxWidth: "min(92vw, 850px)",
          maxHeight: "85vh",
          width: "fit-content",
          height: "fit-content",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)",
          animation: "scaleIn 0.25s ease-out",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close pop-up"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            cursor: "pointer",
            zIndex: 30,
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
          }}
        >
          <FaTimes style={{ fontSize: "0.9rem" }} />
        </button>

        {/* The Image - adapts dynamically to picture size */}
        <img
          src={config.imageUrl}
          alt={config.name || "Announcement"}
          style={{
            maxWidth: "min(92vw, 850px)",
            maxHeight: "85vh",
            width: "auto",
            height: "auto",
            display: "block",
            objectFit: "contain",
            borderRadius: "20px",
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
