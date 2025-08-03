import multer from "multer";
import multerS3 from "multer-s3";
import { initializeAWS, s3 } from "./aws";

import dotenv from "dotenv";
dotenv.config();

let upload: multer.Multer;

function initializeMulter() {
  initializeAWS();
  upload = multer({
    storage: multerS3({
      s3,
      cacheControl: "max-age=31536000",
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      contentDisposition: "inline",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function generateUniqueFileName(_, file, cb) {
        const uniqueFileName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueFileName);
      },
    }),
  });
}

initializeMulter();
export { upload, initializeMulter };
