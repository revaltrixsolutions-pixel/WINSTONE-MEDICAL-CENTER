import { Routes, Route } from "react-router-dom";

import Home from "@/features/public/pages/Home.tsx";
import ServicesPage from "@/features/public/pages/Services.tsx";
import HospitalGallery from "@/features/public/pages/GalleryPage.tsx";
import AdminGallery from "@/features/admin/components/services/GalleryManager.tsx";
import AboutUs from "@/features/public/pages/About.tsx";
import AppointmentPage from "@/features/public/components/home/HomepageAppointment.tsx";
import AdminServices from "@/features/admin/pages/AdminServices.tsx";
import AdminDashboard from "@/features/admin/pages/AdminDashboard.tsx";
import AdminAppointments from "@/features/admin/pages/AdminAppointmentPage.tsx";
import HospitalDoctors from "@/features/admin/pages/HospitalDoctors.tsx";
import Doctors from "@/features/public/pages/Doctors.tsx";
import TermsPage from "@/features/public/pages/TermsPage.tsx";
import PrivacyPage from "@/features/public/pages/PrivacyPage.tsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/gallery" element={<HospitalGallery />} />
      <Route path="/appointment" element={<AppointmentPage />} />

      {/* Admin Pages */}
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route path="/admin/gallery" element={<AdminGallery />} />
      <Route path="/admin/doctors" element={<HospitalDoctors />} />
      <Route path="/api/appointments" element={<AdminAppointments />} />

      {/* Legal Pages */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  );
}


