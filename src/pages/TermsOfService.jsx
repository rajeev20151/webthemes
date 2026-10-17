import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { SITE_NAME } from "../config/siteConfig";

const LAST_UPDATED = "October 12, 2026";
const CONTACT_EMAIL = "hello@themewagen.com";

const SECTIONS = [
  {
    id: "acceptance",
    icon: "bx-check-shield",
    title: "Acceptance of Terms",
    body: [
      `Welcome to ${SITE_NAME}. By accessing or using our website, products, and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.`,
      "If you do not agree with any part of these terms, you must not use our website or services.",
    ],
  },
  {
    id: "eligibility",
    icon: "bx-user-check",
    title: "Eligibility",
    body: [
      "You must be at least 13 years old to use our services. If you are under 18, you may use our services only with the involvement and consent of a parent or legal guardian.",
      "By using the services, you represent and warrant that you meet these requirements and that all information you provide is accurate.",
    ],
  },
  {
    id: "accounts",
    icon: "bx-lock-alt",
    title: "Accounts",
    body: [
      "To access certain features such as downloads, purchases, or your profile, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials.",
    ],
    list: [
      "You are responsible for all activity that occurs under your account.",
      "You must notify us immediately of any unauthorized use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    id: "licenses",
    icon: "bx-purchase-tag",
    title: "Templates & Licenses",
    body: [
      `${SITE_NAME} offers both free and premium website templates. Your use of each template is governed by the license that accompanies it.`,
    ],
    list: [
      "You may use free and premium templates for personal and commercial projects.",
      "You may modify templates to suit your own project requirements.",
      "You may not resell, redistribute, sublicense, or share templates as standalone products.",
      "Attribution requirements, where applicable, must be honoured as stated in the license.",
    ],
  },
  {
    id: "payments",
    icon: "bx-credit-card",
    title: "Payments & Refunds",
    body: [
      "All prices are listed in US Dollars unless stated otherwise. Payments are processed securely through third-party payment providers.",
      "Refunds are available only for high-price premium templates. All other purchases, including regular templates and plans, are final and non-refundable once the order is completed.",
      `To request a refund for an eligible premium template, review the template details and requirements carefully, then contact us at ${CONTACT_EMAIL}.`,
    ],
  },
  {
    id: "acceptable-use",
    icon: "bx-block",
    title: "Acceptable Use",
    body: [
      "You agree not to misuse our website or services. Prohibited activities include, but are not limited to:",
    ],
    list: [
      "Violating any applicable laws or regulations.",
      "Infringing the intellectual property or privacy rights of others.",
      "Uploading viruses, malware, or any harmful code.",
      "Attempting to gain unauthorized access to our systems or other users' accounts.",
      "Scraping, reselling, or redistributing our content without permission.",
    ],
  },
  {
    id: "intellectual-property",
    icon: "bx-copyright",
    title: "Intellectual Property",
    body: [
      `All content on ${SITE_NAME}, including text, graphics, logos, templates, and software, is the property of ${SITE_NAME} or its licensors and is protected by copyright and other intellectual property laws.`,
      "You may not copy, reproduce, distribute, or create derivative works from our content except as expressly permitted by these terms or the applicable license.",
    ],
  },
  {
    id: "third-party",
    icon: "bx-link-external",
    title: "Third-Party Content",
    body: [
      "Our website may contain links to third-party websites, services, or resources. We do not control and are not responsible for the content, policies, or practices of any third party.",
      "You access third-party services at your own risk and should review their terms and privacy policies.",
    ],
  },
  {
    id: "disclaimer",
    icon: "bx-error-circle",
    title: "Disclaimer of Warranties",
    body: [
      `Our website and services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.`,
      "We do not warrant that the services will be uninterrupted, error-free, or free of harmful components, or that any defects will be corrected.",
    ],
  },
  {
    id: "liability",
    icon: "bx-shield-quarter",
    title: "Limitation of Liability",
    body: [
      `To the maximum extent permitted by law, ${SITE_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the services.`,
      "Our total liability for any claim shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim.",
    ],
  },
  {
    id: "termination",
    icon: "bx-log-out-circle",
    title: "Termination",
    body: [
      "We may suspend or terminate your access to the services at any time, without notice, if we believe you have violated these terms or engaged in conduct harmful to us or other users.",
      "Upon termination, your right to use the services will immediately cease.",
    ],
  },
  {
    id: "changes",
    icon: "bx-refresh",
    title: "Changes to These Terms",
    body: [
      "We may update these Terms of Service from time to time. When we do, we will revise the \"Last updated\" date at the top of this page.",
      "Your continued use of the services after any changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    id: "governing-law",
    icon: "bx-certification",
    title: "Governing Law",
    body: [
      "These terms are governed by and construed in accordance with the laws applicable in the jurisdiction where we operate, without regard to its conflict of law provisions.",
    ],
  },
  {
    id: "contact",
    icon: "bx-envelope",
    title: "Contact Us",
    body: [
      `If you have any questions about these Terms of Service, please contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function TermsOfService() {
  return (
    <section className="relative min-h-screen py-12 sm:py-14 md:py-20 overflow-hidden bg-[var(--color5)] text-[var(--color6)]">
      <SEOHead
        title="Terms of Service"
        description="Read the {site} terms of service that govern your use of our website, templates, and services."
      />

      <div className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-[100px] [background:var(--color3)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[80px] [background:var(--color3)]" />

      <div className="w-width mx-auto">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Terms of Service", path: "/terms" },
          ]}
        />

        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full fontStyle10 font-bold tracking-widest uppercase mb-4 bg-[var(--color11)] text-[var(--color8)] border border-[var(--color11)]">
            Legal
          </span>
          <h1 className="fontStyle3 font-bold m-0 mb-4 text-[var(--color6)] leading-[1.1]">
            Terms of{" "}
            <span className="[background-image:var(--color3)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Service
            </span>
          </h1>
          <p className="fontStyle8 max-w-xl mx-auto m-0 text-[var(--color8)]">
            Please read these terms carefully before using {SITE_NAME}. They explain the rules and
            conditions that apply to your use of our website, templates, and services.
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
              to="/privacy-policy"
              className="flex items-center justify-between gap-4 rounded-2xl p-5 sm:p-6 bg-[var(--color11)] border border-[rgba(0,0,0,0.05)] transition-all duration-200 hover:translate-x-1"
            >
              <span>
                <span className="block fontStyle8 font-bold text-[var(--color6)]">
                  Also read our Privacy Policy
                </span>
                <span className="block fontStyle9 mt-0.5 text-[var(--color8)]">
                  Learn how we collect, use, and protect your personal information.
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
