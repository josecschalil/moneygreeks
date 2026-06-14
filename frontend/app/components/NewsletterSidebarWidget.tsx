"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

export default function NewsletterSidebarWidget() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter-subscribe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-4">
      <div>
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
          Exclusive Reports
        </span>
        <h3 className="text-base font-bold mt-2.5 font-serif text-gray-900">
          The Alpha Letter
        </h3>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Join 15,000+ sophisticated investors receiving weekly strategic
          analysis.
        </p>
      </div>

      <div className="space-y-2 relative">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
          placeholder="name@company.com"
          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 border text-sm focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
            status === "error"
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          disabled={status === "loading" || status === "success"}
        />

        {status === "error" && (
          <div className="flex items-center text-red-600 text-[11px] mt-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center text-green-600 text-[11px] mt-1 bg-green-50 p-1 rounded">
            <Check className="w-3 h-3 mr-1" />
            <span>{message}</span>
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={status === "loading" || status === "success"}
          className="w-full py-2.5 text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400  font-semibold text-sm transition-colors shadow-md flex items-center justify-center"
        >
          {status === "loading" ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : status === "success" ? (
            "Subscribed!"
          ) : (
            "Subscribe Now"
          )}
        </button>
      </div>
    </div>
  );
}
