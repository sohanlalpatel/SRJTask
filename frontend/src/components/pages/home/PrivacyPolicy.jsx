import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-[#020617] text-gray-300 px-6 py-16 pt-38">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Privacy Policy
          </h1>

          <p className="text-sm text-gray-400 mb-10">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          {/* SECTION */}
          {sections.map((sec, i) => (
            <div key={i} className="mb-8">
              <h2 className="text-xl font-semibold text-[#38BDF8] mb-3">
                {i + 1}. {sec.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

const sections = [
  {
    title: "Introduction",
    content:
      "We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website and services.",
  },
  {
    title: "Information We Collect",
    content:
      "We may collect personal information such as your name, email address, phone number, and business details when you fill out forms or contact us. Additionally, we may collect technical data like IP address, browser type, and device information.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to provide and improve our services, respond to inquiries, process transactions, and communicate updates. We may also use your data for analytics and marketing purposes.",
  },
  {
    title: "Cookies and Tracking Technologies",
    content:
      "We use cookies and similar tracking technologies to enhance user experience, analyze website traffic, and personalize content. You can disable cookies through your browser settings.",
  },
  {
    title: "Data Sharing and Disclosure",
    content:
      "We do not sell your personal data. However, we may share information with trusted third-party service providers who assist us in operating our website, conducting business, or serving users, provided they agree to keep this information confidential.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information. You may also opt out of receiving marketing communications at any time by contacting us.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.",
  },
  {
    title: "Children’s Privacy",
    content:
      "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal data from children.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
  {
    title: "Contact Information",
    content:
      "If you have any questions about this Privacy Policy, you can contact us at:\nEmail: srjglobaltechnology@gmail.com\nPhone: +91 96251 90448",
  },
  {
    title: "Consent",
    content:
      "By using our website, you consent to our Privacy Policy and agree to its terms.",
  },
];
