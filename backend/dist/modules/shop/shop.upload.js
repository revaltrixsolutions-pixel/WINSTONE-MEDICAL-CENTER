import multer from "multer";
import fs from "fs";
import path from "path";
import { shopUploadsDirectory } from "../../config/uploads.js";
fs.mkdirSync(shopUploadsDirectory, { recursive: true });
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];
const fileFilter = (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed."));
    }
};
export const shopUpload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, callback) => {
            callback(null, shopUploadsDirectory);
        },
        filename: (_req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const baseName = path
                .basename(file.originalname, extension)
                .replace(/[^a-zA-Z0-9_-]/g, "-")
                .slice(0, 60);
            callback(null, `product-${Date.now()}-${Math.round(Math.random() * 1_000_000)}-${baseName}${extension}`);
        },
    }),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
