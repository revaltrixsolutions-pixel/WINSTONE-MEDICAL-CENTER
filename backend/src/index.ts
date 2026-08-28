import express from "express";
import cors from "cors";
import path from "path";

import doctorManagementRouter from "./routes/doctorManagement.js";
import appointmentsRouter from "./routes/appointments.js";

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* =========================================================
   STATIC UPLOADS
========================================================= */

/*
 * Doctor images are stored in:
 *
 * backend/uploads/doctors
 *
 * They are publicly accessible through:
 *
 * http://localhost:5000/uploads/doctors/filename.jpg
 */

const uploadsDirectory = path.resolve(
  process.cwd(),
  "uploads"
);

app.use(
  "/uploads",
  express.static(uploadsDirectory)
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Winston Medical Centre API is running",
  });
});

/* =========================================================
   DOCTORS
========================================================= */


app.use(
  "/api/doctors",
  doctorManagementRouter
);


app.use(
  "/api/admin/doctors",
  doctorManagementRouter
);

/* =========================================================
   APPOINTMENTS
========================================================= */

app.use(
  "/api/appointments",
  appointmentsRouter
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Global server error:", error);

    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
);

/* =========================================================
   SERVER
========================================================= */

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("==============================================");
  console.log(" Winston Medical Centre Backend");
  console.log("==============================================");
  console.log(` Server running: http://localhost:${PORT}`);
  console.log(` API:            http://localhost:${PORT}/api`);
  console.log(` Health:         http://localhost:${PORT}/api/health`);
  console.log(` Doctors:        http://localhost:${PORT}/api/doctors`);
  console.log(
    ` Admin Doctors:  http://localhost:${PORT}/api/admin/doctors`
  );
  console.log(
    ` Uploads:        http://localhost:${PORT}/uploads`
  );
  console.log("==============================================");
  console.log("");
});