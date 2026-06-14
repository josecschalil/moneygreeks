"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Responsive breakpoint hook
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Responsive breakpoint hook (Fixed for SSR Hydration)
// ---------------------------------------------------------------------------
const useWindowWidth = () => {
  // 1. Provide a static default value for both the server and the initial client render
  const [width, setWidth] = useState(1280);

  useEffect(() => {
    // 2. This code only runs on the client *after* hydration.
    // We update the state to the actual window size here.
    const handleResize = () => setWidth(window.innerWidth);

    // Call it immediately to adjust the layout right after mounting
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
// ---------------------------------------------------------------------------
// Design tokens — exact hex values from the original tailwind.config
// ---------------------------------------------------------------------------
const C = {
  primary: "#041627",
  onPrimary: "#ffffff",
  primaryFixed: "#d2e4fb",
  primaryFixedDim: "#b7c8de",
  primaryContainer: "#1a2b3c",
  onPrimaryContainer: "#8192a7",
  onPrimaryFixed: "#0b1d2d",
  onPrimaryFixedVariant: "#38485a",

  secondary: "#006c47",
  onSecondary: "#ffffff",
  secondaryFixed: "#8df7c1",
  secondaryFixedDim: "#71dba6",
  secondaryContainer: "#8af5be",
  onSecondaryContainer: "#00714b",

  tertiary: "#051629",
  tertiaryContainer: "#1b2b3f",
  onTertiaryContainer: "#8292aa",
  onTertiary: "#ffffff",
  tertiaryFixed: "#d3e4fe",
  tertiaryFixedDim: "#b7c8e1",
  onTertiaryFixed: "#0b1c30",
  onTertiaryFixedVariant: "#38485d",

  surface: "#f7f9fb",
  surfaceDim: "#d8dadc",
  surfaceBright: "#f7f9fb",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  surfaceVariant: "#e0e3e5",
  surfaceTint: "#4f6073",

  onSurface: "#191c1e",
  onSurfaceVariant: "#44474c",
  inverseSurface: "#2d3133",
  inverseOnSurface: "#eff1f3",

  background: "#f7f9fb",
  onBackground: "#191c1e",

  outline: "#74777d",
  outlineVariant: "#c4c6cd",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  inversePrimary: "#b7c8de",
};

// Typography scale (Slightly resized for a tighter, cleaner look)
const T = {
  displayLg: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "40px", // Reduced from 48px
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    fontWeight: 700,
  },
  displayLgMobile: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "28px", // Reduced from 32px
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
    fontWeight: 700,
  },
  headlineMd: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "28px", // Reduced from 32px
    lineHeight: "1.3",
    fontWeight: 600,
  },
  headlineSm: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "20px", // Reduced from 24px
    lineHeight: "1.4",
    fontWeight: 600,
  },
  bodyLg: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "16px", // Reduced from 18px
    lineHeight: "1.6",
    fontWeight: 400,
  },
  bodyMd: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "15px", // Reduced from 16px
    lineHeight: "1.6",
    fontWeight: 400,
  },
  labelMd: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "13px", // Reduced from 14px
    lineHeight: "1",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  caption: {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "12px",
    lineHeight: "1.4",
    fontWeight: 500,
  },
};

// Spacing (Adjusted margins for better fluid responsiveness)
const S = {
  marginMobile: "16px", // Tighter mobile margins
  marginTablet: "32px", // Added tablet margin
  marginDesktop: "48px", // Tighter desktop margins
  stackSm: "12px",
  stackMd: "24px",
  stackLg: "40px", // Reduced from 48px
  base: "8px",
  gutter: "24px",
  containerMax: "1100px", // Slightly narrower max-width to complement smaller fonts
};

const OFFICES = [
  {
    city: "New York (HQ)",
    address: "100 Wall Street, Suite 500",
    region: "New York, NY 10005",
    phone: "+1 (555) 123-4567",
  },
  {
    city: "London",
    address: "Level 39, One Canada Square",
    region: "Canary Wharf, London E14 5AB",
    phone: "+44 20 7946 0958",
  },
  {
    city: "Mumbai",
    address: "Bandra Kurla Complex (BKC)",
    region: "Mumbai, Maharashtra 400051",
    phone: "+91 22 6123 4567",
  },
];

const DIRECT_CONTACTS = [
  { label: "Institutional Support", email: "support@moneygreeks.com" },
  { label: "Media Inquiries", email: "press@moneygreeks.com" },
];

const FAQS = [
  {
    question: "How to access premium reports?",
    answer:
      "Premium reports are available to active subscribers. Navigate to the 'Reports' tab and ensure you are logged in to view restricted content.",
    cta: "Read Article",
    href: "#",
  },
  {
    question: "Can I export market data?",
    answer:
      "Yes, Institutional tier accounts can export raw market data sets in CSV or via our REST API. API documentation is available in the Intelligence Hub.",
    cta: "View API Docs",
    href: "#",
  },
];

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Technical Support",
  "Premium Subscription",
  "Data Access",
];

// ---------------------------------------------------------------------------
// Icon (Material Symbols Outlined)
// ---------------------------------------------------------------------------
const Icon = ({ name, fill = 0, style = {} }) => (
  <span
    className="material-symbols-outlined"
    style={{ fontVariationSettings: `'FILL' ${fill}`, ...style }}
    aria-hidden="true"
  >
    {name}
  </span>
);

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
const HeroSection = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const currentMargin = isMobile
    ? S.marginMobile
    : isTablet
      ? S.marginTablet
      : S.marginDesktop;

  return (
    <section
      style={{
        maxWidth: S.containerMax,
        margin: "0 auto",
        padding: `${S.stackLg} ${currentMargin} ${S.stackMd}`,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          ...(isMobile ? T.displayLgMobile : T.displayLg),
          color: C.primary,
          marginBottom: S.stackSm,
        }}
      >
        Connect with MoneyGreeks
      </h1>
      <p
        style={{
          ...T.bodyLg,
          color: C.onSurfaceVariant,
          maxWidth: "600px",
          margin: "0 auto",
          padding: `0 ${isMobile ? "12px" : "0"}`, // Prevent text touching edges on small screens
        }}
      >
        Dedicated support for institutional investors and analysts. Reach out
        for technical assistance, premium access inquiries, or general questions
        regarding our financial intelligence platform.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------------
// InquiryForm
// ---------------------------------------------------------------------------
const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  subject: SUBJECT_OPTIONS[0],
  message: "",
};

const inputStyle = {
  backgroundColor: C.surface,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: C.outlineVariant,
  borderRadius: "2px",
  padding: "10px 12px", // Slightly increased padding for easier tapping
  color: C.onSurface,
  outline: "none",
  width: "100%",
  boxSizing: "border-box", // Ensures padding doesn't overflow container width
  ...T.bodyMd,
  transition: "border-color 0.2s",
};

const InquiryForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const w = useWindowWidth();
  const isMobile = w < 768;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setForm(INITIAL_FORM);
        }, 3000);
      } else {
        console.error("Failed to submit inquiry:", await res.text());
      }
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    }
  };

  const focusStyle = {
    borderColor: C.primary,
    boxShadow: `0 0 0 1px ${C.primary}`,
  };

  return (
    <div
      style={{
        backgroundColor: C.surfaceContainerLowest,
        border: `1px solid ${C.outlineVariant}`,
        borderRadius: "4px",
        padding: isMobile ? S.stackSm : S.stackMd, // Dynamic padding
        boxShadow: "0px 4px 20px rgba(26,43,60,0.05)",
        minWidth: 0,
      }}
    >
      <h2
        style={{ ...T.headlineSm, color: C.primary, marginBottom: S.stackMd }}
      >
        Inquiry Form
      </h2>

      {submitted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "64px 0",
            textAlign: "center",
          }}
        >
          <Icon
            name="check_circle"
            fill={1}
            style={{ fontSize: "40px", color: C.secondary }}
          />
          <p style={{ ...T.headlineSm, color: C.primary }}>Inquiry Sent!</p>
          <p style={{ ...T.bodyMd, color: C.onSurfaceVariant }}>
            We'll be in touch shortly.
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: S.stackSm }}
        >
          {/* Name row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: S.stackSm,
            }}
          >
            {[
              { id: "firstName", label: "First Name", placeholder: "John" },
              { id: "lastName", label: "Last Name", placeholder: "Doe" },
            ].map((f) => (
              <div
                key={f.id}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor={f.id}
                  style={{
                    ...T.labelMd,
                    color: C.onSurfaceVariant,
                    marginBottom: S.base,
                  }}
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type="text"
                  placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={handleChange}
                  onFocus={() => setFocused(f.id)}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...inputStyle,
                    ...(focused === f.id ? focusStyle : {}),
                  }}
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="email"
              style={{
                ...T.labelMd,
                color: C.onSurfaceVariant,
                marginBottom: S.base,
              }}
            >
              Professional Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.doe@institution.com"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle,
                ...(focused === "email" ? focusStyle : {}),
              }}
            />
          </div>

          {/* Subject */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="subject"
              style={{
                ...T.labelMd,
                color: C.onSurfaceVariant,
                marginBottom: S.base,
              }}
            >
              Subject
            </label>
            <select
              id="subject"
              value={form.subject}
              onChange={handleChange}
              onFocus={() => setFocused("subject")}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle,
                appearance: "none",
                ...(focused === "subject" ? focusStyle : {}),
              }}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="message"
              style={{
                ...T.labelMd,
                color: C.onSurfaceVariant,
                marginBottom: S.base,
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4} // Reduced slightly from 5 to balance layout
              placeholder="How can we assist you?"
              value={form.message}
              onChange={handleChange}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle,
                resize: "vertical", // Allow vertical resize only
                ...(focused === "message" ? focusStyle : {}),
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...T.labelMd,
              width: "100%",
              backgroundColor: C.primary,
              color: C.onPrimary,
              padding: "12px",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              marginTop: S.stackSm,
              boxShadow: "0px 4px 20px rgba(26,43,60,0.05)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Send Inquiry
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// DirectChannels
// ---------------------------------------------------------------------------
const DirectChannels = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: S.stackMd,
        minWidth: 0,
      }}
    >
      {/* Global Offices */}
      <div
        style={{
          backgroundColor: C.surfaceContainerLowest,
          border: `1px solid ${C.outlineVariant}`,
          borderRadius: "4px",
          padding: isMobile ? S.stackSm : S.stackMd,
          boxShadow: "0px 4px 20px rgba(26,43,60,0.05)",
        }}
      >
        <h3
          style={{
            ...T.headlineSm,
            color: C.primary,
            marginBottom: S.stackSm,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon name="location_city" fill={1} />
          Global Offices
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: S.stackSm }}
        >
          {OFFICES.map(({ city, address, region, phone }, idx) => (
            <div
              key={city}
              style={{
                paddingBottom: S.stackSm,
                borderBottom:
                  idx < OFFICES.length - 1
                    ? `1px solid ${C.surfaceContainerHigh}`
                    : "none",
              }}
            >
              <h4
                style={{
                  ...T.labelMd,
                  color: C.onSurface,
                  marginBottom: "4px",
                }}
              >
                {city}
              </h4>
              <p
                style={{
                  ...T.bodyMd,
                  fontSize: "13px", // Slightly smaller for dense info
                  color: C.onSurfaceVariant,
                  lineHeight: 1.5,
                }}
              >
                {address}
                <br />
                {region}
                <br />
                {phone}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contacts */}
      <div
        style={{
          backgroundColor: C.surfaceContainerLowest,
          border: `1px solid ${C.outlineVariant}`,
          borderRadius: "4px",
          padding: isMobile ? S.stackSm : S.stackMd,
          boxShadow: "0px 4px 20px rgba(26,43,60,0.05)",
        }}
      >
        <h3
          style={{
            ...T.headlineSm,
            color: C.primary,
            marginBottom: S.stackSm,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon name="mail" fill={1} />
          Direct Contacts
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: S.stackSm }}
        >
          {DIRECT_CONTACTS.map(({ label, email }) => (
            <div key={label}>
              <h4
                style={{
                  ...T.labelMd,
                  color: C.onSurface,
                  marginBottom: "4px",
                }}
              >
                {label}
              </h4>
              <a
                href={`mailto:${email}`}
                style={{
                  ...T.bodyMd,
                  fontSize: "13px",
                  fontWeight: 500,
                  color: C.primary,
                  textDecoration: "none",
                  wordBreak: "break-all", // Prevents long emails from breaking layouts
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                {email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// FAQTeaser
// ---------------------------------------------------------------------------
const FAQTeaser = () => {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const currentMargin = isMobile
    ? S.marginMobile
    : isTablet
      ? S.marginTablet
      : S.marginDesktop;

  return (
    <section
      style={{ backgroundColor: C.surfaceContainerLow, padding: "64px 0" }} // Slightly reduced padding
    >
      <div
        style={{
          maxWidth: S.containerMax,
          margin: "0 auto",
          padding: `0 ${currentMargin}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: S.stackMd }}>
          <h2
            style={{
              ...T.headlineMd,
              color: C.primary,
              marginBottom: S.base,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ ...T.bodyMd, color: C.onSurfaceVariant }}>
            Find quick answers before reaching out.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: S.gutter,
            maxWidth: "896px",
            margin: "0 auto",
          }}
        >
          {FAQS.map(({ question, answer, cta, href }) => (
            <div
              key={question}
              style={{
                backgroundColor: C.surfaceContainerLowest,
                border: `1px solid ${C.outlineVariant}`,
                borderRadius: "2px",
                padding: S.stackMd,
                transition: "box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0px 12px 32px rgba(26,43,60,0.1)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <h4
                style={{ ...T.labelMd, color: C.primary, marginBottom: "8px" }}
              >
                {question}
              </h4>
              <p
                style={{
                  ...T.bodyMd,
                  fontSize: "14px",
                  color: C.onSurfaceVariant,
                  marginBottom: "16px",
                }}
              >
                {answer}
              </p>
              <Link
                href={href}
                style={{
                  ...T.labelMd,
                  color: C.secondary,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                {cta} <Icon name="arrow_forward" style={{ fontSize: "14px" }} />
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: S.stackLg }}>
          <Link
            href="#"
            style={{
              ...T.labelMd,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px", // Scaled down padding to match font
              border: `1px solid ${C.primary}`,
              color: C.primary,
              textDecoration: "none",
              borderRadius: "2px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.surfaceContainer)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Visit Help Center <Icon name="open_in_new" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ContactPage() {
  const w = useWindowWidth();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;
  const isDesktop = w >= 1024; // lg breakpoint

  const currentMargin = isMobile
    ? S.marginMobile
    : isTablet
      ? S.marginTablet
      : S.marginDesktop;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        color: C.onSurface,
        ...T.bodyMd,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main style={{ flex: 1 }}>
        <HeroSection />

        {/* Form + Channels grid */}
        <section
          style={{
            maxWidth: S.containerMax,
            margin: "0 auto",
            padding: `0 ${currentMargin} 80px`, // Reduced bottom padding slightly
          }}
        >
          <div
            style={{
              display: "grid",
              // Collapses to 1 column on both mobile and tablet for better readability
              gridTemplateColumns: isDesktop ? "1.2fr 1fr" : "1fr",
              gap: S.stackLg,
              alignItems: "start",
            }}
          >
            <InquiryForm />
            <DirectChannels />
          </div>
        </section>

        <FAQTeaser />
      </main>
    </div>
  );
}
