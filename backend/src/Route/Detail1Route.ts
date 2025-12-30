import express from "express";
import { addPODetail1Data, deletePODetail1ById, getAllPODetail1s, getPODetail1ById, getPODetailsByRefNo, updatePODetail1ById } from "../Controller/Detail1.js";


const Detail1Route = express.Router();

Detail1Route.post("/po-details1",addPODetail1Data );
Detail1Route.get("/po-details1",getAllPODetail1s );
Detail1Route.get("/po-details1/ref/:po_ref_no",getPODetailsByRefNo );
Detail1Route.get("/po-details1/:id",getPODetail1ById );
Detail1Route.put("/po-details1/:id",updatePODetail1ById);
Detail1Route.delete("/po-details1/:id",deletePODetail1ById);
export default Detail1Route;