import multer from "multer";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP and GIF images are allowed."
      )
    );
  }
};

export const shopUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});