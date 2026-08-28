import type { Request, Response } from "express";

import {
createAppointment as createAppointmentService,
getAppointments as getAppointmentsService,
getAppointmentById,
updateAppointment as updateAppointmentService,
deleteAppointment as deleteAppointmentService,
} from "./appointment.service.js";

import type {
CreateAppointmentInput,
UpdateAppointmentInput,
} from "./appointment.types.js";

/**

* POST /api/appointments
*
* Create a new appointment.
  */
  export const createAppointment = async (
  req: Request,
  res: Response
  ): Promise<Response> => {
  try {
  const body = req.body as CreateAppointmentInput;

  if (!body.patientName?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Patient name is required.",
  });
  }

  if (!body.patientPhone?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Patient phone number is required.",
  });
  }

  if (!body.appointmentDate?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Appointment date is required.",
  });
  }

  const appointment = await createAppointmentService(body);

  return res.status(201).json({
  success: true,
  message: "Appointment created successfully.",
  appointment,
  data: appointment,
  });
  } catch (error) {
  console.error("Create appointment error:", error);

  return res.status(500).json({
  success: false,
  message:
  error instanceof Error
  ? error.message
  : "Failed to create appointment.",
  });
  }
  };

/**

* GET /api/appointments
*
* Get all appointments.
  */
  export const getAppointments = async (
  _req: Request,
  res: Response
  ): Promise<Response> => {
  try {
  const appointments = await getAppointmentsService();

  return res.status(200).json({
  success: true,
  appointments,
  data: appointments,
  });
  } catch (error) {
  console.error("Get appointments error:", error);

  return res.status(500).json({
  success: false,
  message:
  error instanceof Error
  ? error.message
  : "Failed to retrieve appointments.",
  });
  }
  };

/**

* GET /api/appointments/:id
*
* Get one appointment.
  */
  export const getAppointment = async (
  req: Request,
  res: Response
  ): Promise<Response> => {
  try {
  const { id } = req.params;

  if (!id?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Appointment ID is required.",
  });
  }

  const appointment = await getAppointmentById(id);

  if (!appointment) {
  return res.status(404).json({
  success: false,
  message: "Appointment not found.",
  });
  }

  return res.status(200).json({
  success: true,
  appointment,
  data: appointment,
  });
  } catch (error) {
  console.error("Get appointment error:", error);

  return res.status(500).json({
  success: false,
  message:
  error instanceof Error
  ? error.message
  : "Failed to retrieve appointment.",
  });
  }
  };

/**

* PUT /api/appointments/:id
* PATCH /api/appointments/:id
*
* Update an appointment.
*
* PATCH is intentionally supported because the admin frontend
* uses PATCH when changing appointment status.
  */
  export const updateAppointment = async (
  req: Request,
  res: Response
  ): Promise<Response> => {
  try {
  const { id } = req.params;

  if (!id?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Appointment ID is required.",
  });
  }

  const body = req.body as UpdateAppointmentInput;

  if (!body || typeof body !== "object") {
  return res.status(400).json({
  success: false,
  message: "Appointment update data is required.",
  });
  }

  const existingAppointment = await getAppointmentById(id);

  if (!existingAppointment) {
  return res.status(404).json({
  success: false,
  message: "Appointment not found.",
  });
  }

  const appointment = await updateAppointmentService(id, body);

  return res.status(200).json({
  success: true,
  message: "Appointment updated successfully.",
  appointment,
  data: appointment,
  });
  } catch (error) {
  console.error("Update appointment error:", error);

  if (
  error instanceof Error &&
  (
  error.message.toLowerCase().includes("not found") ||
  error.message.toLowerCase().includes("record to update")
  )
  ) {
  return res.status(404).json({
  success: false,
  message: "Appointment not found.",
  });
  }

  return res.status(500).json({
  success: false,
  message:
  error instanceof Error
  ? error.message
  : "Failed to update appointment.",
  });
  }
  };

/**

* DELETE /api/appointments/:id
*
* Delete an appointment.
  */
  export const deleteAppointment = async (
  req: Request,
  res: Response
  ): Promise<Response> => {
  try {
  const { id } = req.params;

  if (!id?.trim()) {
  return res.status(400).json({
  success: false,
  message: "Appointment ID is required.",
  });
  }

  const existingAppointment = await getAppointmentById(id);

  if (!existingAppointment) {
  return res.status(404).json({
  success: false,
  message: "Appointment not found.",
  });
  }

  await deleteAppointmentService(id);

  return res.status(200).json({
  success: true,
  message: "Appointment deleted successfully.",
  });
  } catch (error) {
  console.error("Delete appointment error:", error);

  if (
  error instanceof Error &&
  (
  error.message.toLowerCase().includes("not found") ||
  error.message.toLowerCase().includes("record to delete")
  )
  ) {
  return res.status(404).json({
  success: false,
  message: "Appointment not found.",
  });
  }

  return res.status(500).json({
  success: false,
  message:
  error instanceof Error
  ? error.message
  : "Failed to delete appointment.",
  });
  }
  };
