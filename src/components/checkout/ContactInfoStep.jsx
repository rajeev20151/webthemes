import CountrySelect from "./CountrySelect";
import { SectionCard, FieldLabel, ErrorMsg, ErrorSummary } from "./ui";
import { inputCls, BTN_PRIMARY } from "./styles";
import { INFO_FIELDS } from "./fields";

/* ── STEP 1 · Contact Information ── */
export default function ContactInfoStep({ form, firstNameRef, lastNameRef, emailRef, countryRef }) {
  const { info, infoErr, touchedInfo, infoFields, changeInfo, blurInfo, submitInfo } = form;

  return (
    <SectionCard
      num="01"
      icon="bx-user"
      title="Contact Information"
      subtitle="We'll send your order details here"
    >
      <ErrorSummary
        errors={Object.fromEntries(
          INFO_FIELDS.filter((f) => touchedInfo[f.key]).map((f) => [f.key, infoErr[f.key]])
        )}
        fields={infoFields}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <input
            id="firstName"
            ref={firstNameRef}
            name="firstName"
            className={inputCls(touchedInfo.firstName && infoErr.firstName)}
            value={info.firstName}
            onChange={e => changeInfo("firstName", e.target.value)}
            onBlur={() => blurInfo("firstName")}
            autoComplete="given-name"
            placeholder="John"
            aria-invalid={!!(touchedInfo.firstName && infoErr.firstName)}
            aria-describedby={touchedInfo.firstName && infoErr.firstName ? "err-firstName" : undefined}
          />
          <ErrorMsg id="err-firstName" msg={touchedInfo.firstName ? infoErr.firstName : ""} />
        </div>
        <div>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <input
            id="lastName"
            ref={lastNameRef}
            name="lastName"
            className={inputCls(touchedInfo.lastName && infoErr.lastName)}
            value={info.lastName}
            onChange={e => changeInfo("lastName", e.target.value)}
            onBlur={() => blurInfo("lastName")}
            autoComplete="family-name"
            placeholder="Doe"
            aria-invalid={!!(touchedInfo.lastName && infoErr.lastName)}
            aria-describedby={touchedInfo.lastName && infoErr.lastName ? "err-lastName" : undefined}
          />
          <ErrorMsg id="err-lastName" msg={touchedInfo.lastName ? infoErr.lastName : ""} />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="email">Email Address</FieldLabel>
        <div className="relative">
          <i className="bx bx-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none"></i>
          <input
            id="email"
            ref={emailRef}
            name="email"
            className={`${inputCls(touchedInfo.email && infoErr.email)} pl-10`}
            type="email"
            value={info.email}
            onChange={e => changeInfo("email", e.target.value)}
            onBlur={() => blurInfo("email")}
            autoComplete="email"
            placeholder="john@example.com"
            aria-invalid={!!(touchedInfo.email && infoErr.email)}
            aria-describedby={touchedInfo.email && infoErr.email ? "err-email" : undefined}
          />
        </div>
        <ErrorMsg id="err-email" msg={touchedInfo.email ? infoErr.email : ""} />
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="country">Country</FieldLabel>
        <CountrySelect
          id="country"
          name="country"
          ref={countryRef}
          value={info.country}
          onChange={(v) => changeInfo("country", v)}
          onBlur={() => blurInfo("country")}
          invalid={touchedInfo.country && infoErr.country}
          describedBy={touchedInfo.country && infoErr.country ? "err-country" : undefined}
        />
        <ErrorMsg id="err-country" msg={touchedInfo.country ? infoErr.country : ""} />
      </div>

      <button onClick={submitInfo} className={`${BTN_PRIMARY} mt-6 w-full border-none`}>
        Continue to Payment <i className="bx bx-chevron-right text-base"></i>
      </button>
    </SectionCard>
  );
}
