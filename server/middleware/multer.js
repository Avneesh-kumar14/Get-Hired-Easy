import multer from "multer";

const storage = multer.memoryStorage();

// Allowed MIME types for resume uploads
const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Allowed MIME types for images
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// File size limits (in bytes)
const MAX_RESUME_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * File filter for resume uploads
 * Only allows PDF and DOCX files
 */
const resumeFileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only PDF and DOCX files are allowed."
      ),
      false
    );
  }

  // Check file size
  if (file.size > MAX_RESUME_SIZE) {
    return cb(
      new Error(`File size exceeds maximum limit of 2MB.`),
      false
    );
  }

  cb(null, true);
};

/**
 * File filter for image uploads
 */
const imageFileFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid image type"), false);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return cb(
      new Error(`Image size exceeds maximum limit of 5MB.`),
      false
    );
  }

  cb(null, true);
};

/**
 * File filter for profile updates (both resume and profile image)
 */
const profileUpdateFileFilter = (req, file, cb) => {
  // Allow both resume and image files
  const allowedTypes = [...ALLOWED_RESUME_TYPES, ...ALLOWED_IMAGE_TYPES];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Only PDF, DOCX, JPEG, PNG, and GIF files are allowed."
      ),
      false
    );
  }

  // Check file size based on type
  const isResume = ALLOWED_RESUME_TYPES.includes(file.mimetype);
  const maxSize = isResume ? MAX_RESUME_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    const limit = isResume ? "2MB" : "5MB";
    return cb(
      new Error(`File size exceeds maximum limit of ${limit}.`),
      false
    );
  }

  cb(null, true);
};

// Resume upload with validation
export const singleUpload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: MAX_RESUME_SIZE,
  },
}).single("file");

// Multiple uploads with validation
export const multipleUpload = multer({
  storage,
  fileFilter: profileUpdateFileFilter,
  limits: {
    fileSize: Math.max(MAX_RESUME_SIZE, MAX_IMAGE_SIZE),
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

export const multipleAttachmentUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array("attachments", 5);
