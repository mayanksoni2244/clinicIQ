import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">Contact Us</h1>
      <p className="text-center text-gray-700 mb-12">
        Got questions or need assistance? We'd love to hear from you! Reach out to ClinicIQ via any
        of the channels below.
      </p>

      <div className="grid md:grid-cols-3 gap-8 text-gray-800">
        <div className="flex flex-col items-center bg-blue-50 p-6 rounded-lg shadow">
          <FaPhoneAlt className="text-3xl text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Phone</h2>
          <p className="text-sm">+91 98765 43210</p>
        </div>
        <div className="flex flex-col items-center bg-blue-50 p-6 rounded-lg shadow">
          <FaEnvelope className="text-3xl text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-sm">clinic@example.com</p>
        </div>
        <div className="flex flex-col items-center bg-blue-50 p-6 rounded-lg shadow">
          <FaMapMarkerAlt className="text-3xl text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Address</h2>
          <p className="text-sm text-center">123 Health Street, Indore, MP</p>
        </div>
      </div>

      <p className="text-sm text-center text-gray-500 mt-12">
        We typically respond within one business day.
      </p>
    </div>
  );
};

export default ContactPage;