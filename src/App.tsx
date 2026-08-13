import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import HospitalGallery from "./pages/GalleryPage";
import AdminGallery from "./components/admin/services/GalleryManager";
import AboutUs from "./pages/About";
import AppointmentPage from "./components/home/HomepageAppointment";
import AdminServices from "./pages/admin/AdminServices";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointmentPage";
import HospitalDoctors from "./pages/admin/HospitalDoctors";
import Doctors from "./pages/Doctors";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/appointments" element={<AdminAppointments />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/gallery" element={<HospitalGallery />} />
        <Route path="/admin/doctors" element={<HospitalDoctors />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  );
}