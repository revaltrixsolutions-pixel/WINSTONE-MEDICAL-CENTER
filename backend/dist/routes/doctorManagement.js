import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const router = Router();
/* =========================================================
   IMAGE UPLOAD CONFIGURATION
========================================================= */
const uploadsDirectory = path.resolve(process.cwd(), "uploads", "doctors");
if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDirectory);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const safeName = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .substring(0, 50);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}-${safeName}${extension}`;
        cb(null, uniqueName);
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPG, JPEG, PNG, and WebP images are allowed."));
        }
        cb(null, true);
    },
});
/* =========================================================
   DOCTORS CRUD
========================================================= */
/* GET ALL DOCTORS */
router.get("/", async (_req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(doctors);
    }
    catch (error) {
        console.error("Failed to fetch doctors:", error);
        res.status(500).json({
            error: "Failed to fetch doctors",
        });
    }
});
/* =========================================================
   UPLOAD DOCTOR IMAGE

   POST:
   /api/admin/doctors/upload-image

   multipart/form-data
   field:
   image
========================================================= */
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No image file was uploaded.",
            });
        }
        /*
         * Because Express is serving /uploads as a static directory,
         * the frontend will receive a URL such as:
         *
         * /uploads/doctors/123456789-doctor.jpg
         */
        const imageUrl = `/uploads/doctors/${req.file.filename}`;
        console.log("Doctor image uploaded:", imageUrl);
        return res.status(201).json({
            success: true,
            url: imageUrl,
            imageUrl,
        });
    }
    catch (error) {
        console.error("Doctor image upload error:", error);
        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Failed to upload doctor image.",
        });
    }
});
/* =========================================================
   CREATE DOCTOR
========================================================= */
router.post("/", async (req, res) => {
    try {
        const { name, specialization, qualification, phone, email, bio, imageUrls, active, } = req.body;
        if (!name || !specialization || !phone || !email) {
            return res.status(400).json({
                error: "Name, specialization, phone, and email are required.",
            });
        }
        const newDoctor = await prisma.doctor.create({
            data: {
                name,
                specialization,
                qualification: qualification || "",
                phone,
                email,
                bio: bio || "",
                imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
                active: active !== false,
            },
        });
        return res.status(201).json(newDoctor);
    }
    catch (error) {
        console.error("Failed to create doctor:", error);
        return res.status(500).json({
            error: "Failed to create doctor",
        });
    }
});
/* =========================================================
   UPDATE DOCTOR
========================================================= */
router.put("/:id", async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, specialization, qualification, phone, email, bio, imageUrls, active, } = req.body;
        const updated = await prisma.doctor.update({
            where: {
                id,
            },
            data: {
                ...(name !== undefined && {
                    name,
                }),
                ...(specialization !== undefined && {
                    specialization,
                }),
                ...(qualification !== undefined && {
                    qualification,
                }),
                ...(phone !== undefined && {
                    phone,
                }),
                ...(email !== undefined && {
                    email,
                }),
                ...(bio !== undefined && {
                    bio,
                }),
                ...(imageUrls !== undefined && {
                    imageUrls: Array.isArray(imageUrls)
                        ? imageUrls
                        : [],
                }),
                ...(active !== undefined && {
                    active: Boolean(active),
                }),
            },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error("Failed to update doctor:", error);
        return res.status(500).json({
            error: "Failed to update doctor",
        });
    }
});
/* =========================================================
   DELETE DOCTOR
========================================================= */
router.delete("/:id", async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma.doctor.delete({
            where: {
                id,
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Failed to delete doctor:", error);
        return res.status(500).json({
            error: "Failed to delete doctor",
        });
    }
});
/* =========================================================
   PATIENT MESSAGES
========================================================= */
/* GET MESSAGES */
router.get("/messages", async (_req, res) => {
    try {
        const messages = await prisma.patientMessage.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(messages);
    }
    catch (error) {
        console.error("Failed to fetch patient messages:", error);
        return res.status(500).json({
            error: "Failed to fetch patient messages",
        });
    }
});
/* DELETE MESSAGE */
router.delete("/messages/:id", async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma.patientMessage.delete({
            where: {
                id,
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Failed to delete message:", error);
        return res.status(500).json({
            error: "Failed to delete message",
        });
    }
});
/* =========================================================
   DOCTOR RATINGS
========================================================= */
/* GET RATINGS */
router.get("/ratings", async (_req, res) => {
    try {
        const ratings = await prisma.doctorRating.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(ratings);
    }
    catch (error) {
        console.error("Failed to fetch ratings:", error);
        return res.status(500).json({
            error: "Failed to fetch ratings",
        });
    }
});
/* =========================================================
   APPOINTMENTS
========================================================= */
/* GET APPOINTMENTS */
router.get("/appointments", async (_req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(appointments);
    }
    catch (error) {
        console.error("Failed to fetch appointments:", error);
        return res.status(500).json({
            error: "Failed to fetch appointments",
        });
    }
});
/* UPDATE APPOINTMENT STATUS */
router.patch("/appointments/:id/status", async (req, res) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body;
        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Cancelled",
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: "Invalid appointment status. Use Pending, Confirmed, or Cancelled.",
            });
        }
        const updated = await prisma.appointment.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error("Failed to update appointment status:", error);
        return res.status(500).json({
            error: "Failed to update appointment status",
        });
    }
});
/* =========================================================
   MULTER ERROR HANDLER
========================================================= */
router.use((error, _req, res, _next) => {
    console.error("Doctor route error:", error);
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                error: "Image must be smaller than 5MB.",
            });
        }
        return res.status(400).json({
            error: error.message,
        });
    }
    if (error instanceof Error) {
        return res.status(400).json({
            error: error.message,
        });
    }
    return res.status(500).json({
        error: "Unexpected doctor route error.",
    });
});
export default router;
