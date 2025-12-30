// src/Route/Detail4Route.ts
import express from "express";

import {
  addPODetail4Data,
  deletePODetail4ById,
  getAllPODetail4,
  getPODetail4ById,
  updatePODetail4ById
} from "../Controller/Detail4.js";
import { upload } from "../Middleware/upload.js";

const Detail4Route = express.Router();

/* 🔴 FIX HERE */
Detail4Route.post(
  "/po-details4",
  upload.single("file"),   // must match form-data key
  addPODetail4Data
);

Detail4Route.get("/po-details4", getAllPODetail4);
Detail4Route.get("/po-details4/:id", getPODetail4ById);
Detail4Route.put("/po-details4/:id", updatePODetail4ById);
Detail4Route.delete("/po-details4/:id", deletePODetail4ById);

export default Detail4Route;
