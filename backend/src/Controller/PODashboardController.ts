import type { Request, Response } from "express";

export const getPODashboard = async (req: Request, res: Response) => {

    const po_ref_no= req.params.po_ref_no;
    /**
     * Supplier_id,
     * Supplier_name:created_by,
     * PO_date,
     * PO_status,
     * Total_amount,
     * Items_ordered,
     * Items_received,
     * Delivery_schedule,
     * Payment_terms,
     * Contact_person
     */
    // const Header:

    
};