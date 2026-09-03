import api from "@/api/axios";

/* =========================================================
   API URL
   ========================================================= */

const APPOINTMENTS_URL = "/api/appointments";

/* =========================================================
   TYPES
   ========================================================= */

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

/* =========================================================
   APPOINTMENT
   ========================================================= */

export interface Appointment {
  id: string;

  patientId?: string | null;
  patientName: string;
  patientPhone: string;
  patientEmail?: string | null;

  doctorId?: string | null;
  doctorName?: string | null;

  department?: string | null;
  service?: string | null;

  appointmentDate: string;
  appointmentTime?: string | null;

  /*
   * Reason supplied by the patient when booking.
   * Example:
   * "I need a consultation for persistent headaches."
   */
  reason?: string | null;

  /*
   * Additional internal/admin notes.
   */
  notes?: string | null;

  status: AppointmentStatus;
  priority?: AppointmentPriority | null;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   CREATE APPOINTMENT DATA
   ========================================================= */

export interface CreateAppointmentData {
  patientId?: string;

  patientName: string;
  patientPhone: string;
  patientEmail?: string;

  /*
   * Doctor selected from the database.
   */
  doctorId?: string;

  department?: string;
  service?: string;

  appointmentDate: string;
  appointmentTime?: string;

  /*
   * Patient's reason for requesting the appointment.
   */
  reason?: string;

  /*
   * Optional additional notes.
   */
  notes?: string;

  priority?: AppointmentPriority;
}

/* =========================================================
   UPDATE APPOINTMENT DATA
   ========================================================= */

export interface UpdateAppointmentData
  extends Partial<CreateAppointmentData> {
  status?: AppointmentStatus;
}

/* =========================================================
   API RESPONSE TYPES
   ========================================================= */

export interface AppointmentResponse {
  success?: boolean;
  message?: string;

  data?: Appointment;
  appointment?: Appointment;

  error?: string;
}

export interface AppointmentsResponse {
  success?: boolean;
  message?: string;

  data?: Appointment[];
  appointments?: Appointment[];

  error?: string;
}

/* =========================================================
   RESPONSE HELPERS
   ========================================================= */

/**
 * Extracts a single appointment from different possible
 * backend response formats.
 */
const extractAppointment = (
  result: AppointmentResponse
): Appointment => {
  if (result.data) {
    return result.data;
  }

  if (result.appointment) {
    return result.appointment;
  }

  throw new Error(
    result.message ||
      result.error ||
      "Appointment data was not returned."
  );
};

/**
 * Extracts an appointment array from different possible
 * backend response formats.
 */
const extractAppointments = (
  result: AppointmentsResponse
): Appointment[] => {
  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (Array.isArray(result.appointments)) {
    return result.appointments;
  }

  return [];
};

/* =========================================================
   CREATE APPOINTMENT
   POST /api/appointments
   ========================================================= */

export const createAppointment = async (
  data: CreateAppointmentData
): Promise<Appointment> => {
  if (!data.patientName?.trim()) {
    throw new Error("Patient name is required.");
  }

  if (!data.patientPhone?.trim()) {
    throw new Error("Patient phone number is required.");
  }

  if (!data.appointmentDate?.trim()) {
    throw new Error("Appointment date is required.");
  }

  if (data.doctorId !== undefined && !data.doctorId.trim()) {
    throw new Error("Invalid doctor ID.");
  }

  const payload: CreateAppointmentData = {
    ...data,

    patientName: data.patientName.trim(),
    patientPhone: data.patientPhone.trim(),

    patientEmail: data.patientEmail?.trim() || undefined,

    doctorId: data.doctorId?.trim() || undefined,

    department: data.department?.trim() || undefined,
    service: data.service?.trim() || undefined,

    appointmentDate: data.appointmentDate.trim(),
    appointmentTime: data.appointmentTime?.trim() || undefined,

    reason: data.reason?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
  };

  const response = await api.post<AppointmentResponse>(
    APPOINTMENTS_URL,
    payload
  );

  return extractAppointment(response.data);
};

/* =========================================================
   GET ALL APPOINTMENTS
   GET /api/appointments
   ========================================================= */

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<AppointmentsResponse>(
    APPOINTMENTS_URL
  );

  return extractAppointments(response.data);
};

/* =========================================================
   GET SINGLE APPOINTMENT
   GET /api/appointments/:id
   ========================================================= */

export const getAppointment = async (
  id: string
): Promise<Appointment> => {
  const cleanId = id?.trim();

  if (!cleanId) {
    throw new Error("Appointment ID is required.");
  }

  const response = await api.get<AppointmentResponse>(
    `${APPOINTMENTS_URL}/${encodeURIComponent(cleanId)}`
  );

  return extractAppointment(response.data);
};

/* =========================================================
   UPDATE APPOINTMENT
   PUT /api/appointments/:id
   ========================================================= */

export const updateAppointment = async (
  id: string,
  data: UpdateAppointmentData
): Promise<Appointment> => {
  const cleanId = id?.trim();

  if (!cleanId) {
    throw new Error("Appointment ID is required.");
  }

  const payload: UpdateAppointmentData = {
    ...data,

    patientName: data.patientName?.trim(),
    patientPhone: data.patientPhone?.trim(),
    patientEmail: data.patientEmail?.trim() || undefined,

    doctorId: data.doctorId?.trim() || undefined,

    department: data.department?.trim() || undefined,
    service: data.service?.trim() || undefined,

    appointmentDate: data.appointmentDate?.trim(),
    appointmentTime: data.appointmentTime?.trim() || undefined,

    reason: data.reason?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
  };

  const response = await api.put<AppointmentResponse>(
    `${APPOINTMENTS_URL}/${encodeURIComponent(cleanId)}`,
    payload
  );

  return extractAppointment(response.data);
};

/* =========================================================
   CONFIRM APPOINTMENT
   PUT /api/appointments/:id
   ========================================================= */

export const confirmAppointment = async (
  id: string
): Promise<Appointment> => {
  return updateAppointment(id, {
    status: "CONFIRMED",
  });
};

/* =========================================================
   COMPLETE APPOINTMENT
   PUT /api/appointments/:id
   ========================================================= */

export const completeAppointment = async (
  id: string
): Promise<Appointment> => {
  return updateAppointment(id, {
    status: "COMPLETED",
  });
};

/* =========================================================
   CANCEL APPOINTMENT
   PUT /api/appointments/:id
   ========================================================= */

export const cancelAppointment = async (
  id: string
): Promise<Appointment> => {
  return updateAppointment(id, {
    status: "CANCELLED",
  });
};

/* =========================================================
   MARK AS NO-SHOW
   PUT /api/appointments/:id
   ========================================================= */

export const markAppointmentNoShow = async (
  id: string
): Promise<Appointment> => {
  return updateAppointment(id, {
    status: "NO_SHOW",
  });
};

/* =========================================================
   DELETE APPOINTMENT
   DELETE /api/appointments/:id
   ========================================================= */

export const deleteAppointment = async (
  id: string
): Promise<void> => {
  const cleanId = id?.trim();

  if (!cleanId) {
    throw new Error("Appointment ID is required.");
  }

  await api.delete(
    `${APPOINTMENTS_URL}/${encodeURIComponent(cleanId)}`
  );
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  markAppointmentNoShow,
  deleteAppointment,
};




