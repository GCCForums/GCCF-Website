"use client";

import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaInfoCircle,
  FaLayerGroup,
  FaChartBar,
  FaQuestionCircle,
  FaSlidersH,
  FaUserTie,
  FaToggleOn,
  FaToggleOff,
  FaThList,
} from "react-icons/fa";
import {
  homepageApi,
  HomepageContent,
  HeroSectionContent,
  MetricsSectionContent,
  ChairpersonMessageContent,
  AboutSectionContent,
  FaqSectionContent,
  ServicesSectionContent,
  ServiceItem,
  MetricItem,
  FaqItem,
} from "@/lib/api";
import { ImageUploadInput } from "./ImageUploadInput";

export default function HomepageContentManager() {
  const [activeSection, setActiveSection] = useState<
    "hero" | "metrics" | "chairperson" | "about" | "services" | "faq"
  >("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Section States
  const [hero, setHero] = useState<HeroSectionContent>({
    badge: "GLOBAL CYBERSECURITY FORUM",
    title: "Protecting the Digital World",
    titleHighlight: "Together",
    subtitle:
      "Join thousands of cybersecurity practitioners, researchers, and enterprise defenders. Share threat intelligence, collaborate on live defense, and elevate the security posture of global systems.",
    primaryButtonText: "Join Our Community",
    primaryButtonUrl: "/membership",
    secondaryButtonText: "Explore Events",
    secondaryButtonUrl: "/events",
  });

  const [metrics, setMetrics] = useState<MetricsSectionContent>({
    backgroundImage: "/statsbg2.png",
    items: [
      { number: "15+", label: "Years of Impact" },
      { number: "50K+", label: "Lives Touched" },
      { number: "120+", label: "Active Projects" },
      { number: "35+", label: "Countries" },
    ],
  });

  const [chairpersonMessage, setChairpersonMessage] =
    useState<ChairpersonMessageContent>({
      badge: "LEADERSHIP MESSAGE",
      title: "Message from the Chairperson",
      chairpersonName: "Dr. Sarah Mitchell",
      chairpersonTitle: "Chairperson & Executive Director, GCCF",
      quote:
        "Cybersecurity is no longer just a technical defense; it is the cornerstone of societal trust, global resilience, and collective progress.",
      message:
        "At GCCF, our conviction is that no individual, organization, or nation can face the rapidly mutating landscape of cyber threats in isolation. By cultivating a collaborative ecosystem of researchers, industry practitioners, and policymakers, we transform vulnerability into proactive collective defense. We welcome you to unite with our mission, share your expertise, and build an open, secure digital future for everyone.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      signatureText: "Dr. Sarah Mitchell, Chairperson",
      isActive: true,
    });

  const [about, setAbout] = useState<AboutSectionContent>({
    badge: "About GCCF",
    title: "Building a Safer Digital Future",
    paragraphs: [
      "The Global Cybersecurity Community Forum (GCCF) is a vibrant, international platform dedicated to fostering collaboration, knowledge sharing, and innovation in cybersecurity.",
      "Founded by industry leaders and passionate professionals, we bring together experts, learners, and organizations to address the ever-evolving challenges in digital security.",
      "Our mission is to create a trusted ecosystem where members can grow their skills, share insights, and contribute to a safer digital future.",
      "Through events, training programs, and collaborative initiatives, we're building the next generation of cybersecurity excellence.",
    ],
  });

  const [services, setServices] = useState<ServicesSectionContent>({
    badge: "What We Offer",
    title: "Services & Activities",
    items: [
      {
        icon: "FaShieldAlt",
        title: "Security Training",
        description:
          "Comprehensive workshops and training sessions on modern cybersecurity practices.",
      },
      {
        icon: "FaUsers",
        title: "Community Events",
        description:
          "Networking meetups, conferences, and collaborative security events.",
      },
      {
        icon: "FaBook",
        title: "Resource Hub",
        description:
          "Curated guides, tools, and threat intelligence reports for practitioners.",
      },
      {
        icon: "FaBullseye",
        title: "Live Defense Labs",
        description:
          "Hands-on cyber ranges and capture-the-flag competitions to sharpen practical skills.",
      },
      {
        icon: "FaMicroscope",
        title: "Research & Analysis",
        description:
          "In-depth vulnerability studies, policy briefs, and threat landscape reports.",
      },
      {
        icon: "FaGlobe",
        title: "Global Network",
        description:
          "Connect with cybersecurity professionals and peer defenders across 35+ countries.",
      },
    ],
  });

  const [faq, setFaq] = useState<FaqSectionContent>({
    badge: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is GCCF?",
        answer:
          "GCCF (Global Cybersecurity Community Forum) is a worldwide community dedicated to bringing together cybersecurity professionals, enthusiasts, and learners to share knowledge, collaborate, and advance the field of cybersecurity.",
      },
      {
        question: "How can I join the community?",
        answer:
          "You can join by clicking the 'Join Our Community' button and filling out a simple registration form. Membership is open to anyone interested in cybersecurity, regardless of experience level.",
      },
      {
        question: "Are there membership fees?",
        answer:
          "Basic membership is completely free. We also offer premium memberships with additional benefits such as exclusive workshops, certification programs, and priority event access.",
      },
      {
        question: "What types of events do you organize?",
        answer:
          "We organize a variety of events including workshops, conferences, hackathons, webinars, and networking meetups. Events cover topics from ethical hacking to cloud security, threat intelligence, and more.",
      },
      {
        question: "Can beginners join GCCF?",
        answer:
          "Absolutely! We welcome members of all skill levels. We have dedicated programs and resources for beginners, including mentorship opportunities and foundational training sessions.",
      },
    ],
  });

  // Load content
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data: HomepageContent = await homepageApi.get();
        if (data) {
          if (data.hero) setHero(data.hero);
          if (data.metrics) setMetrics(data.metrics);
          if (data.chairpersonMessage) setChairpersonMessage(data.chairpersonMessage);
          if (data.about) setAbout(data.about);
          if (data.services) setServices(data.services);
          if (data.faq) setFaq(data.faq);
        }
      } catch (err: any) {
        console.error("Failed to fetch homepage content:", err);
        setErrorMessage("Failed to load homepage content from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await homepageApi.update({
        hero,
        metrics,
        chairpersonMessage,
        about,
        faq,
        services,
      });
      setSuccessMessage("Homepage content saved successfully! Public pages updated.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Failed to save homepage content:", err);
      setErrorMessage(err.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const resetData = await homepageApi.reset();
      if (resetData) {
        if (resetData.hero) setHero(resetData.hero);
        if (resetData.metrics) setMetrics(resetData.metrics);
        if (resetData.chairpersonMessage)
          setChairpersonMessage(resetData.chairpersonMessage);
        if (resetData.about) setAbout(resetData.about);
        if (resetData.services) setServices(resetData.services);
        if (resetData.faq) setFaq(resetData.faq);
      }
      setShowResetConfirm(false);
      setSuccessMessage("Homepage content reset to default GCCF template.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset content.");
    } finally {
      setResetting(false);
    }
  };

  const handleAddService = () => {
    setServices((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { icon: "FaShieldAlt", title: "New Service", description: "Service description..." },
      ],
    }));
  };

  const handleUpdateService = (
    index: number,
    field: keyof ServiceItem,
    value: string
  ) => {
    setServices((prev) => {
      const updated = [...(prev.items || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteService = (index: number) => {
    setServices((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  // Metric helpers
  const handleAddMetric = () => {
    setMetrics((prev) => ({
      ...prev,
      items: [...prev.items, { number: "100+", label: "New Metric" }],
    }));
  };

  const handleUpdateMetric = (
    index: number,
    field: "number" | "label",
    value: string
  ) => {
    setMetrics((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteMetric = (index: number) => {
    setMetrics((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // About paragraphs helpers
  const handleAddParagraph = () => {
    setAbout((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, "Enter new paragraph description here..."],
    }));
  };

  const handleUpdateParagraph = (index: number, text: string) => {
    setAbout((prev) => {
      const updated = [...prev.paragraphs];
      updated[index] = text;
      return { ...prev, paragraphs: updated };
    });
  };

  const handleDeleteParagraph = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  // FAQ helpers
  const handleAddFaq = () => {
    setFaq((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          question: "New Question Title?",
          answer: "Comprehensive answer explaining the policy or question details...",
        },
      ],
    }));
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaq((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleDeleteFaq = (index: number) => {
    setFaq((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#3d73bd] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Homepage Content Editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card with Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg">
              <FaSlidersH />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Homepage Content Editor
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dynamically configure the Hero Banner, Metrics Counters, About GCCF, and FAQ modules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FaUndo className="text-[11px] text-slate-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3d73bd] hover:bg-[#32609e] text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave className="text-xs" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <FaCheckCircle className="shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <FaInfoCircle className="shrink-0 text-red-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection("hero")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "hero"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaLayerGroup />
          <span>Hero Banner</span>
        </button>

        <button
          onClick={() => setActiveSection("metrics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "metrics"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaChartBar />
          <span>Metrics &amp; Stats</span>
        </button>

        <button
          onClick={() => setActiveSection("chairperson")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "chairperson"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaUserTie />
          <span>CEO Message</span>
        </button>

        <button
          onClick={() => setActiveSection("about")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "about"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaInfoCircle />
          <span>About GCCF</span>
        </button>

        <button
          onClick={() => setActiveSection("services")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "services"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaThList />
          <span>Services</span>
        </button>

        <button
          onClick={() => setActiveSection("faq")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === "faq"
              ? "bg-[#1d3c68] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <FaQuestionCircle />
          <span>FAQ Questions</span>
        </button>
      </div>

      {/* SECTION 1: HERO SECTION */}
      {activeSection === "hero" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 max-w-4xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Hero Section Content
            </h2>
            <p className="text-xs text-slate-500">
              Update the top badge, main headline, highlighted word, and subtitle of the homepage hero banner.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Top Badge Text
            </label>
            <input
              type="text"
              value={hero.badge || ""}
              onChange={(e) => setHero({ ...hero, badge: e.target.value })}
              placeholder="e.g. GLOBAL CYBERSECURITY FORUM"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={hero.title || ""}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="e.g. Protecting the Digital World"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gradient Highlight Word
              </label>
              <input
                type="text"
                value={hero.titleHighlight || ""}
                onChange={(e) =>
                  setHero({ ...hero, titleHighlight: e.target.value })
                }
                placeholder="e.g. Together"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={4}
              value={hero.subtitle || ""}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="Detailed hero description..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd] leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* SECTION 2: METRICS */}
      {activeSection === "metrics" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Metrics &amp; Key Stats Banner
              </h2>
              <p className="text-xs text-slate-500">
                Manage high-impact impact numbers displayed across the homepage stats ribbon.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddMetric}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#32609e] transition-colors cursor-pointer shrink-0"
            >
              <FaPlus className="text-[10px]" />
              <span>Add Stat Counter</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Banner Background Image URL
            </label>
            <input
              type="text"
              value={metrics.backgroundImage || ""}
              onChange={(e) =>
                setMetrics({ ...metrics, backgroundImage: e.target.value })
              }
              placeholder="e.g. /statsbg2.png or https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
            />
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {metrics.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 relative group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Counter #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMetric(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Delete Metric"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Stat Number / Value
                    </label>
                    <input
                      type="text"
                      value={item.number}
                      onChange={(e) =>
                        handleUpdateMetric(idx, "number", e.target.value)
                      }
                      placeholder="e.g. 50K+"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Label / Description
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        handleUpdateMetric(idx, "label", e.target.value)
                      }
                      placeholder="e.g. Lives Touched"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 text-center">
                  <span className="block text-2xl font-black text-[#1d3c68]">
                    {item.number || "0"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium truncate block">
                    {item.label || "Label"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ABOUT US */}
      {activeSection === "about" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              About GCCF Section Content
            </h2>
            <p className="text-xs text-slate-500">
              Configure the introductory narrative, mission, and background paragraphs on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={about.badge || ""}
                onChange={(e) => setAbout({ ...about, badge: e.target.value })}
                placeholder="e.g. About GCCF"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={about.title || ""}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                placeholder="e.g. Building a Safer Digital Future"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Narrative Paragraphs ({about.paragraphs.length})
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3d73bd] hover:underline cursor-pointer"
              >
                <FaPlus className="text-[10px]" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {about.paragraphs.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Paragraph #{idx + 1}</span>
                    {about.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteParagraph(idx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove paragraph"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SERVICES */}
      {activeSection === "services" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Services &amp; Activities
              </h2>
              <p className="text-xs text-slate-500">
                Manage the service offerings and community pillars displayed on the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#32609e] transition-colors cursor-pointer shrink-0"
            >
              <FaPlus className="text-[10px]" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={services.badge || ""}
                onChange={(e) => setServices({ ...services, badge: e.target.value })}
                placeholder="e.g. What We Offer"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={services.title || ""}
                onChange={(e) => setServices({ ...services, title: e.target.value })}
                placeholder="e.g. Services & Activities"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Service Items ({(services.items || []).length})
            </h3>

            {(services.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Service #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(idx)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Delete service"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Icon
                    </label>
                    <select
                      value={item.icon || "FaShieldAlt"}
                      onChange={(e) =>
                        handleUpdateService(idx, "icon", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                    >
                      <option value="FaShieldAlt">FaShieldAlt (Security)</option>
                      <option value="FaUsers">FaUsers (Community)</option>
                      <option value="FaBook">FaBook (Resources)</option>
                      <option value="FaBullseye">FaBullseye (Target/Labs)</option>
                      <option value="FaMicroscope">FaMicroscope (Research)</option>
                      <option value="FaGlobe">FaGlobe (Global)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleUpdateService(idx, "title", e.target.value)
                      }
                      placeholder="e.g. Security Training"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateService(idx, "description", e.target.value)
                    }
                    placeholder="Short description of this service..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FAQ */}
      {activeSection === "faq" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs text-slate-500">
                Provide answers to common community inquiries directly on the homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#32609e] transition-colors cursor-pointer shrink-0"
            >
              <FaPlus className="text-[10px]" />
              <span>Add FAQ Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={faq.badge || ""}
                onChange={(e) => setFaq({ ...faq, badge: e.target.value })}
                placeholder="e.g. FAQ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={faq.title || ""}
                onChange={(e) => setFaq({ ...faq, title: e.target.value })}
                placeholder="e.g. Frequently Asked Questions"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white"
              />
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4 pt-2">
            {faq.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1d3c68]">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Delete Question"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      handleUpdateFaq(idx, "question", e.target.value)
                    }
                    placeholder="Enter question title..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) =>
                      handleUpdateFaq(idx, "answer", e.target.value)
                    }
                    placeholder="Enter answer content..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2.5: CHAIRPERSON MESSAGE SECTION */}
      {activeSection === "chairperson" && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Message from the CEO / Chairperson
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the leadership statement, executive portrait, pull-quote, and bio displayed right after metrics.
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                Section Visible on Homepage
              </span>
              <button
                type="button"
                onClick={() =>
                  setChairpersonMessage((prev) => ({
                    ...prev,
                    isActive: prev.isActive !== false ? false : true,
                  }))
                }
                className={`text-2xl transition-colors cursor-pointer ${
                  chairpersonMessage.isActive !== false
                    ? "text-[#3d73bd]"
                    : "text-slate-300"
                }`}
                title="Toggle visibility"
              >
                {chairpersonMessage.isActive !== false ? (
                  <FaToggleOn />
                ) : (
                  <FaToggleOff />
                )}
              </button>
            </div>
          </div>

          {/* Section Badge & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section Badge Text
              </label>
              <input
                type="text"
                value={chairpersonMessage.badge || ""}
                onChange={(e) =>
                  setChairpersonMessage((prev) => ({
                    ...prev,
                    badge: e.target.value,
                  }))
                }
                placeholder="e.g. LEADERSHIP MESSAGE"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section Main Title *
              </label>
              <input
                type="text"
                value={chairpersonMessage.title || ""}
                onChange={(e) =>
                  setChairpersonMessage((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g. Message from the CEO"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
              />
            </div>
          </div>

          {/* Chairperson Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Chairperson Full Name *
              </label>
              <input
                type="text"
                value={chairpersonMessage.chairpersonName || ""}
                onChange={(e) =>
                  setChairpersonMessage((prev) => ({
                    ...prev,
                    chairpersonName: e.target.value,
                  }))
                }
                placeholder="e.g. Dr. Sarah Mitchell"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Designation / Title *
              </label>
              <input
                type="text"
                value={chairpersonMessage.chairpersonTitle || ""}
                onChange={(e) =>
                  setChairpersonMessage((prev) => ({
                    ...prev,
                    chairpersonTitle: e.target.value,
                  }))
                }
                placeholder="e.g. Chairperson & Executive Director, GCCF"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
              />
            </div>
          </div>

          {/* Featured Pull Quote */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Key Featured Quote (Callout Box)
            </label>
            <textarea
              rows={3}
              value={chairpersonMessage.quote || ""}
              onChange={(e) =>
                setChairpersonMessage((prev) => ({
                  ...prev,
                  quote: e.target.value,
                }))
              }
              placeholder="Enter a powerful opening quote that summarizes the leadership message..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] resize-none"
            />
          </div>

          {/* Full Message Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Leadership Message Description *
            </label>
            <textarea
              rows={6}
              value={chairpersonMessage.message || ""}
              onChange={(e) =>
                setChairpersonMessage((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              placeholder="Write the full message to members and global cybersecurity visitors (separate paragraphs with blank lines)..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tip: Separate paragraphs by leaving an empty line between them.
            </p>
          </div>

          {/* Image Upload Card */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <ImageUploadInput
              label="Chairperson Portrait Photo"
              value={chairpersonMessage.image || ""}
              onChange={(url) =>
                setChairpersonMessage((prev) => ({ ...prev, image: url }))
              }
              folder="homepage"
              placeholder="https://... or upload photo"
              required
              helperText="Upload a professional executive portrait (recommended aspect ratio: 4:5 or portrait 800x1000)"
            />
          </div>

          {/* Signature / Sign-off */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sign-off / Signature Text
            </label>
            <input
              type="text"
              value={chairpersonMessage.signatureText || ""}
              onChange={(e) =>
                setChairpersonMessage((prev) => ({
                  ...prev,
                  signatureText: e.target.value,
                }))
              }
              placeholder="e.g. Dr. Sarah Mitchell, Chairperson"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
            />
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaUndo />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Reset Homepage Content?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              This will restore all Hero, Metrics, About GCCF, and FAQ content to the standard default GCCF website copy.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                {resetting ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
