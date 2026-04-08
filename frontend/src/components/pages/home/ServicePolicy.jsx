import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ServicePolicy = () => {
  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-[#020617] text-gray-300 px-4 pt-38 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Service Policy
          </h1>

          <p className="text-gray-400 mb-10">
            Effective Date: 2026 <br />
            This Service Policy outlines the terms, conditions, and guidelines
            under which SRJ Global Technologies provides its services to
            clients.
          </p>

          {/* Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                1. Overview
              </h2>
              <p>
                SRJ Global Technologies offers a wide range of IT and digital
                services including website development, software solutions,
                mobile applications, game development, digital marketing, UI/UX
                design, and enterprise solutions. By engaging with our services,
                you agree to comply with the policies outlined below.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                2. Scope of Services
              </h2>
              <p>Our services include but are not limited to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Web, App, and Software Development</li>
                <li>Game Development (Unity, Casino, Mobile Games)</li>
                <li>ERP & Billing Software Solutions</li>
                <li>UI/UX & Graphic Designing</li>
                <li>Digital Marketing & SEO Services</li>
                <li>Domain Registration, Hosting & Maintenance</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                3. Project Requirements
              </h2>
              <p>
                Clients must provide complete and accurate project requirements
                before project initiation. Any additional features or changes
                requested after approval may result in additional costs and
                extended timelines.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                4. Payment Terms
              </h2>
              <p>
                Projects are initiated after advance payment confirmation.
                Payment structure typically includes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Advance Payment (30%–50%)</li>
                <li>Milestone-Based Payments</li>
                <li>Final Payment before Delivery</li>
              </ul>
              <p className="mt-2">
                Failure to complete payments may result in project suspension.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                5. Delivery Timeline
              </h2>
              <p>
                Delivery timelines depend on project scope and complexity. While
                we strive to meet deadlines, delays may occur due to client
                feedback, requirement changes, or unforeseen technical issues.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                6. Revisions & Support
              </h2>
              <p>
                Each project includes a limited number of revisions as agreed.
                Additional revisions may be charged. Post-delivery support is
                provided as per the selected plan or agreement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                7. Intellectual Property
              </h2>
              <p>
                Upon full payment, ownership of the final deliverables is
                transferred to the client. However, SRJ Global Technologies
                retains the right to showcase the project in its portfolio.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                8. Cancellation & Refund Policy
              </h2>
              <p>
                Once a project has started, payments are non-refundable. In case
                of cancellation, work completed up to that point will be
                delivered to the client.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                9. Client Responsibilities
              </h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide timely feedback and approvals</li>
                <li>Share necessary content, images, and data</li>
                <li>Ensure compliance with legal and ethical standards</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                10. Limitation of Liability
              </h2>
              <p>
                SRJ Global Technologies shall not be liable for indirect or
                consequential damages arising from the use of our services,
                including but not limited to data loss, downtime, or third-party
                failures.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                11. Confidentiality
              </h2>
              <p>
                We ensure that all client data, project details, and sensitive
                information are kept confidential and are not shared with third
                parties without consent.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#38BDF8]">
                12. Policy Updates
              </h2>
              <p>
                SRJ Global Technologies reserves the right to update this policy
                at any time. Changes will be reflected on this page.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 text-sm text-gray-500">
            © 2026 SRJ Global Technologies. All rights reserved.
          </div>
        </div>
      </div>

      <Footer/> 
    </>
  );
};

export default ServicePolicy;