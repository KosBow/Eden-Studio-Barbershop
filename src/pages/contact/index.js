"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const { theme } = useTheme();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendCopy, setSendCopy] = useState(false);

  const [status, setStatus] = useState(null);
  const [showPlane, setShowPlane] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name) newErrors.name = "Ange ditt namn.";
    else if (name.length < 2)
      newErrors.name = "Namnet måste ha minst 2 tecken.";

    if (!email) newErrors.email = "Ange din e-postadress.";
    else if (!emailRegex.test(email))
      newErrors.email = "Skriv en giltig e-postadress.";

    if (!subject) newErrors.subject = "Välj ett ämne.";

    if (!message) newErrors.message = "Skriv ett meddelande.";
    else if (message.length < 10)
      newErrors.message = "Meddelandet måste innehålla minst 10 tecken.";

    setErrors(newErrors);
    return Object.keys(newErrors).length ? newErrors : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setStatus({ type: "error", msg: "Korrigera fälten markerade i rött." });
      return;
    }

    if (!executeRecaptcha) {
      setStatus({
        type: "error",
        msg: "Recaptcha kunde inte laddas. Försök igen.",
      });
      return;
    }

    try {
      setSending(true);

      const token = await executeRecaptcha("kontakt_form");
      const cleanSubject = form.subject.trim();
      const sentTime = new Date().toLocaleString("sv-SE");

      const adminParams = {
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        reply_to: form.email.trim(),
        subject: cleanSubject,
        message: form.message.trim(),
        send_copy: sendCopy ? "Ja" : "Nej",
        sent_at: sentTime,
        "g-recaptcha-response": token,
      };

      await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ADMIN,
        adminParams,
        process.env.REACT_APP_PUBLIC_KEY
      );

      const customerParams = sendCopy
        ? {
            from_name: form.name.trim(),
            from_email: form.email.trim(),
            subject: cleanSubject,
            message: form.message.trim(),
            sent_at: sentTime,
          }
        : {
            from_name: form.name.trim(),
            from_email: form.email.trim(),
          };

      await emailjs.send(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_CUSTOMER,
        customerParams,
        process.env.REACT_APP_PUBLIC_KEY
      );

      setStatus({ type: "ok", msg: "Tack! Ditt meddelande har skickats." });
      setShowPlane(true);

      setForm({ name: "", email: "", subject: "", message: "" });
      setSendCopy(false);
      setTimeout(() => setShowPlane(false), 3000);
      setErrors({});
    } catch (err) {
      console.log(err);
      setStatus({
        type: "error",
        msg: "Något gick fel. Försök igen senare.",
      });
    } finally {
      setSending(false);
    }
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1.2, delay, ease: "easeOut" },
    viewport: { once: true },
  });

  const inputClass = (field) =>
    `w-full border outline-none rounded-lg p-3 transition-colors duration-300 ${
      errors[field]
        ? theme === "dark"
          ? "bg-neutral-900 border-red-500"
          : "bg-white border-red-500"
        : theme === "dark"
        ? "bg-neutral-950/70 border-neutral-800 focus:border-amber-400"
        : "bg-white border-gray-300 focus:border-amber-500"
    }`;

  return (
    <main
      className={`overflow-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <motion.section
        {...fadeUp(0)}
        className="relative container mx-auto max-w-6xl px-4 pt-16 pb-6 text-center"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        <h1 className="relative text-4xl font-bold">Kontakta Oss</h1>
        <p
          className={`mt-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Har du frågor eller vill boka tid? Hör av dig!
        </p>
        <div className="h-1 w-14 bg-amber-400 rounded-full mx-auto mt-4" />
      </motion.section>

      <section className="container mx-auto max-w-6xl px-4 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          {...fadeUp(0.15)}
          className={`relative rounded-xl p-8 border transition-colors duration-500 ${
            theme === "dark"
              ? "bg-neutral-900/60 border-amber-500/20 shadow-[0_0_20px_rgba(212,175,55,0.08)]"
              : "bg-gray-100 border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          }`}
        >
          <h2 className="text-xl font-semibold">Skicka ett meddelande</h2>
          <p
            className={`text-sm mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Fyll i formuläret så återkommer vi så snart som möjligt.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
            <div>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Namn"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="E-post"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass("subject")}
              >
                <option value="" disabled hidden>
                  Välj ett ämne…
                </option>

                <option disabled>────────── Bokningar ──────────</option>
                <option value="✂️ Bokning · Ny tid">✂️ Bokning · Ny tid</option>
                <option value="🔄 Ändring · Avbokning">
                  🔄 Ändring · Avbokning
                </option>

                <option disabled>────────── Frågor ──────────</option>
                <option value="💰 Pris · tjänster">💰 Pris · tjänster</option>
                <option value="🧔 Skägg · trimning">🧔 Skägg · trimning</option>

                <option disabled>────────── Övrigt ──────────</option>
                <option value="📝 Reklamation · feedback">
                  📝 Reklamation · feedback
                </option>
                <option value="❓ Annat">❓ Annat</option>
              </select>
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Meddelande"
                rows="5"
                className={inputClass("message")}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                id="sendCopy"
                type="checkbox"
                checked={sendCopy}
                onChange={(e) => setSendCopy(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
              <label
                htmlFor="sendCopy"
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } text-sm cursor-pointer`}
              >
                Skicka en kopia till min e-post
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
              disabled={sending}
              className={`${
                sending
                  ? "bg-amber-300 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-500"
              } text-black font-semibold px-5 py-3 rounded-lg flex items-center gap-2 justify-center transition shadow-md hover:shadow-amber-400/40 mb-3`}
            >
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send size={18} className="mt-[1px]" />
                  Skicka Meddelande
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-2 h-10 relative overflow-visible">
            {status && (
              <p
                aria-live="polite"
                className={`text-sm ${
                  status.type === "ok"
                    ? "text-amber-500"
                    : "text-red-500 font-medium"
                }`}
              >
                {status.msg}
              </p>
            )}

            <AnimatePresence>
              {showPlane && (
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 20, rotate: -30 }}
                  animate={{
                    opacity: 1,
                    x: 250,
                    y: -100,
                    rotate: 20,
                    scale: 1.2,
                    transition: { duration: 1.8, ease: "easeOut" },
                  }}
                  exit={{
                    opacity: 0,
                    x: 300,
                    y: -150,
                    rotate: 45,
                    transition: { duration: 0.5 },
                  }}
                  className="absolute left-0 bottom-0"
                >
                  <Send
                    size={32}
                    className={`${
                      theme === "dark"
                        ? "text-amber-400 drop-shadow-[0_0_8px_#fbbf24]"
                        : "text-amber-500 drop-shadow-[0_0_6px_#f59e0b]"
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div
          {...fadeUp(0.25)}
          className={`rounded-xl p-8 border transition-colors duration-500 ${
            theme === "dark"
              ? "bg-neutral-900/60 border-amber-500/20 shadow-[0_0_20px_rgba(212,175,55,0.08)]"
              : "bg-gray-100 border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.12)]"
          }`}
        >
          <h2 className="text-xl font-semibold">Kontaktinformation</h2>
          <div className="h-[2px] w-10 bg-amber-400 rounded-full mt-1" />

          <ul className="mt-5 space-y-4">
            {[
              {
                icon: <MapPin size={18} className="text-amber-400" />,
                title: "Adress",
                value: "Sturegatan 5, 582 21 Linköping",
              },
              {
                icon: <Phone size={18} className="text-amber-400" />,
                title: "Telefon",
                value: "072-201 01 95",
              },
              {
                icon: <Mail size={18} className="text-amber-400" />,
                title: "E-post",
                value: "Eden.studio1@hotmail.com",
              },
              {
                icon: <Clock size={18} className="text-amber-400" />,
                title: "Öppettider",
                value: (
                  <>
                    <p>Mån - Fre: 11 - 19</p>
                    <p>Lör: 11 - 15</p>
                    <p>Sönd: stängt!</p>
                    <p
                      className={`mt-3 text-sm italic ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Avbokning sker endast via telefon eller genom din
                      online-bokning.
                    </p>
                  </>
                ),
              },
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div
                  className={`rounded-lg p-2 border ${
                    theme === "dark"
                      ? "bg-neutral-950/70 border-neutral-800"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {item.icon}
                </div>
                <div>
                  <strong className="block">{item.title}</strong>
                  <span>{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <motion.section
        {...fadeUp(0.35)}
        className="container mx-auto max-w-6xl px-4 pb-28"
      >
        <h3 className="text-lg font-semibold mb-3">Hitta hit</h3>

        <div className="h-1 w-16 bg-amber-400 rounded-full mb-6"></div>

<div
  className={`h-[380px] rounded-xl overflow-hidden border-2 transition-colors duration-500
    ${
      theme === "dark"
        ? "border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        : "border-amber-400/50 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
    }`}
>

          <iframe
            title="Eden Studio Barbershop - Karta"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Sturegatan%205,%20Link%C3%B6ping&output=embed"
            className="w-full h-full"
          />
        </div>
      </motion.section>
    </main>
  );
}
