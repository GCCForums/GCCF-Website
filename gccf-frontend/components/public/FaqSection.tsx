"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
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
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-300 bg-white shadow-xs"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:text-[#3d73bd] transition-colors cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <span
                    className={`ml-4 text-sm transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#3d73bd]" : "text-slate-400"
                    }`}
                  >
                    <FaChevronDown />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
