import Link from "next/link";
import Image from "next/image";
import {
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#3d73bd] text-white pt-16 pb-10 border-t border-blue-300/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/20">
          {/* Brand & Logo in White Rounded Rectangle */}
          <div className="md:col-span-6 space-y-4">
            <div className="inline-block p-3 sm:p-4 bg-white rounded-2xl shadow-xl border border-white/60">
              <Image
                src="/gccf logo.png"
                alt="Global Cybersecurity Community Forum"
                width={160}
                height={56}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Global Cybersecurity Community Forum
            </h3>
            <p className="text-sm text-blue-100/90 leading-relaxed max-w-md">
              Empowering cybersecurity professionals, researchers, and learners worldwide through
              community, collaboration, and continuous knowledge sharing.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 list-none m-0 p-0 text-sm text-blue-100">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200"
                >
                  News & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#3d73bd] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#3d73bd] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#3d73bd] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#3d73bd] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-blue-200/80">
          <p>
            &copy; {new Date().getFullYear()} Global Cybersecurity Community Forum. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
