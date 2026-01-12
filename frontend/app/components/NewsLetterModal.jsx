import React, { useState } from "react";
import { X, Mail, Check, AlertCircle } from "lucide-react";

export default function NewsletterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    // Validate email before submission
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Replace this with your actual API call
    // Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);

    // Reset and close after 3 seconds
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setEmail("");
      setEmailError("");
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue bg-opacity-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        {!isSubmitted ? (
          <div className="p-8">
            {/* Icon */}
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Get the latest updates, articles, and resources delivered to your
              inbox weekly.
            </p>

            {/* Email Input */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className={`w-full text-black px-4 py-3 border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 ${
                    emailError ? "focus:ring-red-500" : "focus:ring-gray-900"
                  } focus:border-transparent outline-none transition-all`}
                />
                {emailError && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full px-6 py-3 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        ) : (
          // Success State
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h2>
            <p className="text-gray-600">
              Thank you for subscribing. Check your inbox for a confirmation
              email.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
