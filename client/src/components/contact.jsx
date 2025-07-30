import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h2>
      <p className="text-gray-700 leading-relaxed mb-8">
        Need help or have questions? We’d love to hear from you! You can reach ClinicIQ via the
        following channels:
      </p>
      <ul className="space-y-4 text-left mx-auto inline-block text-gray-800">
        <li><strong>Email:</strong> clinic@example.com</li>
        <li><strong>Phone:</strong> +91 98765 43210</li>
        <li><strong>Address:</strong> 123 Health Street, Indore, MP</li>
      </ul>
      <p className="text-gray-600 mt-10 text-sm">We typically respond within one business day.</p>
    </div>
  );
};

export default ContactPage;