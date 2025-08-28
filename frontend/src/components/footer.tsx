import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/90 backdrop-blur border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">eStore</h3>
            <p className="text-sm text-gray-600">
              Your one-stop destination for everything you need. Shop with ease
              and confidence.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Stay Connected
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-indigo-600 transition">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} eStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
