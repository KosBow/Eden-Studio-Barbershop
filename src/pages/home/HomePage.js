import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomePage() {
  const { theme } = useTheme();

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", setVH);
    };
  }, []);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 300], [0, 80]);

  const bgImage = "/images/nav/background.jpg";
  const logo = "/images/EdenStudioBarbershopremovebg.png";

  return (
    <main
      id="main-content"
      role="main"
      lang="sv"
      aria-label="Startsida för Eden Studio Barbershop"
      className={`relative min-h-[calc(var(--vh,1vh)*100-1.5rem)] flex flex-col justify-center items-center overflow-auto md:overflow-hidden transition-colors duration-700 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${bgImage}')`, y: yParallax }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.85)_80%)]"
              : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.6)_90%)]"
          }`}
        />
      </motion.div>

      <section
        aria-labelledby="hero-title"
        className="relative z-10 flex flex-col items-center text-center px-6 pb-40 sm:pb-20"
      >
        <motion.img
          src={logo}
          alt="Eden Studio Barbershop logotyp"
          className="max-w-[min(90%,450px)] h-auto mb-10 object-contain select-none drop-shadow-[0_0_25px_rgba(255,191,0,0.25)]"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        <motion.h1
          id="hero-title"
          className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5 tracking-tight"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          viewport={{ once: true }}
        >
          <span
            className={`${
              theme === "dark" ? "text-amber-400" : "text-[#d4a017]"
            } drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]`}
          >
            Eden Studio
          </span>{" "}
          <span
            className={`relative inline-block bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-[0_2px_6px_rgba(255,200,50,0.4)]"
                : "bg-gradient-to-r from-[#cfd2d6] via-[#f0f0f0] to-[#b5b7ba] drop-shadow-[0_4px_10px_rgba(160,160,160,0.8)]"
            } animate-textshine`}
          >
            Barbershop
          </span>
        </motion.h1>

        <motion.p
          className={`text-lg sm:text-xl max-w-2xl leading-relaxed px-6 py-3 rounded-lg font-medium ${
            theme === "dark"
              ? "text-gray-200 bg-black/30"
              : "text-gray-50 bg-black/45"
          } drop-shadow-[0_4px_10px_rgba(0,0,0,1)]`}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          viewport={{ once: true }}
        >
          En modern salong för stil, skägg och självförtroende. Vi erbjuder
          premium klippningar, skäggtrimningar och stylingtjänster för den
          moderna gentlemannen.
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 40px rgba(230,230,230,0.6), 0 0 80px rgba(255,215,0,0.85)",
                "0 0 60px rgba(255,255,255,0.85), 0 0 120px rgba(255,223,80,1)",
                "0 0 40px rgba(230,230,230,0.6), 0 0 80px rgba(255,215,0,0.85)",
              ],
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="relative rounded-md"
          >
            <motion.span
              className="absolute inset-0 rounded-md bg-gradient-to-r from-white/30 via-yellow-100/20 to-amber-200/10 opacity-0 group-hover:opacity-70 blur-2xl transition-all duration-700"
              animate={{
                opacity: [0.25, 0.7, 0.25],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
            <Link
              // to="/kontakt"
              to="https://www.bokadirekt.se/places/eden-studio-barbershop-133611"
              target="_blank"
              aria-label="Öppna kontaktsektionen och boka tid hos Eden Studio Barbershop"
              className={`relative px-12 py-4 text-lg font-semibold rounded-md overflow-hidden group transition-all duration-300 focus:outline-none focus:ring-4 ${
                theme === "dark"
                  ? "bg-amber-400 text-black hover:bg-amber-300 focus:ring-white/70 shadow-lg hover:shadow-amber-400/40"
                  : "bg-gradient-to-r from-[#d4a017] via-[#c89600] to-[#b58900] text-black hover:brightness-110 focus:ring-[#d4a017] shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
              }`}
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700" />
              <span className="relative z-10">Boka tid</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
