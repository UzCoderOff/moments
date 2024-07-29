import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Moments";
  }, []);

  const currentDate = "6/29/2024";

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Privacy Policy</h1>
        <p className="mb-4">Last updated: {currentDate}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
          <p>
            Welcome to Moments! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">2. Information Collection</h2>
          <p>
            We collect information you provide directly to us when you create an account, update your profile, use our service, make a purchase, or communicate with us. This information may include your name, email address, phone number, and any other details you provide.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">3. Use of Information</h2>
          <p>
            We use the information we collect for various purposes, including to provide and maintain our service, notify you about changes, allow you to participate in interactive features, provide customer support, and detect and prevent technical issues.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">4. Information Sharing</h2>
          <p>
            We may share the information we collect with third parties for various purposes, including to comply with legal obligations, enforce our Terms of Service, and protect the rights, property, or safety of our users and others.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">5. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. Despite these measures, we cannot guarantee the absolute security of your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">6. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">7. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:help.info.moments@gmail.com" className="text-blue-500">help.info.moments@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
