// backend/routes/servicesmanager.ts

import { PrismaClient } from "../../generated/prisma/index.js";
import { Router, type Request, type Response } from "express";

const router = Router();
const prisma = new PrismaClient();

type ServiceRequestBody = {
  name?: unknown;
  shortDescription?: unknown;
  description?: unknown;
  icon?: unknown;
  imageUrls?: unknown;
  active?: unknown;
};

type ServicePayload = {
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected server error occurred.";
}

function normalizeImageUrls(imageUrls: unknown): string[] {
  if (!Array.isArray(imageUrls)) {
    return [];
  }

  return imageUrls
    .filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    )
    .map((image) => image.trim())
    .slice(0, 5);
}

function validateServicePayload(
  body: ServiceRequestBody,
):
  | { valid: true; data: ServicePayload }
  | { valid: false; message: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const shortDescription =
    typeof body.shortDescription === "string"
      ? body.shortDescription.trim()
      : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const icon =
    typeof body.icon === "string" && body.icon.trim()
      ? body.icon.trim()
      : "Stethoscope";

  const imageUrls = normalizeImageUrls(body.imageUrls);

  if (!name) {
    return {
      valid: false,
      message: "Service name is required.",
    };
  }

  if (name.length > 150) {
    return {
      valid: false,
      message: "Service name must not exceed 150 characters.",
    };
  }

  if (!shortDescription) {
    return {
      valid: false,
      message: "Short description is required.",
    };
  }

  if (shortDescription.length > 500) {
    return {
      valid: false,
      message: "Short description must not exceed 500 characters.",
    };
  }

  if (!description) {
    return {
      valid: false,
      message: "Detailed description is required.",
    };
  }

  if (description.length > 10000) {
    return {
      valid: false,
      message: "Detailed description must not exceed 10,000 characters.",
    };
  }

  return {
    valid: true,
    data: {
      name,
      shortDescription,
      description,
      icon,
      imageUrls,
    },
  };
}

function formatService(service: {
  id: string;
  name: string;
  shortDescription: string | null;
  description: string;
  icon: string;
  imageUrl?: string | null;
  imageUrls: unknown;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const normalizedImageUrls = normalizeImageUrls(service.imageUrls);
  const imageUrls =
    normalizedImageUrls.length > 0
      ? normalizedImageUrls
      : typeof service.imageUrl === "string" && service.imageUrl.trim()
        ? [service.imageUrl.trim()]
        : [];

  return {
    id: service.id,
    name: service.name,
    shortDescription: service.shortDescription ?? "",
    description: service.description,
    icon: service.icon,
    imageUrls,
    imageUrl: imageUrls[0] || "",
    active: service.active,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

/*
  GET /api/services
  GET /api/services?active=true
*/
router.get("/", async (req: Request, res: Response) => {
  try {
    const activeQuery = String(req.query.active || "").toLowerCase();

    const activeOnly =
      activeQuery === "true" ||
      activeQuery === "1" ||
      activeQuery === "yes";

    const services = await prisma.medicalService.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(services.map(formatService));
  } catch (error) {
    console.error("GET /api/services failed:", error);

    return res.status(500).json({
      message: "Failed to load medical services from the database.",
      error: getErrorMessage(error),
    });
  }
});

/*
  GET /api/services/:id
*/
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.medicalService.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({
        message: "Medical service not found.",
      });
    }

    return res.status(200).json(formatService(service));
  } catch (error) {
    console.error(`GET /api/services/${req.params.id} failed:`, error);

    return res.status(500).json({
      message: "Failed to load the medical service.",
      error: getErrorMessage(error),
    });
  }
});

/*
  POST /api/services
*/
router.post("/", async (req: Request, res: Response) => {
  try {
    const validation = validateServicePayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const existingService = await prisma.medicalService.findFirst({
      where: {
        name: {
          equals: validation.data.name,
          mode: "insensitive",
        },
      },
    });

    if (existingService) {
      return res.status(409).json({
        message: "A medical service with this name already exists.",
      });
    }

    const service = await prisma.medicalService.create({
      data: {
        name: validation.data.name,
        shortDescription: validation.data.shortDescription,
        description: validation.data.description,
        icon: validation.data.icon,
        imageUrls: validation.data.imageUrls,
        active: true,
      },
    });

    return res.status(201).json(formatService(service));
  } catch (error) {
    console.error("POST /api/services failed:", error);

    return res.status(500).json({
      message: "Failed to save medical service to the database.",
      error: getErrorMessage(error),
    });
  }
});

/*
  PUT /api/services/:id
*/
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = validateServicePayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const existingService = await prisma.medicalService.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Medical service not found.",
      });
    }

    const duplicateService = await prisma.medicalService.findFirst({
      where: {
        id: {
          not: id,
        },
        name: {
          equals: validation.data.name,
          mode: "insensitive",
        },
      },
    });

    if (duplicateService) {
      return res.status(409).json({
        message: "Another medical service already uses this name.",
      });
    }

    const service = await prisma.medicalService.update({
      where: { id },
      data: {
        name: validation.data.name,
        shortDescription: validation.data.shortDescription,
        description: validation.data.description,
        icon: validation.data.icon,
        imageUrls: validation.data.imageUrls,
      },
    });

    return res.status(200).json(formatService(service));
  } catch (error) {
    console.error(`PUT /api/services/${req.params.id} failed:`, error);

    return res.status(500).json({
      message: "Failed to update medical service in the database.",
      error: getErrorMessage(error),
    });
  }
});

/*
  PATCH /api/services/:id/visibility
  Body: { active: true | false }
*/
router.patch("/:id/visibility", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { active } = req.body as ServiceRequestBody;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "The active field must be true or false.",
      });
    }

    const existingService = await prisma.medicalService.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Medical service not found.",
      });
    }

    const service = await prisma.medicalService.update({
      where: { id },
      data: { active },
    });

    return res.status(200).json(formatService(service));
  } catch (error) {
    console.error(
      `PATCH /api/services/${req.params.id}/visibility failed:`,
      error,
    );

    return res.status(500).json({
      message: "Failed to update medical service visibility.",
      error: getErrorMessage(error),
    });
  }
});

/*
  DELETE /api/services/:id
*/
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingService = await prisma.medicalService.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Medical service not found.",
      });
    }

    await prisma.medicalService.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Medical service deleted successfully.",
    });
  } catch (error) {
    console.error(`DELETE /api/services/${req.params.id} failed:`, error);

    return res.status(500).json({
      message: "Failed to delete medical service from the database.",
      error: getErrorMessage(error),
    });
  }
});

export default router;


// Render services route deployment

