import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { SITE_NAME } from "../config/siteConfig";

const LAST_UPDATED = "October 12, 2026";
const CONTACT_EMAIL = "hello@themewagen.com";

const SECTIONS = [
  {
    id: "introduction",
    icon: "bx-info-circle",
    title: "Introduction",
    body: [
      `At ${SITE_NAME}, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.`,
      "By using our services, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    id: "information-we-collect",
    icon: "bx-data",
    title: "Information We Collect",
    body: [
      "We collect information that you provide directly to us, as well as information that is collected automatically when you use our services.",
    ],
    list: [
      "Personal details such as your name, email address, and password when you create an account.",
      "Payment and billing information when you purchase a premium template.",
      "Communications you send to us, such as support requests or contact form messages.",
      "Usage data including your IP address, browser type, device information, and pages visited.",
    ],
  },
  {
    id: "how-we-use",
    icon: "bx-cog",
    title: "How We Use Your Information",
    body: [
      "We use the information we collect to operate, maintain, and improve our services.",
    ],
    list: [
      "To create and manage your account and provide customer support.",
      "To process transactions and deliver the products you purchase.",
      "To send administrative messages, updates, and security alerts.",
      "To send marketing communications, where you have opted in.",
      "To monitor usage and detect, prevent, and address technical or security issues.",
    ],
  },
  {
    id: "cookies",
    icon: "bx-cookie",
    title: "Cookies & Tracking",
    body: [
      "We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and understand how our website is used.",
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the service may not function properly without cookies.",
    ],
  },
  {
    id: "sharing",
    icon: "bx-share-alt",
    title: "Sharing Your Information",
    body: [
      "We do not sell your personal information. We may share your information only in the following circumstances:",
    ],
    list: [
      "With service providers who perform services on our behalf, such as payment processing and analytics.",
      "To comply with legal obligations or respond to lawful requests from authorities.",
      "To protect the rights, property, or safety of our users or the public.",
      "In connection with a merger, acquisition, or sale of assets, in which case your information may be transferred.",
    ],
  },
  {
    id: "retention",
    icon: "bx-time-five",
    title: "Data Retention",
    body: [
      "We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.",
      "When your data is no longer needed, we will securely delete or anonymize it.",
    ],
  },
  {
    id: "security",
    icon: "bx-lock-alt",
    title: "Security",
    body: [
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
      "However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "your-rights",
    icon: "bx-user-voice",
    title: "Your Privacy Rights",
    body: [
      "Depending on your location, you may have certain rights regarding your personal information.",
    ],
    list: [
      "The right to access and receive a copy of the information we hold about you.",
      "The right to request correction of inaccurate or incomplete information.",
      "The right to request deletion of your personal information.",
      "The right to object to or restrict certain processing activities.",
      "The right to withdraw consent at any time where processing is based on consent.",
    ],
  },
  {
    id: "children",
    icon: "bx-child",
    title: "Children's Privacy",
    body: [
      "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from them.",
      "If we become aware that we have collected personal information from a child under 13, we will take steps to delete it promptly.",
    ],
  },
  {
    id: "third-party-links",
    icon: "bx-link-external",
    title: "Third-Party Links",
    body: [
      "Our website may contain links to third-party sites and services. We are not responsible for the privacy practices or content of those third parties.",
      "We encourage you to review the privacy policies of any third-party services you visit.",
    ],
  },
  {
    id: "changes",
    icon: "bx-refresh",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the \"Last updated\" date at the top of this page.",
      "Your continued use of the services after any changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    icon: "bx-envelope",
    title: "Contact Us",
    body: [
      `If you have any questions about this Privacy Policy, please contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="relative min-h-screen py-12 sm:py-14 md:py-20 overflow-hidden bg-[var(--color5)] text-[var(--color6)]">
      <SEOHead
        title="Privacy Policy"
        description="Read our privacy policy to understand how {site} collects, uses, and protects your personal information."
      />

      <div className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-[100px] [background:var(--color3)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[80px] [background:var(--color3)]" />

      <div className="w-width mx-auto">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Privacy Policy", path: "/privacy-policy" },
          ]}
        />

        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full fontStyle10 font-bold tracking-widest uppercase mb-4 bg-[var(--color11)] text-[var(--color8)] border border-[var(--color11)]">
            Legal
          </span>
          <h1 className="fontStyle3 font-bold m-0 mb-4 text-[var(--color6)] leading-[1.1]">
            Privacy{" "}
            <span className="[background-image:var(--color3)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Policy
            </span>
          </h1>
          <p className="fontStyle8 max-w-xl mx-auto m-0 text-[var(--color8)]">
            This policy explains what information {SITE_NAME} collects, how we use it, and the choices
            you have. Your trust matters to us.
          </p>
          <p className="fontStyle10 m-0 mt-4 text-[var(--color4)]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl p-5 bg-[var(--color11)] border border-[rgba(0,0,0,0.05)]">
              <p className="fontStyle10 font-bold uppercase tracking-widest m-0 mb-3 text-[var(--color8)]">
                On This Page
              </p>
              <ul className="space-y-2 list-none m-0 p-0">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="fontStyle10 text-[var(--color4)] hover:text-[var(--color6)] transition-colors duration-200"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3 flex flex-col gap-5">
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                className="scroll-mt-24 rounded-3xl p-5 sm:p-7 bg-[var(--color11)] border border-[rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center [background:var(--color3)] text-white">
                    <i className={`bx ${s.icon} text-xl`}></i>
                  </span>
                  <h2 className="fontStyle6 font-bold m-0 text-[var(--color6)]">{s.title}</h2>
                </div>

                {s.body.map((p, i) => (
                  <p key={i} className="fontStyle9 m-0 mb-3 text-[var(--color8)] leading-relaxed">
                    {p}
                  </p>
                ))}

                {s.list && (
                  <ul className="mt-1 mb-0 pl-0 list-none flex flex-col gap-2">
                    {s.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 fontStyle9 text-[var(--color8)] leading-relaxed">
                        <i className="bx bx-check-circle text-[var(--color3)] text-lg mt-0.5 flex-shrink-0"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <Link
              to="/terms"
              className="flex items-center justify-between gap-4 rounded-2xl p-5 sm:p-6 bg-[var(--color11)] border border-[rgba(0,0,0,0.05)] transition-all duration-200 hover:translate-x-1"
            >
              <span>
                <span className="block fontStyle8 font-bold text-[var(--color6)]">
                  Also read our Terms of Service
                </span>
                <span className="block fontStyle9 mt-0.5 text-[var(--color8)]">
                  The rules and conditions that apply to your use of our services.
                </span>
              </span>
              <i className="bx bx-right-arrow-alt text-2xl text-[var(--color6)]"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
