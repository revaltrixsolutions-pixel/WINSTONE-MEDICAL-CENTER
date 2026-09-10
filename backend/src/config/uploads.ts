import path from "path";
import { fileURLToPath } from "url";

const sourceDirectory = path.dirname(
  fileURLToPath(import.meta.url)
);

export const uploadsDirectory = path.resolve(
  sourceDirectory,
  "../../uploads"
);

export const shopUploadsDirectory = path.join(
  uploadsDirectory,
  "shop"
);
