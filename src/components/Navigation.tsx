"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Language } from "../contexts/LanguageContext";
import LanguageSwitch from "./LanguageSwitch";

interface NavigationProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Navigation({
  currentLang,
  onLanguageChange,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = {
    th: [
      { href: "/", label: "หน้าแรก" },
      { href: "/packages", label: "โปรแกรมทัวร์" },
      { href: "/gallery", label: "ภาพกิจกรรม" },
      { href: "/contact", label: "ติดต่อเรา" },
    ],
    en: [
      { href: "/", label: "Home" },
      { href: "/packages", label: "Tour Packages" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
    de: [
      { href: "/", label: "Startseite" },
      { href: "/packages", label: "Tourpakete" },
      { href: "/gallery", label: "Galerie" },
      { href: "/contact", label: "Kontakt" },
    ],
    cn: [
      { href: "/", label: "首页" },
      { href: "/packages", label: "旅游套餐" },
      { href: "/gallery", label: "图片集" },
      { href: "/contact", label: "联系我们" },
    ],
    fr: [
      { href: "/", label: "Accueil" },
      { href: "/packages", label: "Forfaits Circuit" },
      { href: "/gallery", label: "Galerie" },
      { href: "/contact", label: "Contact" },
    ],
  };

  const currentNavItems =
    navItems[currentLang as keyof typeof navItems] || navItems.en;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/elephants/logo/logo.jpg"
              alt="Jasmine Tour logo"
              width={58}
              height={58}
              className="h-16 w-16 rounded"
              priority
            />
            <span className="font-bold text-xl text-green-700">
              {currentLang === "th" ? "Jasmine Tour" : "Jasmine Tour"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <LanguageSwitch
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
            />

            <Link
              href="/booking"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {currentLang === "th" ? "จองทัวร์" : "Book Now"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {currentNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <LanguageSwitch
                  currentLang={currentLang}
                  onLanguageChange={onLanguageChange}
                />
              </div>
              <Link
                href="/booking"
                className="block mx-3 mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                onClick={() => setIsOpen(false)}
              >
                {currentLang === "th" ? "จองทัวร์" : "Book Now"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
