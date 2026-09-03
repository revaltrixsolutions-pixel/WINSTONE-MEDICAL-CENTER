// src/components/layouts/HomepageFooter.tsx
import { MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import logo from "@/assets/logo.png";

function HomepageFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              {/* Rotating logo ring */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />

                {/* Rotating ring */}
                <div className="absolute inset-0 animate-[spin_7s_linear_infinite] rounded-full border-2 border-transparent border-t-blue-500 border-r-cyan-400" />

                {/* Second ring */}
                <div className="absolute inset-[4px] rounded-full border border-blue-300/60" />

                {/* Logo background */}
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-blue-100 sm:h-10 sm:w-10">
                  <img
                    src={logo}
                    alt="Winston Medical Centre"
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>
              </div>

              <span className="font-bold text-white">
                Winston Medical Centre
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Quality healthcare delivered with professionalism, compassion
              and respect.
            </p>

            {/* Location with real map pin */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Standard+Drive+Fedha+Gate+B+Kwandege+Road+Embakasi+Nairobi+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-400"
            >
              <MapPin size={16} className="text-blue-400" />
              <span>
                Standard Drive, Fedha Gate B, Kwandege Road, Embakasi, Nairobi
              </span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">Quick Links</h3>

            <div className="mt-4 space-y-3 text-sm">
              <a href="#home" className="block transition hover:text-white">
                Home
              </a>

              <a href="#about" className="block transition hover:text-white">
                About Us
              </a>

              <a
                href="#services"
                className="block transition hover:text-white"
              >
                Services
              </a>

              <a
                href="#doctors"
                className="block transition hover:text-white"
              >
                Doctors
              </a>

              <a
                href="#appointment"
                className="block transition hover:text-white"
              >
                Book Appointment
              </a>

              <a
                href="#contact"
                className="block transition hover:text-white"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">Contact Us</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a
                href="tel:+254708130100"
                className="block transition hover:text-white"
              >
                +254 708130100
              </a>

              <a
                href="mailto:info@winstonmedicalcentre.co.ke"
                className="block transition hover:text-white"
              >
                info@winstonmedicalcentre.co.ke
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Standard+Drive+Fedha+Gate+B+Kwandege+Road+Embakasi+Nairobi+Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-blue-400"
              >
                <MapPin size={15} className="text-blue-400" />
                <span>Embakasi, Nairobi, Kenya</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-white">Follow Us</h3>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Stay connected with Winston Medical Centre on social media.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-black hover:text-white"
              >
                <FaXTwitter size={17} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-blue-700 hover:text-white"
              >
                <FaLinkedinIn size={17} />
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-green-600 hover:text-white"
              >
                <FaWhatsapp size={19} />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-black hover:text-white"
              >
                <FaTiktok size={17} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-red-600 hover:text-white"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            Â© {new Date().getFullYear()} Winston Medical Centre. All rights
            reserved.
          </p>

          <div className="flex justify-center gap-5 sm:justify-end">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="transition hover:text-white">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomepageFooter;




