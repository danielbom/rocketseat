import { wrap } from "./lib/wrap-errors";
import { Router } from "express";

import multer from "multer";
import multerConfig from "./multer/points";

import pointsController from "./controllers/points";
import itemsController from "./controllers/items";

import pointsValidation from "./validations/points";

import graphql from "./graphql/with-builder";

const router = Router();
const uploader = multer(multerConfig);

router.use("/graphql", graphql);

router.get("/items", wrap(itemsController.index));

router.get("/points", pointsValidation.index, wrap(pointsController.index));
router.get("/points/:id", wrap(pointsController.show));
router.post("/points", pointsValidation.store, uploader.single("image"), wrap(pointsController.store));
router.delete("/points/:id", pointsValidation.delete, wrap(pointsController.delete));

router.post("/points/:id/image", uploader.single("image"), wrap(pointsController.image));

export default router;
