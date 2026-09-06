"use client";

import React, { useState, useEffect } from "react";
import { Mail, Linkedin } from "lucide-react";
import { TeamMember } from "@/components/admin/types";

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Founder & CEO",
    affiliatedPart: "Executive Leadership / Global Chapter",
    image: "",
    email: "sarah@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "2",
    name: "David Chen",
    title: "Director of Operations",
    affiliatedPart: "Operations & Partnerships",
    image: "",
    email: "david@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "3",
    name: "Maya Patel",
    title: "Program Manager",
    affiliatedPart: "Community Initiatives & Standards",
    image: "",
    email: "maya@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "4",
    name: "James Wilson",
    title: "Communications Lead",
    affiliatedPart: "Global Outreach & Public Relations",
    image: "",
    email: "james@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "5",
    name: "Aisha Rahman",
    title: "Community Outreach",
    affiliatedPart: "Regional Chapters & Engagement",
    image: "",
    email: "aisha@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "6",
    name: "Michael Torres",
    title: "Finance Director",
    affiliatedPart: "Finance & Resource Governance",
    image: "",
    email: "michael@gccf.org",
    linkedin: "https://linkedin.com",
  },
];

import PageHero from "@/components/public/PageHero";
import { FaShieldAlt } from "react-icons/fa";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    if (typeof window === "undefined") return defaultTeamMembers;
    try {
      const stored = localStorage.getItem("gccf_team_members");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: Partial<TeamMember>) => ({
            id: m.id || String(Date.now()),
            name: m.name || "Member",
            title: m.title || "Team Leader",
            affiliatedPart: m.affiliatedPart || "GCCF Leadership",
            image: m.image || "",
            email: m.email || "",
            linkedin: m.linkedin || "",
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load team members from storage", err);
    }
    return defaultTeamMembers;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("gccf_team_members");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTeamMembers(
              parsed.map((m: Partial<TeamMember>) => ({
                id: m.id || String(Date.now()),
                name: m.name || "Member",
                title: m.title || "Team Leader",
                affiliatedPart: m.affiliatedPart || "GCCF Leadership",
                image: m.image || "",
                email: m.email || "",
                linkedin: m.linkedin || "",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to sync team members", err);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Brand Grid Hero Section */}
      <PageHero
        badge="Our Leadership & Community"
        titlePrefix="Meet the"
        titleHighlight="GCCF Team"
        subtitle="A global coalition of security researchers, community leaders, and technologists dedicated to advancing cyber resilience and ethical knowledge sharing."
      />

      {/* Team Grid */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
            >
              {/* Photo Area */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 text-[#3d73bd]">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-blue-100 flex items-center justify-center font-bold text-2xl mb-2">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="text-xs font-medium text-slate-400">GCCF Leadership</span>
                  </div>
                )}

                {/* Subtle bottom gradient shadow on hover */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Social Icons Overlay: Centered at the bottom of the image with blue gradient, visible only on hover */}
                {(member.email || member.linkedin) && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9] text-white shadow-lg shadow-[#1d3c68]/30 border border-white/20 backdrop-blur-xs">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                          title={member.email}
                        >
                          <Mail size={15} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#3d73bd] uppercase tracking-wider block mb-1">
                    {member.title || "Team Leader"}
                  </span>
                  {member.affiliatedPart && (
                    <p className="text-xs text-slate-500 font-medium">
                      {member.affiliatedPart}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
