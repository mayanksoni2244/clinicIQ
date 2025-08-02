import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 md:px-24 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-primary">About ClinicIQ</h1>
        <p className="text-lg leading-relaxed mb-4">
          Welcome to <span className="font-semibold">ClinicIQ</span> – a smarter way to manage your healthcare.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          We're not just another clinic app. We're a personalized, intuitive platform designed to connect patients and doctors more efficiently – saving time, reducing errors, and delivering a seamless healthcare experience.
        </p>
        <ul className="list-disc list-inside text-lg mb-4">
          <li>Patients easily book, cancel, or reschedule appointments online</li>
          <li>Doctors manage their schedules without chaos</li>
          <li>Clinics improve workflow and patient satisfaction</li>
        </ul>
        <p className="text-lg leading-relaxed">
          Whether you’re a patient seeking quality care or a doctor streamlining operations, ClinicIQ is built with <span className="font-semibold">you</span> in mind.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          We're proudly local, yet built with global standards. Clean UI. Real-time access. Secure data. Human support.
        </p>
        <p className="text-lg leading-relaxed mt-4 font-medium text-primary">This is healthcare – reimagined.</p>
      </div>
    </div>
  );
};

export default AboutUs;
