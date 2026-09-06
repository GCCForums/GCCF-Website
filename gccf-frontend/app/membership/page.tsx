"use client";

import { useState } from "react";
import { useCreateMembership } from "@/lib/hooks";
import { CreateMembershipDto } from "@/types/membership";
import {
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaComment,
  FaShieldAlt,
} from "react-icons/fa";

export default function MembershipPage() {
  const createMembership = useCreateMembership();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<CreateMembershipDto>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    occupation: "",
    organization: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMembership.mutateAsync(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit membership:", error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
        {/* Brand Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(61, 115, 189, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(61, 115, 189, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-[#3d73bd]/10 p-8 sm:p-12 max-w-lg text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center text-3xl mx-auto shadow-sm">
            <FaCheckCircle />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Submitted!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Thank you for your interest in becoming a member of GCCF. Your
              application has been submitted successfully and is now pending review
              by our administrative team.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed pt-1">
              Once approved, you will receive a welcome email and start receiving
              exclusive updates about upcoming workshops and forums.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#3d73bd] hover:to-[#5a8fd9] text-white font-semibold text-sm shadow-lg shadow-[#3d73bd]/25 hover:shadow-xl hover:shadow-[#3d73bd]/35 transition-all duration-200 cursor-pointer"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with GCCF Brand Colors & Grid */}
      <section className="relative pt-36 sm:pt-40 pb-20 px-6 text-center overflow-hidden">
        {/* Brand Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(61, 115, 189, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(61, 115, 189, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient Glows in GCCF Logo Colors */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#3d73bd]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-[#1d3c68]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Radial vignette fade for grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.7)_85%,#ffffff_100%)]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#1d3c68] bg-[#3d73bd]/10 border border-[#3d73bd]/25 shadow-xs">
            <span>Join the Movement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Become a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9]">
              Member
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join the GCCF global community and stay connected with our events, research, and cybersecurity initiatives.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto pb-28 px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-10 md:p-12 space-y-8">
          {/* Form Header */}
          <div className="text-center pb-6 border-b border-slate-100 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Membership Application
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Fill out the form below to apply for GCCF membership. Our team will review your application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaUser className="text-[#3d73bd]" /> First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaUser className="text-[#3d73bd]" /> Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaEnvelope className="text-[#3d73bd]" /> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaPhone className="text-[#3d73bd]" /> Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                <FaMapMarkerAlt className="text-[#3d73bd]" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaMapMarkerAlt className="text-[#3d73bd]" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaMapMarkerAlt className="text-[#3d73bd]" /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
            </div>

            {/* Occupation & Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaBriefcase className="text-[#3d73bd]" /> Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Security Analyst, Student"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaBuilding className="text-[#3d73bd]" /> Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company, University, or Institution"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                <FaComment className="text-[#3d73bd]" /> Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you would like to join GCCF..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
              />
            </div>

            {createMembership.isError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                Failed to submit application. Please check your details and try again.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMembership.isPending}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#3d73bd] hover:to-[#5a8fd9] text-white font-semibold text-base shadow-lg shadow-[#3d73bd]/25 hover:shadow-xl hover:shadow-[#3d73bd]/35 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMembership.isPending ? (
                <>
                  <FaSpinner className="animate-spin text-lg" /> Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
