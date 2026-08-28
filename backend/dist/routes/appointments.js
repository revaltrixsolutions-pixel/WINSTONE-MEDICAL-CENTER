import { Router } from "express";
import { createAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, } from "../modules/appointments/appointment.controller.js";
const router = Router();
/**

* POST /api/appointments
* Create appointment in PostgreSQL.
  */
router.post("/", createAppointment);
/**

* GET /api/appointments
* Get all appointments from PostgreSQL.
  */
router.get("/", getAppointments);
/**

* GET /api/appointments/:id
* Get one appointment from PostgreSQL.
  */
router.get("/:id", getAppointment);
/**

* PUT /api/appointments/:id
* Update an appointment in PostgreSQL.
  */
router.put("/:id", updateAppointment);
/**

* PATCH /api/appointments/:id
* Partial update — required by the admin dashboard
* for changing appointment status.
  */
router.patch("/:id", updateAppointment);
/**

* DELETE /api/appointments/:id
* Delete an appointment from PostgreSQL.
  */
router.delete("/:id", deleteAppointment);
export default router;
