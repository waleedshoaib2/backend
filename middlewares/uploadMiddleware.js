import multer from "multer";
import path from "path";

// Multer Storage Configuration (Customize as needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

export default upload;
