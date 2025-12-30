import express from "express";
import {addPOHeaderData, deletePOHeaderByRefNo, getAllPOHeaders, getPOHeaderByRefNo, updatePOHeaderByRefNo} from "../Controller/Header.js"

const POHeaderRoute = express.Router();

POHeaderRoute.post("/po-headers", addPOHeaderData);
POHeaderRoute.get("/po-headers", getAllPOHeaders);
POHeaderRoute.get("/po-headers/:po_ref_no", getPOHeaderByRefNo);
POHeaderRoute.put("/po-headers/:po_ref_no", updatePOHeaderByRefNo);
POHeaderRoute.delete("/po-headers/:po_ref_no", deletePOHeaderByRefNo);
export default POHeaderRoute;