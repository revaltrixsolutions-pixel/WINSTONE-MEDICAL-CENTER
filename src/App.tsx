import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import AppointmentPage from "./components/home/HomepageAppointment";
import AdminServices from "./pages/admin/AdminServices";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointmentPage";
import Doctors from "./pages/admin/HospitalDoctors";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/appointments" element={<AdminAppointments />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/doctors" element={<Doctors />} />
      </Routes>
    </BrowserRouter>
  );
}