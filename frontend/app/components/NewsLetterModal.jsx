"use client";

import { useState } from "react";
import { AlertCircle, Check, Mail, X } from "lucide-react";

export default function NewsletterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/newsletter-subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "You are subscribed.");
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setEmail("");
          setEmailError("");
          setSuccessMessage("");
        }, 3000);
        return;
      }

      setEmailError(data?.message || "Something went wrong.");
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isSubmitted && !isLoading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]"
          aria-label="Close newsletter modal"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mg-surface-muted)] text-[var(--mg-text)]">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-center font-heading text-2xl font-semibold text-[var(--mg-text)]">
              Subscribe to MoneyGreeks
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-[var(--mg-text-muted)]">
              Get market notes, reports, and educational resources in your inbox.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-[var(--mg-text-muted)]" htmlFor="newsletter-email">
                Email Address
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError("");
                  }}
                  onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className={`mt-2 w-full rounded-2xl border bg-[var(--mg-surface-soft)] px-4 py-3 text-sm text-[var(--mg-text)] outline-none transition placeholder:text-[var(--mg-text-soft)] ${
                    emailError ? "border-[var(--mg-negative)]" : "border-[var(--mg-border)] focus:border-[var(--mg-border-strong)]"
                  }`}
                />
              </label>

              {emailError && (
                <div className="flex items-center gap-2 text-sm text-[var(--mg-negative)]">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{emailError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full rounded-full bg-[var(--mg-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-[var(--mg-text-soft)]">
              Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mg-positive-soft)] text-[var(--mg-positive)]">
              <Check className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-semibold text-[var(--mg-text)]">
              You are all set
            </h2>
            <p className="mt-2 text-sm text-[var(--mg-text-muted)]">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
