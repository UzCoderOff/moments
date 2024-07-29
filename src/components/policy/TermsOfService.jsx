import React, { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service - Moments";
  }, []);

  const currentDate = "6/29/2024";

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Terms of Service</h1>
        <p className="mb-4">Last updated: {currentDate}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
          <p>
            Welcome to Moments! These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to comply with and be bound by these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">2. User Account Responsibilities</h2>
          <p>
            When you create an account with us, you must provide us with accurate and complete information. You are responsible for safeguarding your account and ensuring that all activities under your account comply with these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">3. Prohibited Activities</h2>
          <p>
            You agree not to use the Service to engage in any unlawful activities, including but not limited to spamming, harassment, or distributing malware. Any violation of this provision may result in immediate termination of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">4. Termination of Services</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">5. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">6. Amendments to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">7. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:help.info.moments@gmail.com" className="text-blue-500">help.info.moments@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
