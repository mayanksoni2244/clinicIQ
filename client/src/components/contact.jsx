import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white px-6 md:px-24 py-12 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Contact Us</h1>
        <p className="text-lg mb-6">We're here to help. Reach out anytime through the platforms below:</p>

        <div className="space-y-6 text-lg">
          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="text-primary" />
            <p>
              <span className="font-medium">Phone / WhatsApp:</span>{' '}
              <a href="https://wa.me/917014394094" className="text-blue-600 hover:underline">
                +91 98767 45654
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-primary" />
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a href="mailto:support@cliniq.app" className="text-blue-600 hover:underline">
                support@cliniq.app
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <FaInstagram className="text-pink-600" />
            <p>
              <span className="font-medium">Instagram:</span>{' '}
              <a href="https://instagram.com/cliniq.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                @cliniq.app
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <FaWhatsapp className="text-green-500" />
            <p>
              <span className="font-medium">Live Chat:</span> Available via WhatsApp or website chat (bottom-right corner).
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-gray-500">Support hours: 9:00 AM – 9:00 PM (IST)</p>
      </div>
    </div>
  );
};

export default Contact;
