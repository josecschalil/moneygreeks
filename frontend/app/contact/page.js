"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ExternalLink, Mail } from "lucide-react";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "General Inquiry",
  message: "",
};

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Technical Support",
  "Premium Subscription",
  "Data Access",
];

const offices = [
  {
    city: "New York",
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
    address: "Bandra Kurla Complex",
    region: "Mumbai, Maharashtra 400051",
    phone: "+91 22 6123 4567",
  },
];

const directContacts = [
  { label: "Institutional Support", email: "support@moneygreeks.com" },
  { label: "Media Inquiries", email: "press@moneygreeks.com" },
];

const faqs = [
  {
    question: "How do I access premium reports?",
    answer:
      "Premium reports are available to active subscribers from the Reports section after login.",
    cta: "Read article",
    href: "#",
  },
  {
    question: "Can I export market data?",
    answer:
      "Institutional accounts can export selected data in CSV format and request API access.",
    cta: "View docs",
    href: "#",
  },
];

const fieldClass =
  "mt-2 w-full rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-4 py-3 text-sm text-[var(--mg-text)] outline-none transition placeholder:text-[var(--mg-text-soft)] focus:border-[var(--mg-border-strong)] focus:bg-white";

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/enquiries/", {
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
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <section className="border-b border-[var(--mg-border)] bg-[var(--mg-surface)]">
        <div className="mx-auto max-w-[var(--mg-container)] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
            Contact
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight text-[var(--mg-text)] md:text-6xl">
            Connect with MoneyGreeks.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--mg-text-muted)]">
            Reach out for platform support, premium access, data requests, or institutional research conversations.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--mg-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:px-8 lg:py-14">
        <div className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)] md:p-8">
          <h2 className="font-heading text-2xl font-semibold text-[var(--mg-text)]">Inquiry Form</h2>

          {submitted ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-[var(--mg-positive)]" aria-hidden="true" />
              <p className="mt-4 font-heading text-xl font-semibold text-[var(--mg-text)]">Inquiry sent</p>
              <p className="mt-2 text-sm text-[var(--mg-text-muted)]">We will be in touch shortly.</p>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-[var(--mg-text-muted)]">
                  First Name
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-medium text-[var(--mg-text-muted)]">
                  Last Name
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-[var(--mg-text-muted)]">
                Professional Email
                <input
                  id="email"
                  type="email"
                  placeholder="john.doe@institution.com"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-medium text-[var(--mg-text-muted)]">
                Subject
                <select id="subject" value={form.subject} onChange={handleChange} className={fieldClass}>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-[var(--mg-text-muted)]">
                Message
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we assist you?"
                  value={form.message}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--mg-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Send Inquiry
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)]">
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-[var(--mg-text)]">
              <Building2 className="h-5 w-5" aria-hidden="true" />
              Global Offices
            </h2>
            <div className="mt-5 divide-y divide-[var(--mg-border)]">
              {offices.map((office) => (
                <div key={office.city} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-medium text-[var(--mg-text)]">{office.city}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--mg-text-muted)]">
                    {office.address}
                    <br />
                    {office.region}
                    <br />
                    {office.phone}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)]">
            <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-[var(--mg-text)]">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Direct Contacts
            </h2>
            <div className="mt-5 space-y-4">
              {directContacts.map((contact) => (
                <div key={contact.label}>
                  <p className="text-sm font-medium text-[var(--mg-text)]">{contact.label}</p>
                  <a href={`mailto:${contact.email}`} className="mt-1 block break-all text-sm text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[var(--mg-border)] bg-[var(--mg-surface)]">
        <div className="mx-auto max-w-[var(--mg-container)] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">Help</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--mg-text)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--mg-text)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--mg-text-muted)]">{faq.answer}</p>
                <Link href={faq.href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text)]">
                  {faq.cta}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
