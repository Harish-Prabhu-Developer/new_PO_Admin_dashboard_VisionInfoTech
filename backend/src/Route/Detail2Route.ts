import express from "express";
import { addPODetail2Data, deletePODetail2ById, getAdditionalCostsByRefNo, getAllPODetail2s, getPODetail2ById, updatePODetail2ById } from "../Controller/Detail2.js";


const Detail2Route = express.Router();
Detail2Route.post("/po-details2",addPODetail2Data );
Detail2Route.get("/po-details2",getAllPODetail2s );
Detail2Route.get("/po-details2/ref/:po_ref_no",getAdditionalCostsByRefNo );
Detail2Route.get("/po-details2/:id",getPODetail2ById );
Detail2Route.put("/po-details2/:id",updatePODetail2ById );
Detail2Route.delete("/po-details2/:id",deletePODetail2ById );
export default Detail2Route;    