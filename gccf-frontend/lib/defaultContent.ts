import { HomepageContent } from "./api";

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  id: 1,
  hero: {
    badge: "GLOBAL CYBERSECURITY COMMUNITY FORUM",
    title: "Protecting the Digital World",
    subtitle:
      "Join thousands of cybersecurity practitioners, researchers, and enterprise defenders. Share threat intelligence, collaborate on live defense, and elevate the security posture of global systems.",
    titleHighlight: "Together",
    primaryButtonUrl: "/membership",
    primaryButtonText: "Join Our Community",
    secondaryButtonUrl: "/events",
    secondaryButtonText: "Explore Events",
  },
  metrics: {
    items: [
      {
        label: "Years of Impact",
        number: "15+",
      },
      {
        label: "Lives Touched",
        number: "50K+",
      },
      {
        label: "Active Projects",
        number: "120+",
      },
      {
        label: "Countries",
        number: "35+",
      },
    ],
    backgroundImage: "/statsbg2.png",
  },
  chairpersonMessage: {
    badge: "LEADERSHIP MESSAGE",
    image:
      "https://res.cloudinary.com/je6yfqp8/image/upload/v1789619994/gccf/homepage/gaehgmrhjrojmnnhyp3n.jpg",
    quote:
      "Cybersecurity is no longer just a technical defense; it is the cornerstone of societal trust, global resilience, and collective progress.",
    title: "Message from the CEO",
    message:
      "At GCCF, our conviction is that no individual, organization, or nation can face the rapidly mutating landscape of cyber threats in isolation. By cultivating a collaborative ecosystem of researchers, industry practitioners, and policymakers, we transform vulnerability into proactive collective defense. We welcome you to unite with our mission, share your expertise, and build an open, secure digital future for everyone.",
    isActive: true,
    signatureText: "",
    chairpersonName: "Samyog KC",
    chairpersonTitle: "CEO & Executive Director, GCCF",
  },
  about: {
    badge: "About GCCF",
    title: "Building a Safer Digital Future",
    paragraphs: [
      "The Global Cybersecurity Community Forum (GCCF) is a vibrant, international platform dedicated to fostering collaboration, knowledge sharing, and innovation in cybersecurity.",
      "Founded by industry leaders and passionate professionals, we bring together experts, learners, and organizations to address the ever-evolving challenges in digital security.",
      "Our mission is to create a trusted ecosystem where members can grow their skills, share insights, and contribute to a safer digital future.",
      "Through events, training programs, and collaborative initiatives, we're building the next generation of cybersecurity excellence.",
    ],
  },
  faq: {
    badge: "FAQ",
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
    title: "Frequently Asked Questions",
  },
  services: {
    badge: "What We Offer",
    items: [
      {
        icon: "FaShieldAlt",
        title: "Security Training",
        description:
          "Comprehensive training programs for individuals and organizations",
      },
      {
        icon: "FaUsers",
        title: "Community Events",
        description:
          "Regular meetups, workshops, and networking opportunities",
      },
      {
        icon: "FaBook",
        title: "Knowledge Sharing",
        description:
          "Access to resources, articles, and industry insights",
      },
      {
        icon: "FaBullseye",
        title: "Career Development",
        description: "Job opportunities and mentorship programs",
      },
      {
        icon: "FaMicroscope",
        title: "Research & Innovation",
        description:
          "Collaborative research projects and security innovations",
      },
      {
        icon: "FaGlobe",
        title: "Global Network",
        description:
          "Connect with cybersecurity professionals worldwide",
      },
    ],
    title: "Services & Activities",
  },
  extraSections: {},
};
