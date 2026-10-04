"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgColor =
    theme === "light"
      ? "bg-white border-amber-400/40"
      : "bg-neutral-900 border-amber-400/20";

  const textColor = theme === "light" ? "text-neutral-900" : "text-white";
  const hoverColor = "hover:text-amber-400";

  return (
    <motion.nav
      role="navigation"
      aria-label="Huvudmeny"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`
        sticky top-0 z-50
        backdrop-blur-md border-b 
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        transition-all duration-300
        ${bgColor}
      `}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-2 z-[9999] rounded bg-[#d4a017] px-3 py-1 text-black font-semibold"
      >
        Hoppa till innehåll
      </a>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d4a017]"
            aria-label="Gå till startsidan Eden Studio Barbershop"
          >
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-500 ${
                theme === "light" ? "bg-white" : "bg-neutral-800"
              }`}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={
                  theme === "light"
                    ? "/images/nav/EdenStudioLight.png"
                    : "/images/nav/EdenStudioDark.png"
                }
                alt="Eden Studio Barbershop logotyp"
                className={`h-12 w-12 rounded-full transition-transform duration-300 hover:scale-110`}
              />
            </div>

            <span className={`text-xl font-semibold ${textColor}`}>
              Eden Studio Barbershop
            </span>
          </Link>

          <div className="hidden md:block">
            <motion.div
              className="flex items-center gap-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
            >
              {[
                { to: "/", label: "Startsida" },
                { to: "/services", label: "Tjänster" },
                { to: "/kontakt", label: "Kontakt" },
                { to: "/om-oss", label: "Om Oss" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={
                    location.pathname === item.to ? "page" : undefined
                  }
                  className={`
                    relative font-semibold text-sm transition-colors
                    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                    after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 
                    after:transition-all after:duration-300 hover:after:w-full

                    ${textColor} ${hoverColor}
                    ${location.pathname === item.to ? "after:w-full" : ""}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`
    p-2 rounded-full transition
    ${
      theme === "light"
        ? "bg-white hover:bg-gray-100 text-neutral-700"
        : "bg-white hover:bg-neutral-800 text-amber-300"
    }
  `}
              aria-label={
                theme === "light"
                  ? "Aktivera mörkt tema"
                  : "Aktivera ljust tema"
              }
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6 drop-shadow-[0_0_4px_rgba(255,200,80,0.8)]" />
              )}
            </Button>

            <Link to="https://www.bokadirekt.se/places/eden-studio-barbershop-133611" target= "_blank">
              <Button
                className="
                  bg-amber-400 text-black rounded-lg px-5 py-2 
                  hover:bg-amber-500 transition shadow-md font-semibold
                "
              >
                BOKA TID
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor}`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          role="menu"
          aria-label="Mobil meny"
          className={`md:hidden border-t ${
            theme === "light" ? "bg-white" : "bg-neutral-900"
          }`}
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            <button
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Växla till mörkt tema"
                  : "Växla till ljust tema"
              }
              className={`
    flex w-full items-center gap-3 rounded-md px-3 py-2 text-base transition
    ${
      theme === "light"
        ? "bg-white text-neutral-700 hover:bg-gray-100"
        : "bg-neutral-800 text-amber-300 hover:bg-neutral-700"
    }
  `}
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6 drop-shadow-[0_0_4px_rgba(255,200,80,0.8)]" />
              )}
              <span className="font-semibold">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>

            {[
              { to: "/", label: "Startsida" },
              { to: "/services", label: "Tjänster" },
              { to: "/kontakt", label: "Kontakt" },
              { to: "/om-oss", label: "Om Oss" },
            ].map((i) => (
              <Link
                key={i.to}
                to={i.to}
                onClick={() => setIsOpen(false)}
                className={`
                  block rounded-md px-3 py-2 text-base transition
                  ${textColor} ${hoverColor}
                `}
              >
                {i.label}
              </Link>
            ))}

            <Link to="/kontakt" onClick={() => setIsOpen(false)}>
              <Button
                className="
                  w-full bg-amber-400 text-black rounded-lg px-5 py-2 mt-2
                  hover:bg-amber-500 transition
                "
              >
                Boka tid
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
