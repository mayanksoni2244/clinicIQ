import React from 'react'
import RoleSelector from './components/first.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Nav.jsx'
import HomePage from './components/patient.jsx'
import AppointmentSuccess from './components/rec.jsx'
import BookAppointment from './components/Appointment.jsx'
import MyAppointments from './components/myapp.jsx'
import DoctorSignup from './components/Dsignup.jsx'
import DoctorLogin from './components/Dlogin.jsx'
import { RoleProvider } from './context/Rolecontext.jsx'
import PatientSignup from './components/Auth/patientSignup.jsx'
import PatientLogin from './components/Auth/patientlogin.jsx'
import Profile from './components/profile.jsx';
import Dashboard from './components/dashboard.jsx';
import DoctorAppointments from './components/appointments.jsx';
import DoctorHistory from './components/history.jsx';
import WeeklyAvailability from './components/availability.jsx';
import AboutUs from './components/about.jsx';
import Contact from './components/contact.jsx';


function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/rec" element={<AppointmentSuccess />} />
          <Route path="/myapp" element={<MyAppointments />} />
          <Route path="/Dsignup" element={<DoctorSignup />} />
          <Route path="/Dlogin" element={<DoctorLogin />} />
          <Route path="/patientSignup" element={<PatientSignup />} />
          <Route path="/patientLogin" element={<PatientLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path="/history" element={<DoctorHistory />} />
          <Route path="/availability" element={<WeeklyAvailability />} />

          <Route path="/about" element={<AboutUs />} /> 
          <Route path="/contact" element={<Contact />} />

        </Routes>
      </RoleProvider>
    </BrowserRouter>
  )
}

export default App