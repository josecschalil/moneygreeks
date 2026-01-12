"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import NewsletterModal from "./NewsLetterModal";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-3xl font-semibold text-gray-900">
                MoneyGreeks
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-gray-900 text-md font-medium"
            >
              Home
            </a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-md font-medium">
                <span>
                  <a href="/blog">Resources</a>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-md font-medium">
                <span>
                  <a href="/financial-data">Market Data</a>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <a
              href="/about"
              className="text-gray-700 hover:text-gray-900 text-md font-medium"
            >
              About us
            </a>
          </div>

          {/* Desktop Newsletter Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              onClick={() => {
                setShowNewsletterModal(true);
                setMobileMenuOpen(false);
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Subscribe Now</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </a>
            <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
              <a href="/blog">
                <div className="flex items-center justify-between">
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </a>
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
              <a href="/financial-data">
                <div className="flex items-center justify-between">
                  <span>Market Data</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </a>
            </div>

            <a
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </a>
          </div>

          {/* Mobile Subscribe Button */}
          <div className="px-10 py-4 border-t border-gray-200">
            <button
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => {
                setShowNewsletterModal(true);
                setMobileMenuOpen(false);
              }}
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      )}
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
    </nav>
  );
}
