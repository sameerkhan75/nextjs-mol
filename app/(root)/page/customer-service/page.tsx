"use client";

import Link from "next/link";

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/images/noo.jpeg')" }}>
      <div className="absolute inset-0 bg-white/10" />
      
      <div className="relative z-10 max-w-md w-full bg-white/95 rounded-xl shadow-lg p-8 font-sans">
        <h1 className="text-3xl font-bold text-indigo-900 text-center mb-5">
          Moltres Support
        </h1>
        
        <p className="text-gray-700 text-center mb-6 text-lg">
          We are here to help you with any issues or questions about your orders, products, or sellers.
        </p>

        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-red-600 font-semibold text-lg mb-2">
            ⚠️ Report a Scam or Wrong Product
          </h2>
          <p className="text-gray-600 mb-3">
            If someone has scammed you or sent you the wrong product, please contact us immediately:
          </p>
          <ul className="text-gray-800 list-disc pl-5 mb-3">
            <li>
              Email:{" "}
              <Link href="mailto:sameer754811@gmail.com" className="text-blue-600 underline">
                sameer754811@gmail.com
              </Link>
            </li>
            <li>
              Phone:{" "}
              <Link href="tel:8630900119" className="text-blue-600 underline">
                8630900119
              </Link>
            </li>
          </ul>
          <p className="text-gray-500 text-sm">
            Our team will investigate and take action as soon as possible. Please provide all relevant details and evidence.
          </p>
        </div>

        <div className="bg-slate-100 rounded-lg p-4 text-center text-gray-700 text-base">
          <strong>Need help with something else?</strong>
          <br />
          Reach out to us for any support regarding your orders, returns, or account.
        </div>
      </div>
    </div>
  );
}
