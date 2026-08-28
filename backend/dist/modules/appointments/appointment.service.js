import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();
/**
 * Create a new appointment
 *
 * All appointment data is persisted directly to PostgreSQL
 * through Prisma.
 */
export const createAppointment = async (input) => {
    if (!input.patientName?.trim()) {
        throw new Error("Patient name is required.");
    }
    if (!input.patientPhone?.trim()) {
        throw new Error("Patient phone number is required.");
    }
    if (!input.appointmentDate?.trim()) {
        throw new Error("Appointment date is required.");
    }
    const appointmentDate = new Date(input.appointmentDate);
    if (Number.isNaN(appointmentDate.getTime())) {
        throw new Error("Invalid appointment date.");
    }
    const appointment = await prisma.appointment.create({
        data: {
            patientId: input.patientId?.trim() || undefined,
            patientName: input.patientName.trim(),
            patientPhone: input.patientPhone.trim(),
            patientEmail: input.patientEmail?.trim() || undefined,
            doctorId: input.doctorId?.trim() || undefined,
            department: input.department?.trim() || undefined,
            service: input.service?.trim() || undefined,
            appointmentDate,
            appointmentTime: input.appointmentTime?.trim() || undefined,
            reason: input.reason?.trim() || undefined,
            notes: input.notes?.trim() || undefined,
            status: "PENDING",
            priority: input.priority || "NORMAL",
        },
    });
    return appointment;
};
/**
 * Get all appointments
 *
 * Returns every appointment stored in PostgreSQL.
 */
export const getAppointments = async () => {
    return prisma.appointment.findMany({
        orderBy: [
            {
                appointmentDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};
/**
 * Get one appointment by ID
 */
export const getAppointmentById = async (id) => {
    if (!id?.trim()) {
        return null;
    }
    return prisma.appointment.findUnique({
        where: {
            id: id.trim(),
        },
    });
};
/**
 * Update an appointment
 *
 * Supports partial updates, including status changes
 * from the admin dashboard.
 */
export const updateAppointment = async (id, input) => {
    if (!id?.trim()) {
        throw new Error("Appointment ID is required.");
    }
    const appointmentId = id.trim();
    const existingAppointment = await prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    if (!existingAppointment) {
        throw new Error("Appointment not found.");
    }
    const data = {};
    if (input.patientId !== undefined) {
        data.patientId = input.patientId?.trim() || null;
    }
    if (input.patientName !== undefined) {
        const patientName = input.patientName.trim();
        if (!patientName) {
            throw new Error("Patient name cannot be empty.");
        }
        data.patientName = patientName;
    }
    if (input.patientPhone !== undefined) {
        const patientPhone = input.patientPhone.trim();
        if (!patientPhone) {
            throw new Error("Patient phone number cannot be empty.");
        }
        data.patientPhone = patientPhone;
    }
    if (input.patientEmail !== undefined) {
        data.patientEmail = input.patientEmail.trim() || null;
    }
    if (input.doctorId !== undefined) {
        data.doctorId = input.doctorId?.trim() || null;
    }
    if (input.department !== undefined) {
        data.department = input.department.trim() || null;
    }
    if (input.service !== undefined) {
        data.service = input.service.trim() || null;
    }
    if (input.appointmentDate !== undefined) {
        const appointmentDate = new Date(input.appointmentDate);
        if (Number.isNaN(appointmentDate.getTime())) {
            throw new Error("Invalid appointment date.");
        }
        data.appointmentDate = appointmentDate;
    }
    if (input.appointmentTime !== undefined) {
        data.appointmentTime = input.appointmentTime.trim() || null;
    }
    if (input.reason !== undefined) {
        data.reason = input.reason.trim() || null;
    }
    if (input.notes !== undefined) {
        data.notes = input.notes.trim() || null;
    }
    if (input.priority !== undefined) {
        data.priority = input.priority;
    }
    if (input.status !== undefined) {
        data.status = input.status;
    }
    /**
     * Prevent an empty update from unnecessarily
     * attempting a database update.
     */
    if (Object.keys(data).length === 0) {
        return existingAppointment;
    }
    return prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data,
    });
};
/**
 * Delete an appointment
 *
 * Permanently removes the appointment from PostgreSQL.
 */
export const deleteAppointment = async (id) => {
    if (!id?.trim()) {
        throw new Error("Appointment ID is required.");
    }
    const appointmentId = id.trim();
    const existingAppointment = await prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    if (!existingAppointment) {
        throw new Error("Appointment not found.");
    }
    return prisma.appointment.delete({
        where: {
            id: appointmentId,
        },
    });
};
