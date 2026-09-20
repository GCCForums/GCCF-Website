"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";
import { TeamMember } from "@/components/admin/types";

import PageHero from "@/components/public/PageHero";
import { FaShieldAlt } from "react-icons/fa";
import { teamApi } from "@/lib/api";

const isLegacyMockMember = (member: any): boolean => {
  if (!member) return true;
  const mockIds = ["1", "2", "3", "4", "5", "6"];
  const mockNames = [
    "sarah mitchell",
    "david chen",
    "maya patel",
    "james wilson",
    "aisha rahman",
    "michael torres",
  ];
  return (
    mockIds.includes(String(member.id)) ||
    mockNames.includes((member.name || "").toLowerCase().trim())
  );
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTeam() {
      try {
        const data = await teamApi.getAll(true);
        if (isMounted && Array.isArray(data)) {
          setTeamMembers(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Backend teamApi unavailable, falling back to storage", err);
      }

      // Fallback to localStorage only if backend is unavailable
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("gccf_team_members") : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && isMounted) {
            const realMembers = parsed.filter((m: TeamMember) => !isLegacyMockMember(m));
            setTeamMembers(realMembers);
          }
        }
      } catch (e) {
        console.error("Storage read error", e);
      }

      if (isMounted) setLoading(false);
    }

    loadTeam();

    const handleStorage = () => {
      loadTeam();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
    };
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-[#3d73bd] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <FaShieldAlt className="mx-auto text-4xl text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No Team Members Found</h3>
            <p className="text-sm text-slate-500">Team members added from the admin dashboard will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
            >
              {/* Photo Area */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <div className="flex items-center gap-1.5 p-1.5 px-3 rounded-xl bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9] text-white shadow-lg shadow-[#1d3c68]/30 border border-white/20 backdrop-blur-xs">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
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
                          className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
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
      )}
      </section>
    </div>
  );
}
