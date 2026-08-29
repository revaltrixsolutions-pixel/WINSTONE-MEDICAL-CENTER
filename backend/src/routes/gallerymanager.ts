import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

/* =========================================================
   TYPES
   ========================================================= */

type GalleryType = "image" | "video" | "embed";

/* =========================================================
   UPLOAD DIRECTORY
   ========================================================= */

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "gallery",
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/* =========================================================
   MULTER
   ========================================================= */

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase();

    const uniqueName = `${Date.now()}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];

    if (
      allowedImages.includes(file.mimetype) ||
      allowedVideos.includes(file.mimetype)
    ) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Unsupported file type. Use JPG, PNG, WEBP, GIF, MP4, WEBM or OGG.",
      ),
    );
  },
});

/* =========================================================
   HELPERS
   ========================================================= */

function normalizeType(value: unknown): GalleryType {
  if (
    value === "image" ||
    value === "video" ||
    value === "embed"
  ) {
    return value;
  }

  return "image";
}

function normalizeBoolean(
  value: unknown,
  defaultValue = true,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return defaultValue;
}

function normalizeYouTubeUrl(value: string): string {
  const input = value.trim();

  if (!input) {
    return input;
  }

  try {
    const parsed = new URL(input);
    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return input;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname
          .split("/shorts/")[1]
          ?.split("/")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }

    if (hostname === "youtu.be") {
      const videoId = parsed.pathname
        .replace(/^\/+/, "")
        .split("/")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {
    // Keep original URL.
  }

  return input;
}

function getPublicFileUrl(
  req: Request,
  filename: string,
): string {
  const forwardedProto = req.headers["x-forwarded-proto"];

  const protocol =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0].trim()
      : req.protocol;

  const host = req.get("host");

  return `${protocol}://${host}/uploads/gallery/${encodeURIComponent(
    filename,
  )}`;
}

function deletePhysicalFile(
  fileUrl: string | null | undefined,
): void {
  if (!fileUrl) {
    return;
  }

  try {
    const parsed = new URL(fileUrl);

    const pathname = decodeURIComponent(
      parsed.pathname,
    );

    if (
      !pathname.startsWith(
        "/uploads/gallery/",
      )
    ) {
      return;
    }

    const filename = path.basename(pathname);

    const fullPath = path.join(
      uploadDirectory,
      filename,
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "Failed to delete gallery file:",
      error,
    );
  }
}

/* =========================================================
   GET ALL GALLERY ITEMS

   GET /api/gallery
   GET /api/gallery?active=true
   ========================================================= */

router.get(
  "/",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const activeFilter = req.query.active;

      const where =
        activeFilter === "true"
          ? {
              isActive: true,
            }
          : {};

      const items =
        await prisma.galleryItem.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      console.error(
        "GET /api/gallery failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load gallery items.",
      });
    }
  },
);

/* =========================================================
   GET ONE

   GET /api/gallery/:id
   ========================================================= */

router.get(
  "/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      const item =
        await prisma.galleryItem.findUnique({
          where: {
            id,
          },
        });

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      return res.status(200).json({
        success: true,
        item,
      });
    } catch (error) {
      console.error(
        "GET gallery item failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load gallery item.",
      });
    }
  },
);

/* =========================================================
   CREATE GALLERY ITEM

   POST /api/gallery
   ========================================================= */

router.post(
  "/",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        title,
        description,
        type,
        url,
        isActive,
      } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required.",
        });
      }

      if (
        typeof url !== "string" ||
        !url.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery URL is required.",
        });
      }

      const galleryType =
        normalizeType(type);

      const galleryUrl =
        galleryType === "embed"
          ? normalizeYouTubeUrl(url)
          : url.trim();

      const item =
        await prisma.galleryItem.create({
          data: {
            title: title.trim(),

            description:
              typeof description === "string" &&
              description.trim()
                ? description.trim()
                : null,

            type: galleryType,

            url: galleryUrl,

            isActive: normalizeBoolean(
              isActive,
              true,
            ),
          },
        });

      return res.status(201).json({
        success: true,
        message:
          "Gallery item created successfully.",
        item,
      });
    } catch (error) {
      console.error(
        "POST /api/gallery failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create gallery item.",
      });
    }
  },
);

/* =========================================================
   UPLOAD FILE

   POST /api/gallery/upload
   ========================================================= */

router.post(
  "/upload",
  upload.single("file"),
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "No gallery file was uploaded.",
        });
      }

      const {
        title,
        description,
        type,
        isActive,
      } = req.body;

      const detectedType: GalleryType =
        type === "embed"
          ? "embed"
          : req.file.mimetype.startsWith(
                "video/",
              )
            ? "video"
            : "image";

      const fileUrl =
        getPublicFileUrl(
          req,
          req.file.filename,
        );

      const item =
        await prisma.galleryItem.create({
          data: {
            title:
              typeof title === "string" &&
              title.trim()
                ? title.trim()
                : req.file.originalname,

            description:
              typeof description ===
                "string" &&
              description.trim()
                ? description.trim()
                : null,

            type: detectedType,

            url: fileUrl,

            isActive: normalizeBoolean(
              isActive,
              true,
            ),
          },
        });

      return res.status(201).json({
        success: true,
        message:
          "Gallery file uploaded and saved successfully.",
        item,
      });
    } catch (error) {
      if (req.file) {
        try {
          const uploadedFile =
            path.join(
              uploadDirectory,
              req.file.filename,
            );

          if (
            fs.existsSync(uploadedFile)
          ) {
            fs.unlinkSync(uploadedFile);
          }
        } catch {
          // Ignore cleanup failure.
        }
      }

      console.error(
        "POST /api/gallery/upload failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload gallery file.",
      });
    }
  },
);

/* =========================================================
   UPDATE GALLERY ITEM

   PATCH /api/gallery/:id
   ========================================================= */

router.patch(
  "/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      const existing =
        await prisma.galleryItem.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      const {
        title,
        description,
        type,
        url,
        isActive,
      } = req.body;

      const data: {
        title?: string;
        description?: string | null;
        type?: GalleryType;
        url?: string;
        isActive?: boolean;
      } = {};

      if (typeof title === "string") {
        if (!title.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Gallery title cannot be empty.",
          });
        }

        data.title = title.trim();
      }

      if (description === null) {
        data.description = null;
      } else if (
        typeof description === "string"
      ) {
        data.description =
          description.trim() || null;
      }

      if (type !== undefined) {
        data.type = normalizeType(type);
      }

      if (typeof url === "string") {
        if (!url.trim()) {
          return res.status(400).json({
            success: false,
            message:
              "Gallery URL cannot be empty.",
          });
        }

        const nextType =
          data.type || existing.type;

        data.url =
          nextType === "embed"
            ? normalizeYouTubeUrl(url)
            : url.trim();
      }

      if (isActive !== undefined) {
        data.isActive =
          normalizeBoolean(
            isActive,
            existing.isActive,
          );
      }

      const item =
        await prisma.galleryItem.update({
          where: {
            id,
          },
          data,
        });

      return res.status(200).json({
        success: true,
        message:
          "Gallery item updated successfully.",
        item,
      });
    } catch (error) {
      console.error(
        "PATCH /api/gallery/:id failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update gallery item.",
      });
    }
  },
);

/* =========================================================
   DELETE GALLERY ITEM

   DELETE /api/gallery/:id
   ========================================================= */

router.delete(
  "/:id",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      const existing =
        await prisma.galleryItem.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found.",
        });
      }

      await prisma.galleryItem.delete({
        where: {
          id,
        },
      });

      deletePhysicalFile(existing.url);

      return res.status(200).json({
        success: true,
        message:
          "Gallery item deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE /api/gallery/:id failed:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete gallery item.",
      });
    }
  },
);

/* =========================================================
   ERROR HANDLER FOR MULTER
   ========================================================= */

router.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: unknown,
  ) => {
    console.error(
      "Gallery route error:",
      error,
    );

    if (
      error instanceof multer.MulterError
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Gallery request failed.",
    });
  },
);

export default router;