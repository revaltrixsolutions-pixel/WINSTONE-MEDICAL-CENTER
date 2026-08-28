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

export interface CreateAppointmentInput {
patientId?: string;

patientName: string;

patientPhone: string;

patientEmail?: string;

doctorId?: string;

department?: string;

service?: string;

appointmentDate: string;

appointmentTime?: string;

reason?: string;

notes?: string;

priority?: AppointmentPriority;
}

export interface UpdateAppointmentInput {
patientId?: string;

patientName?: string;

patientPhone?: string;

patientEmail?: string;

doctorId?: string;

department?: string;

service?: string;

appointmentDate?: string;

appointmentTime?: string;

reason?: string;

notes?: string;

priority?: AppointmentPriority;

status?: AppointmentStatus;
}
