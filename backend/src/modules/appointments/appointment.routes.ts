import { Router } from "express";

import {
createAppointment,
getAppointments,
getAppointment,
updateAppointment,
deleteAppointment,
} from "./appointment.controller.js";

const router = Router();

/**

* POST /api/appointments
* Create a new appointment
  */
  router.post("/", createAppointment);

/**

* GET /api/appointments
* Get all appointments
  */
  router.get("/", getAppointments);

/**

* GET /api/appointments/:id
* Get a single appointment
  */
  router.get("/:id", getAppointment);

/**

* PUT /api/appointments/:id
* Update an appointment
  */
  router.put("/:id", updateAppointment);

/**

* PATCH /api/appointments/:id
* Partially update an appointment.
*
* This is required by the admin dashboard for changing
* appointment status without replacing the entire record.
  */
  router.patch("/:id", updateAppointment);

/**

* DELETE /api/appointments/:id
* Delete an appointment
  */
  router.delete("/:id", deleteAppointment);

export default router;
