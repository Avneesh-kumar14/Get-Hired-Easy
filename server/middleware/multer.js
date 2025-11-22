import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");

export const multipleUpload = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);
export const multipleAttachmentUpload = multer({ storage }).array(
  "attachments",
  5
);
