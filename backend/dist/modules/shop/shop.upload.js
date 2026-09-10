import multer from "multer";
import path from "path";
import fs from "fs";
import { shopUploadsDirectory } from "../../config/uploads.js";
const uploadsDirectory = shopUploadsDirectory;
if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, {
        recursive: true,
    });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDirectory);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, filename);
    },
});
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
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
