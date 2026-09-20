"use client";

import { useState, useEffect, useRef } from "react";
import { useCreateMembership } from "@/lib/hooks";
import { CreateMembershipDto, MembershipSettings } from "@/types/membership";
import { membershipSettingsApi } from "@/lib/api";
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
  FaIdCard,
  FaReceipt,
  FaUpload,
  FaTimes,
  FaFilePdf,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

const MAX_PAY_SLIP_SIZE_BYTES = 500 * 1024; // 500KB

const INITIAL_FORM_DATA: CreateMembershipDto = {
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
  membershipType: "Individual Member",
  paymentAttachment: "",
};

export default function MembershipPage() {
  const createMembership = useCreateMembership();
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // Dynamic CMS Settings for Membership Page
  const [settings, setSettings] = useState<MembershipSettings>({
    badge: "Join the Movement",
    title: "Become a Member",
    subtitle:
      "Join the GCCF global community and stay connected with our events, research, and cybersecurity initiatives.",
    formTitle: "Membership Application",
    formDescription:
      "Fill out the form below to apply for GCCF membership. All fields and proof of payment are required.",
    membershipTypes: [
      "Individual Member",
      "Student Member",
      "Corporate Member",
      "Institutional Member",
      "Lifetime Member",
    ],
    paymentInstructions:
      "Please complete your membership payment and attach your payment receipt, slip, or screenshot below (max 500KB).",
  });

  const [formData, setFormData] = useState<CreateMembershipDto>(INITIAL_FORM_DATA);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    membershipSettingsApi
      .getSettings()
      .then((res) => {
        if (res) {
          setSettings((prev) => ({
            ...prev,
            ...res,
            membershipTypes:
              res.membershipTypes && res.membershipTypes.length > 0
                ? res.membershipTypes
                : prev.membershipTypes,
          }));
          if (res.membershipTypes && res.membershipTypes.length > 0) {
            setFormData((prev) => ({
              ...prev,
              membershipType: prev.membershipType || res.membershipTypes[0],
            }));
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic membership settings, using defaults", err);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");
    if (!file) return;

    // Strict Max 500KB limit
    if (file.size > MAX_PAY_SLIP_SIZE_BYTES) {
      setUploadError(
        `File size (${(file.size / 1024).toFixed(1)} KB) exceeds the 500KB limit. Please upload a receipt under 500KB.`,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    const isFilePdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    setIsPdf(isFilePdf);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, paymentAttachment: result }));
      if (!isFilePdf) {
        setFilePreview(result);
      } else {
        setFilePreview("");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setFormData((prev) => ({ ...prev, paymentAttachment: "" }));
    setFileName("");
    setFileSize("");
    setFilePreview("");
    setIsPdf(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      membershipType: settings.membershipTypes[0] || "Individual Member",
    });
    setFileName("");
    setFileSize("");
    setFilePreview("");
    setIsPdf(false);
    setUploadError("");
    setSubmitted(false);
    // Smooth scroll back to form top
    setTimeout(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");

    // Enforce compulsory pay slip upload
    if (!formData.paymentAttachment) {
      setUploadError(
        "Proof of payment (receipt / slip) is compulsory. Please attach your payment slip (max 500KB).",
      );
      const paymentSection = document.getElementById("payment-attachment-box");
      paymentSection?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      await createMembership.mutateAsync(formData);
      setSubmitted(true);
      // Smoothly scroll to the top of the form view to show confirmation without jarring page jumps
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    } catch (error) {
      console.error("Failed to submit membership:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with GCCF Brand Colors & Grid */}
      <section className="relative pt-36 sm:pt-40 pb-16 px-6 text-center overflow-hidden">
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
          {(settings.badge || "Join the Movement") && (
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#3d73bd] mb-3">
              {settings.badge || "Join the Movement"}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {settings.title || "Become a Member"}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {settings.subtitle ||
              "Join the GCCF global community and stay connected with our events, research, and cybersecurity initiatives."}
          </p>
        </div>
      </section>

      {/* Main Content Area: Form OR Success Confirmation (keeps page height stable to eliminate abrupt scroll jump) */}
      <section ref={formTopRef} className="max-w-3xl mx-auto pb-28 px-4 sm:px-6 relative z-10">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-[#3d73bd]/10 border border-slate-200/80 p-8 sm:p-14 text-center space-y-6 transition-all animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center text-4xl mx-auto shadow-sm">
              <FaCheckCircle />
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                <FaCheck className="text-xs" /> Submission Received
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Application Submitted!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Thank you for applying to join the Global Cybersecurity Community Forum (GCCF).
                Your membership application and verification slip have been submitted successfully
                and are currently pending review by our administration.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-left text-xs text-slate-700 space-y-1 mt-4">
                <p className="font-semibold text-[#1d3c68]">What happens next?</p>
                <p className="text-slate-600">
                  Our verification team will review your application details and payment slip.
                  Once approved, an official welcome confirmation will be sent to your email.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#3d73bd] hover:to-[#5a8fd9] text-white font-semibold text-sm shadow-lg shadow-[#3d73bd]/25 hover:shadow-xl hover:shadow-[#3d73bd]/35 transition-all duration-200 cursor-pointer"
              >
                <span>Submit Another Application</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-10 md:p-12 space-y-8">
            {/* Form Header */}
            <div className="text-center pb-6 border-b border-slate-100 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {settings.formTitle || "Membership Application"}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {settings.formDescription ||
                  "Fill out the form below to apply for GCCF membership. All fields marked with an asterisk are required."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Membership Tier / Type Selection */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
                    <FaIdCard className="text-[#3d73bd]" /> Membership Tier{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  {settings.pricingText && (
                    <span className="text-xs font-semibold text-[#1d3c68] bg-blue-50/90 px-3 py-1 rounded-lg border border-blue-100">
                      {settings.pricingText}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.membershipTypes.map((type) => {
                    const isSelected = formData.membershipType === type;
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, membershipType: type }))
                        }
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#3d73bd] bg-[#3d73bd]/5 text-[#1d3c68] ring-2 ring-[#3d73bd]/20 shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <FaCheck className="text-[#3d73bd] text-xs shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FaUser className="text-[#3d73bd]" /> First Name{" "}
                    <span className="text-rose-500">*</span>
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
                    <FaUser className="text-[#3d73bd]" /> Last Name{" "}
                    <span className="text-rose-500">*</span>
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
                    <FaEnvelope className="text-[#3d73bd]" /> Email Address{" "}
                    <span className="text-rose-500">*</span>
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
                    <FaPhone className="text-[#3d73bd]" /> Phone Number{" "}
                    <span className="text-rose-500">*</span>
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
                  <FaMapMarkerAlt className="text-[#3d73bd]" /> Street Address{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address / apartment / suite"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FaMapMarkerAlt className="text-[#3d73bd]" /> City{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FaMapMarkerAlt className="text-[#3d73bd]" /> Country{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                  />
                </div>
              </div>

              {/* Occupation & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FaBriefcase className="text-[#3d73bd]" /> Occupation / Profession{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g. Security Analyst, Student, Engineer"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    <FaBuilding className="text-[#3d73bd]" /> Organization / University{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company, University, or Institution"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                  />
                </div>
              </div>

              {/* Statement of Interest / Message */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  <FaComment className="text-[#3d73bd]" /> Statement of Interest / Message{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your background and why you would like to join GCCF..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-all"
                />
              </div>

              {/* Payment Proof / Receipt Attachment Box (Compulsory & Max 500KB) */}
              <div
                id="payment-attachment-box"
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
                      <FaReceipt className="text-[#3d73bd]" /> Proof of Payment (Receipt / Slip){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1">
                      {settings.paymentInstructions ||
                        "Attach your bank transfer slip, receipt, or transaction screenshot (JPG, PNG, WebP, or PDF, max 500KB)."}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#3d73bd] border border-blue-100 uppercase tracking-wider shrink-0">
                    Max 500KB
                  </span>
                </div>

                {/* Dynamic Payment Details & QR Code Card */}
                {settings.paymentInstructions && (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100/90 text-xs text-slate-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#1d3c68]">
                      <FaReceipt className="text-[#3d73bd]" />
                      <span>Official Payment Instructions & Bank Details</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
                      {settings.paymentInstructions}
                    </p>
                    {settings.qrCodeUrl && (
                      <div className="pt-2 border-t border-blue-200/60 flex items-center gap-3">
                        <img
                          src={settings.qrCodeUrl}
                          alt="Payment QR Code"
                          className="w-24 h-24 object-contain rounded-lg border border-slate-200 bg-white p-1 shadow-2xs shrink-0"
                        />
                        <span className="text-[11px] text-slate-500">
                          Scan QR code using mobile banking or digital wallet to complete membership payment.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {!formData.paymentAttachment ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-attachment-input"
                    />
                    <label
                      htmlFor="payment-attachment-input"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-[#3d73bd] bg-white rounded-xl cursor-pointer transition-all hover:bg-blue-50/20 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
                        <FaUpload />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        Click to upload payment receipt or slip
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        PNG, JPG, WebP, or PDF (Strictly max 500KB)
                      </span>
                    </label>
                    {uploadError && (
                      <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        {uploadError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Receipt Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0"
                        />
                      ) : isPdf ? (
                        <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center text-xl shrink-0">
                          <FaFilePdf />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#3d73bd] flex items-center justify-center text-xl shrink-0">
                          <FaReceipt />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {fileName || "Payment Receipt Attached"}
                        </p>
                        <p className="text-xs text-slate-400">{fileSize || "File ready for submission"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove attachment"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              {createMembership.isError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  Failed to submit application. Please check all fields and try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createMembership.isPending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#3d73bd] hover:to-[#5a8fd9] text-white font-semibold text-base shadow-lg shadow-[#3d73bd]/25 hover:shadow-xl hover:shadow-[#3d73bd]/35 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </section>
    </div>
  );
}
