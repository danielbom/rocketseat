import Crypto from "crypto";
import Multer from "multer";
import Path from "path";

export default {
  storage: Multer.diskStorage({
    destination: Path.resolve(__dirname, "..", "..", "uploads", "points"),
    filename(req, file, callback) {
      try {
        const hash = Crypto.randomBytes(6).toString("hex");

        const filename = `${hash}-${file.originalname}`;

        callback(null, filename);
      } catch (err) {
        callback(err, "");
      }
    }
  })
};
