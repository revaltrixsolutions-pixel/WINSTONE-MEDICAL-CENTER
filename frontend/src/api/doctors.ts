import api from "@/api/axios";

/* =========================================================
   TYPES
   ========================================================= */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  bio: string;
  imageUrls: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientMessage {
  id: string;
  doctorId: string;
  doctorName?: string;
  messageText: string;
  createdAt?: string;
}

export interface DoctorRating {
  id: string;
  doctorId: string;
  doctorName?: string;
  rating: number;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  doctorId?: string;
  doctorName?: string;
  patientName?: string;
  patientPhone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  status?: string;
  createdAt?: string;
}

/* =========================================================
   API ENDPOINT
   ========================================================= */

const DOCTORS_URL = "/api/admin/doctors";

/* =========================================================
   GET ALL DOCTORS
   GET /api/admin/doctors
   ========================================================= */

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>(DOCTORS_URL);

  if (!Array.isArray(response.data)) {
    throw new Error("Invalid doctors response from server.");
  }

  return response.data;
};

/* =========================================================
   GET ACTIVE DOCTORS
   ========================================================= */

export const getActiveDoctors = async (): Promise<Doctor[]> => {
  const doctors = await getDoctors();

  return doctors.filter((doctor) => doctor.active);
};

/* =========================================================
   GET SINGLE DOCTOR
   GET /api/admin/doctors/:id
   ========================================================= */

export const getDoctor = async (id: string): Promise<Doctor> => {
  if (!id.trim()) {
    throw new Error("Doctor ID is required.");
  }

  /*
   * Your current backend does not yet have GET /:id.
   * We therefore fetch the real database list and locate the doctor.
   */
  const doctors = await getDoctors();

  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    throw new Error("Doctor not found.");
  }

  return doctor;
};

/* =========================================================
   CREATE DOCTOR
   POST /api/admin/doctors
   ========================================================= */

export interface CreateDoctorData {
  name: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  bio: string;
  imageUrls: string[];
  active: boolean;
}

export const createDoctor = async (
  data: CreateDoctorData
): Promise<Doctor> => {
  const response = await api.post<Doctor>(
    DOCTORS_URL,
    data
  );

  return response.data;
};

/* =========================================================
   UPDATE DOCTOR
   PUT /api/admin/doctors/:id
   ========================================================= */

export interface UpdateDoctorData
  extends Partial<CreateDoctorData> {}

export const updateDoctor = async (
  id: string,
  data: UpdateDoctorData
): Promise<Doctor> => {
  if (!id.trim()) {
    throw new Error("Doctor ID is required.");
  }

  const response = await api.put<Doctor>(
    `${DOCTORS_URL}/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
};

/* =========================================================
   DELETE DOCTOR
   DELETE /api/admin/doctors/:id
   ========================================================= */

export const deleteDoctor = async (
  id: string
): Promise<void> => {
  if (!id.trim()) {
    throw new Error("Doctor ID is required.");
  }

  await api.delete(
    `${DOCTORS_URL}/${encodeURIComponent(id)}`
  );
};

/* =========================================================
   MESSAGES
   ========================================================= */

export const getDoctorMessages = async (): Promise<
  PatientMessage[]
> => {
  const response = await api.get<PatientMessage[]>(
    `${DOCTORS_URL}/messages`
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};

export const deleteDoctorMessage = async (
  id: string
): Promise<void> => {
  if (!id.trim()) {
    throw new Error("Message ID is required.");
  }

  await api.delete(
    `${DOCTORS_URL}/messages/${encodeURIComponent(id)}`
  );
};

/* =========================================================
   RATINGS
   ========================================================= */

export const getDoctorRatings = async (): Promise<
  DoctorRating[]
> => {
  const response = await api.get<DoctorRating[]>(
    `${DOCTORS_URL}/ratings`
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};

/* =========================================================
   APPOINTMENTS
   ========================================================= */

export const getDoctorAppointments = async (): Promise<
  Appointment[]
> => {
  const response = await api.get<Appointment[]>(
    `${DOCTORS_URL}/appointments`
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};

/* =========================================================
   UPDATE APPOINTMENT STATUS
   PATCH /api/admin/doctors/appointments/:id/status
   ========================================================= */

export const updateDoctorAppointmentStatus = async (
  id: string,
  status: string
): Promise<Appointment> => {
  if (!id.trim()) {
    throw new Error("Appointment ID is required.");
  }

  const response = await api.patch<Appointment>(
    `${DOCTORS_URL}/appointments/${encodeURIComponent(
      id
    )}/status`,
    { status }
  );

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default {
  getDoctors,
  getActiveDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorMessages,
  deleteDoctorMessage,
  getDoctorRatings,
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
};








