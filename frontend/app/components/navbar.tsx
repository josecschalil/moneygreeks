"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Untitled UI
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              Home
            </a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm font-medium">
                <span>Products</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 text-sm font-medium">
                <span>Blog</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              About us
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Log in
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              Sign up
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
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </a>
            <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
              <div className="flex items-center justify-between">
                <span>Products</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
              <div className="flex items-center justify-between">
                <span>Blog</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Pricing
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About us
            </a>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 space-y-2">
            <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Log in
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
