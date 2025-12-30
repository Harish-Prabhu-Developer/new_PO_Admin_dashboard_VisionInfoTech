import express from "express";
import { addPODetail3Data, deletePODetail3ById, getAllPODetail3s, getPODetail3ById, getPODetail3ByRefNo, updatePODetail3ById } from "../Controller/Detail3.js";


const Detail3Route = express.Router();
Detail3Route.post("/po-details3",addPODetail3Data );
Detail3Route.get("/po-details3",getAllPODetail3s );
Detail3Route.get("/po-details3/ref/:po_ref_no",getPODetail3ByRefNo );
Detail3Route.get("/po-details3/:id",getPODetail3ById );
Detail3Route.put("/po-details3/:id",updatePODetail3ById );
Detail3Route.delete("/po-details3/:id",deletePODetail3ById );
export default Detail3Route;