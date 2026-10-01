import {Link} from "react-router-dom";
import { useState } from "react";
import SEOHead from "../components/SEOHead";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { useCreateContactMutation } from "../store/apiSlice"; 

/* ── Icons ── */
const IconMail     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconSend     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconArrow    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconTwitter  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.988l4.26 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IconInsta    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;
const IconLinkedin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>;
const IconCheck    = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconValid    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconError    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;

const contactInfo = [
  { icon: <IconMail />, label: "Email Us", value: "hello@themewagen.com", sub: "Reply within 24 hours" },
];

const socials = [
  { icon: <IconTwitter />,  label: "Twitter" },
  { icon: <IconInsta />,    label: "Instagram" },
  { icon: <IconLinkedin />, label: "LinkedIn" },
];

const topics = ["General Inquiry", "Template Support", "License Question", "Refund Request", "Partnership", "Other"];

/* ── Validation rules ── */
const validators = {
  name: (v) => {
    if (!v.trim()) return "Name is required";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    if (v.trim().length > 50) return "Name must be under 50 characters";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(v.trim())) return "Please enter a valid email address";
    return "";
  },
  topic: (v) => {
    if (!v) return "Please select a topic";
    return "";
  },
  message: (v) => {
    if (!v.trim()) return "Message is required";
    if (v.trim().length < 10) return "Message must be at least 10 characters";
    if (v.trim().length > 1000) return "Message must be under 1000 characters";
    return "";
  },
};

/* ── Field border class based on validation state ── */
const fieldClass = (error, touched, value) => {
  const base = "px-4 py-3 rounded-xl outline-none fontStyle9 transition-all duration-200 w-full bg-[var(--color5)] text-[var(--color6)] border placeholder:text-[var(--color4)]";
  if (!touched) return `${base} border-[rgba(0,0,0,0.1)] focus:border-[var(--color3)]`;
  if (error)    return `${base} border-red-400 focus:border-red-400`;
  if (value)    return `${base} border-green-400 focus:border-green-400`;
  return `${base} border-[rgba(0,0,0,0.1)] focus:border-[var(--color3)]`;
};

export default function Contact() {
  const [form,    setForm]    = useState({ name: "", email: "", topic: "", message: "" });
  const [errors,  setErrors]  = useState({ name: "", email: "", topic: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, topic: false, message: false });
  const [sent,    setSent]    = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createContact, { isLoading: submitting }] = useCreateContactMutation();

  /* update field value + live-validate if already touched */
  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (touched[k]) {
      setErrors((p) => ({ ...p, [k]: validators[k](v) }));
    }
  };

  /* mark field touched + validate on blur */
  const handleBlur = (k) => {
    setTouched((p) => ({ ...p, [k]: true }));
    setErrors((p) => ({ ...p, [k]: validators[k](form[k]) }));
  };

  /* topic chip click — instantly validate */
  const setTopic = (t) => {
    setForm((p) => ({ ...p, topic: t }));
    setTouched((p) => ({ ...p, topic: true }));
    setErrors((p) => ({ ...p, topic: "" }));
  };

  /* submit — validate all fields, then call the API */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, topic: true, message: true };
    const allErrors  = {
      name:    validators.name(form.name),
      email:   validators.email(form.email),
      topic:   validators.topic(form.topic),
      message: validators.message(form.message),
    };
    setTouched(allTouched);
    setErrors(allErrors);
    const hasError = Object.values(allErrors).some(Boolean);
    if (hasError) return;

    setSubmitError("");
    try {
      const res = await createContact(form).unwrap();
      if (res.success) {
        setSent(true);
      } else {
        setSubmitError(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError("Could not send your message. Please check your connection and try again.");
    }
  };

  const reset = () => {
    setSent(false);
    setSubmitError("");
    setForm({ name: "", email: "", topic: "", message: "" });
    setErrors({ name: "", email: "", topic: "", message: "" });
    setTouched({ name: false, email: false, topic: false, message: false });
  };

  /* ── Field status icon ── */
  const FieldStatus = ({ fieldKey }) => {
    if (!touched[fieldKey]) return null;
    if (errors[fieldKey])
      return <span className="text-red-400"><IconError /></span>;
    if (form[fieldKey])
      return <span className="text-green-400"><IconValid /></span>;
    return null;
  };

  /* ── Error message ── */
  const ErrorMsg = ({ fieldKey }) =>
    touched[fieldKey] && errors[fieldKey] ? (
      <p className="fontStyle10 text-red-400 mt-1 m-0 flex items-center gap-1">
        <IconError /> {errors[fieldKey]}
      </p>
    ) : null;

  return (
    <section className="relative min-h-screen py-12 sm:py-14 md:py-20 overflow-hidden bg-[var(--color5)] text-[var(--color6)]">
      <SEOHead title="Contact Us" description="Get in touch with {site}. Have questions about our templates? We're here to help." />

      {/* ── Decorative blobs ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-[100px] [background:var(--color3)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[80px] [background:var(--color3)]" />

      <div className="w-width mx-auto">

        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Contact", path: "/contact" },
          ]}
        />

        {/* ── Page Heading ── */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full fontStyle10 font-bold tracking-widest uppercase mb-4 bg-[var(--color11)] text-[var(--color8)] border border-[var(--color11)]">
            Get In Touch
          </span>
          <h1 className="fontStyle3 font-bold m-0 mb-4 text-[var(--color6)] leading-[1.1]">
            We'd Love to <br className="hidden sm:block" />
            <span className="[background-image:var(--color3)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Hear From You
            </span>
          </h1>
          <p className="fontStyle8 max-w-xl mx-auto m-0 text-[var(--color8)]">
            Whether you have a question about templates, licensing, or just want to say hi —
            our team is ready to help you.
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">

          {/* ── Left Panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Contact info card */}
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--color11)] border border-[rgba(0,0,0,0.05)] transition-all duration-200">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center [background:var(--color3)] text-white fontStyle9">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="fontStyle10 font-bold uppercase tracking-widest m-0 mb-0.5 text-[var(--color8)]">{item.label}</p>
                  <p className="fontStyle8 font-semibold m-0 text-[var(--color6)] break-words">{item.value}</p>
                  <p className="fontStyle10 m-0 mt-0.5 text-[var(--color4)]">{item.sub}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color11)] border border-[rgba(0,0,0,0.05)]">
              <p className="fontStyle10 font-bold uppercase tracking-widest m-0 mb-3 text-[var(--color8)]">Follow Us</p>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((s) => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center [background:var(--color3)] text-white transition-all duration-200 hover:scale-110">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3 rounded-3xl p-5 sm:p-7 md:p-8 bg-[var(--color11)] border border-[rgba(0,0,0,0.06)]">

            {sent ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 [background:var(--color3)]">
                  <IconCheck />
                </div>
                <h2 className="fontStyle5 font-bold m-0 text-[var(--color6)]">Message Sent!</h2>
                <p className="fontStyle8 m-0 text-[var(--color8)]">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={reset}
                  className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity [background:var(--color3)]">
                  Send Another <IconArrow />
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div>
                  <h2 className="fontStyle6 font-bold m-0 mb-1 text-[var(--color6)]">Send a Message</h2>
                  <p className="fontStyle9 m-0 text-[var(--color8)]">All fields marked are required.</p>
                </div>

                {submitError && (
                  <div className="px-4 py-3 rounded-xl fontStyle9 bg-red-50 text-red-500 border border-red-200">
                    {submitError}
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color8)]">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <FieldStatus fieldKey="name" />
                    </div>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="John Doe"
                      className={fieldClass(errors.name, touched.name, form.name)}
                    />
                    <ErrorMsg fieldKey="name" />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color8)]">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <FieldStatus fieldKey="email" />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="john@email.com"
                      className={fieldClass(errors.email, touched.email, form.email)}
                    />
                    <ErrorMsg fieldKey="email" />
                  </div>
                </div>

                {/* Topic chips */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color8)]">
                      Topic <span className="text-red-400">*</span>
                    </label>
                    <FieldStatus fieldKey="topic" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {topics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`px-3.5 py-1.5 rounded-full fontStyle10 font-semibold cursor-pointer border transition-all duration-150 ${
                          form.topic === t
                            ? "[background:var(--color3)] text-white border-transparent"
                            : "bg-[var(--color5)] text-[var(--color8)] border-[rgba(0,0,0,0.1)] hover:border-[var(--color3)]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <ErrorMsg fieldKey="topic" />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color8)]">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`fontStyle10 ${form.message.length > 900 ? "text-red-400" : "text-[var(--color4)]"}`}>
                        {form.message.length}/1000
                      </span>
                      <FieldStatus fieldKey="message" />
                    </div>
                  </div>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    placeholder="Tell us how we can help you... (min. 10 characters)"
                    rows={5}
                    className={`${fieldClass(errors.message, touched.message, form.message)} resize-none`}
                  />
                  <ErrorMsg fieldKey="message" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl fontStyle8 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity [background:var(--color3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <IconSend /> {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom FAQ strip ── */}
        <div className="mt-10 sm:mt-12 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left bg-[var(--color11)] border border-[rgba(0,0,0,0.05)]">
          <div>
            <p className="fontStyle8 font-bold m-0 text-[var(--color6)]">Looking for quick answers?</p>
            <p className="fontStyle9 m-0 mt-0.5 text-[var(--color8)]">
              Check out our FAQ section — most common questions are already answered there.
            </p>
          </div>
          <Link to="/about"
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap [background:var(--color3)]">
            Visit FAQ <IconArrow />
          </Link>
        </div>

      </div>
    </section>
  );
}