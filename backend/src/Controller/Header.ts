// src/Controller/Header.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * CREATE – Add Purchase Order Header
 */
export const addPOHeaderData = async (req: Request, res: Response) => {
  try {
    const {
      po_ref_no,
      po_date,
      purchase_type,
      company_id,
      supplier_id,
      po_store_id,
      remarks,
      created_by,
      created_mac_address
    } = req.body;

    // Comprehensive validation
    if (!po_ref_no || !po_date || !company_id || !supplier_id || !created_by) {
      return res.status(400).json({
        error: "Missing required fields: po_ref_no, po_date, company_id, supplier_id, created_by"
      });
    }

    // String field validation
    if (typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "po_ref_no must be a non-empty string"
      });
    }

    if (po_ref_no.length > 50) {
      return res.status(400).json({
        error: "po_ref_no must be 50 characters or less"
      });
    }

    // Date validation
    if (isNaN(Date.parse(po_date))) {
      return res.status(400).json({
        error: "po_date must be a valid date"
      });
    }

    // Numeric field validation
    const numericFields = [
      { value: company_id, name: "company_id" },
      { value: supplier_id, name: "supplier_id" },
      { value: po_store_id, name: "po_store_id", optional: true }
    ];

    for (const { value, name, optional } of numericFields) {
      if (value !== undefined && value !== null && value !== '') {
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return res.status(400).json({
            error: `${name} must be a positive number`
          });
        }
      } else if (!optional) {
        return res.status(400).json({
          error: `${name} is required`
        });
      }
    }

    // Optional string field validation with length limits
    const stringFields = [
      { value: purchase_type, name: "purchase_type", maxLength: 20, optional: true },
      { value: created_by, name: "created_by", maxLength: 50 },
      { value: created_mac_address, name: "created_mac_address", maxLength: 50, optional: true },
      { value: remarks, name: "remarks", maxLength: 2000, optional: true }
    ];

    for (const { value, name, maxLength, optional } of stringFields) {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value !== 'string') {
          return res.status(400).json({
            error: `${name} must be a string`
          });
        }
        if (value.length > maxLength) {
          return res.status(400).json({
            error: `${name} must be ${maxLength} characters or less`
          });
        }
      } else if (!optional) {
        return res.status(400).json({
          error: `${name} is required`
        });
      }
    }

    // Sanitize and prepare values
    const sanitizedValues = [
      po_ref_no.trim(),
      po_date,
      purchase_type ? purchase_type.trim() : null,
      Number(company_id),
      Number(supplier_id),
      po_store_id ? Number(po_store_id) : null,
      remarks ? remarks.trim() : null,
      'CREATED', // status_entry
      created_by.trim(),
      new Date(), // created_date
      created_mac_address ? created_mac_address.trim() : null
    ];

    const query = `
      INSERT INTO tbl_purchase_order_hdr (
        po_ref_no,
        po_date,
        purchase_type,
        company_id,
        supplier_id,
        po_store_id,
        remarks,
        status_entry,
        created_by,
        created_date,
        created_mac_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const { rows } = await pool.query(query, sanitizedValues);

    res.status(201).json({
      msg: "Purchase Order Header created successfully",
      data: rows[0]
    });

  } catch (error: any) {
    console.error("PO Header Insert Error:", error);
    
    // Handle specific PostgreSQL errors
    if (error.code === '23505') {
      return res.status(409).json({
        error: "Purchase Order with this reference number already exists"
      });
    }
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Referenced record not found (check company_id, supplier_id, or po_store_id)"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to create PO header",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * READ – Get All PO Headers
 */
export const getAllPOHeaders = async (req: Request, res: Response) => {
  try {
    // Extract and validate query parameters
    const { 
      page = 1, 
      limit = 50, 
      status, 
      supplier_id,
      start_date,
      end_date 
    } = req.query;
    
    // Validate pagination parameters
    const pageNum = Number(page);
    const limitNum = Number(limit);
    
    if (isNaN(pageNum) || pageNum <= 0) {
      return res.status(400).json({
        error: "page must be a positive number"
      });
    }
    
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 1000) {
      return res.status(400).json({
        error: "limit must be between 1 and 1000"
      });
    }
    
    const offset = (pageNum - 1) * limitNum;
    
    // Build query dynamically with parameterized values
    let query = `
      SELECT *
      FROM tbl_purchase_order_hdr
      WHERE 1=1
    `;
    
    const values: any[] = [];
    let paramCounter = 1;
    
    // Add filters with parameterized queries
    if (status) {
      if (typeof status !== 'string' || status.length > 20) {
        return res.status(400).json({
          error: "status must be a string with max 20 characters"
        });
      }
      query += ` AND status_entry = $${paramCounter}`;
      values.push(status.trim());
      paramCounter++;
    }
    
    if (supplier_id) {
      if (isNaN(Number(supplier_id)) || Number(supplier_id) <= 0) {
        return res.status(400).json({
          error: "supplier_id must be a positive number"
        });
      }
      query += ` AND supplier_id = $${paramCounter}`;
      values.push(Number(supplier_id));
      paramCounter++;
    }
    
    if (start_date) {
      if (isNaN(Date.parse(start_date.toString()))) {
        return res.status(400).json({
          error: "start_date must be a valid date"
        });
      }
      query += ` AND po_date >= $${paramCounter}`;
      values.push(start_date);
      paramCounter++;
    }
    
    if (end_date) {
      if (isNaN(Date.parse(end_date.toString()))) {
        return res.status(400).json({
          error: "end_date must be a valid date"
        });
      }
      query += ` AND po_date <= $${paramCounter}`;
      values.push(end_date);
      paramCounter++;
    }
    
    // Add ordering and pagination
    query += ` ORDER BY po_date DESC LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limitNum, offset);
    
    // Execute query
    const { rows } = await pool.query(query, values);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM tbl_purchase_order_hdr WHERE 1=1`;
    const countValues: any[] = [];
    let countParam = 1;
    
    if (status) {
      countQuery += ` AND status_entry = $${countParam}`;
      countValues.push(status.trim());
      countParam++;
    }
    
    if (supplier_id) {
      countQuery += ` AND supplier_id = $${countParam}`;
      countValues.push(Number(supplier_id));
      countParam++;
    }
    
    if (start_date) {
      countQuery += ` AND po_date >= $${countParam}`;
      countValues.push(start_date);
      countParam++;
    }
    
    if (end_date) {
      countQuery += ` AND po_date <= $${countParam}`;
      countValues.push(end_date);
      countParam++;
    }
    
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error("Error fetching header data:", error);
    res.status(500).json({ 
      error: "Failed to fetch header data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * READ – Get PO Header By Reference Number (PO_REF_NO is the primary key)
 */
export const getPOHeaderByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;

    // Validate reference number parameter
    if (!po_ref_no || typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "PO reference number is required and must be a non-empty string"
      });
    }

    // Length validation based on database schema
    if (po_ref_no.length > 50) {
      return res.status(400).json({
        error: "PO reference number must be 50 characters or less"
      });
    }

    const query = `
      SELECT *
      FROM tbl_purchase_order_hdr
      WHERE po_ref_no = $1
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Header not found",
        po_ref_no: po_ref_no.trim()
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error: any) {
    console.error("Error fetching header data by reference:", error);
    res.status(500).json({ 
      error: "Failed to fetch header data by reference",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * UPDATE – Update PO Header By Reference Number
 */
export const updatePOHeaderByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;
    const {
      po_date,
      purchase_type,
      company_id,
      supplier_id,
      po_store_id,
      remarks,
      payment_term,
      mode_of_payment,
      currency_type,
      suplier_proforma_number,
      shipment_mode,
      price_terms,
      shipment_remarks,
      total_production_hdr_amount,
      total_additional_cost_amount,
      vat_hdr_amount,
      total_final_production_hdr_amount,
      respond_by,
      respond_date,
      respond_status,
      first_shipment_date,
      lc_apply_target_date,
      response_1_person,
      response_1_date,
      response_1_status,
      response_1_remarks,
      response_1_mac_address,
      response_2_person,
      response_2_date,
      response_2_status,
      response_2_remarks,
      response_2_mac_address,
      final_response_person,
      final_response_date,
      final_response_status,
      final_response_remarks,
      requested_date,
      requested_by,
      requested_mac_address,
      stock_company_transfer_ref_no,
      loading_port_id,
      discharge_port_id,
      shipment_type,
      supplier_company_id,
      stock_store_id,
      imports_response_1_person,
      imports_response_1_date,
      imports_response_1_status,
      imports_response_1_remarks,
      imports_response_1_mac_address,
      company_onbehalf_of,
      purchase_head_response_person,
      purchase_head_response_date,
      purchase_head_response_status,
      purchase_head_response_remarks,
      purchase_head_response_mac_address,
      erp_pi_ref_no,
      price_for_cnf_fob,
      status_entry,
      modified_by,
      modified_mac_address
    } = req.body;

    // Validate reference number parameter
    if (!po_ref_no || typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "PO reference number is required"
      });
    }

    if (po_ref_no.length > 50) {
      return res.status(400).json({
        error: "PO reference number must be 50 characters or less"
      });
    }

    // Check if at least one field is being updated (excluding modified_by and status_entry)
    const hasUpdateData = [
      po_date, purchase_type, company_id, supplier_id, po_store_id,
      remarks, payment_term, mode_of_payment, currency_type,
      suplier_proforma_number, shipment_mode, price_terms, shipment_remarks,
      total_production_hdr_amount, total_additional_cost_amount,
      vat_hdr_amount, total_final_production_hdr_amount,
      respond_by, respond_date, respond_status, first_shipment_date,
      lc_apply_target_date, response_1_person, response_1_date,
      response_1_status, response_1_remarks, response_1_mac_address,
      response_2_person, response_2_date, response_2_status,
      response_2_remarks, response_2_mac_address, final_response_person,
      final_response_date, final_response_status, final_response_remarks,
      requested_date, requested_by, requested_mac_address,
      stock_company_transfer_ref_no, loading_port_id, discharge_port_id,
      shipment_type, supplier_company_id, stock_store_id,
      imports_response_1_person, imports_response_1_date,
      imports_response_1_status, imports_response_1_remarks,
      imports_response_1_mac_address, company_onbehalf_of,
      purchase_head_response_person, purchase_head_response_date,
      purchase_head_response_status, purchase_head_response_remarks,
      purchase_head_response_mac_address, erp_pi_ref_no,
      price_for_cnf_fob, status_entry
    ].some(field => field !== undefined);

    if (!hasUpdateData) {
      return res.status(400).json({
        error: "No update data provided"
      });
    }

    // Use default modified_by if not provided
    const modifiedBy = modified_by || 'ADMIN';

    // Validate modified_by
    if (typeof modifiedBy !== 'string' || modifiedBy.trim().length === 0) {
      return res.status(400).json({
        error: "modified_by must be a non-empty string"
      });
    }

    if (modifiedBy.length > 50) {
      return res.status(400).json({
        error: "modified_by must be 50 characters or less"
      });
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Helper function to add field to update
    const addField = (fieldName: string, value: any, isString: boolean = false, isNumeric: boolean = false, isDate: boolean = false, maxLength?: number) => {
      if (value !== undefined) {
        if (isDate && value !== null && value !== '') {
          // For date fields, validate and format
          if (isNaN(Date.parse(value))) {
            throw new Error(`${fieldName} must be a valid date`);
          }
          updateFields.push(`${fieldName} = $${paramCounter}`);
          values.push(value);
          paramCounter++;
        } else if (isString && value !== null) {
          const strValue = value.toString().trim();
          // Validate string length if maxLength is provided
          if (maxLength && strValue.length > maxLength) {
            throw new Error(`${fieldName} must be ${maxLength} characters or less`);
          }
          updateFields.push(`${fieldName} = $${paramCounter}`);
          values.push(strValue || null);
          paramCounter++;
        } else if (isNumeric && value !== null && value !== '') {
          // For numeric fields
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0) {
            throw new Error(`${fieldName} must be a non-negative number`);
          }
          updateFields.push(`${fieldName} = $${paramCounter}`);
          values.push(numValue);
          paramCounter++;
        } else {
          // For null values or unspecified types
          updateFields.push(`${fieldName} = $${paramCounter}`);
          values.push(value !== null && value !== '' ? value : null);
          paramCounter++;
        }
      }
    };

    // Validate and add fields to update
    try {
      // Basic PO information
      if (po_date !== undefined) {
        addField("po_date", po_date, false, false, true);
      }

      addField("purchase_type", purchase_type, true, false, false, 20);
      addField("company_id", company_id, false, true);
      addField("supplier_id", supplier_id, false, true);
      addField("po_store_id", po_store_id, false, true);
      addField("remarks", remarks, true, false, false, 2000);
      
      // Payment and currency
      addField("payment_term", payment_term, true, false, false, 3000);
      addField("mode_of_payment", mode_of_payment, true, false, false, 25);
      addField("currency_type", currency_type, true, false, false, 25);
      
      // Supplier and shipment details
      addField("suplier_proforma_number", suplier_proforma_number, true, false, false, 100);
      addField("shipment_mode", shipment_mode, true, false, false, 100);
      addField("price_terms", price_terms, true, false, false, 150);
      addField("shipment_remarks", shipment_remarks, true, false, false, 2500);
      
      // Amount fields
      addField("total_production_hdr_amount", total_production_hdr_amount, false, true);
      addField("total_additional_cost_amount", total_additional_cost_amount, false, true);
      addField("vat_hdr_amount", vat_hdr_amount, false, true);
      addField("total_final_production_hdr_amount", total_final_production_hdr_amount, false, true);
      
      // Response fields - Level 1
      addField("respond_by", respond_by, true, false, false, 50);
      addField("respond_date", respond_date, false, false, true);
      addField("respond_status", respond_status, true, false, false, 50);
      
      // Shipment dates
      addField("first_shipment_date", first_shipment_date, false, false, true);
      addField("lc_apply_target_date", lc_apply_target_date, false, false, true);
      
      // Response fields - Level 2
      addField("response_1_person", response_1_person, true, false, false, 50);
      addField("response_1_date", response_1_date, false, false, true);
      addField("response_1_status", response_1_status, true, false, false, 50);
      addField("response_1_remarks", response_1_remarks, true, false, false, 5000);
      addField("response_1_mac_address", response_1_mac_address, true, false, false, 50);
      
      addField("response_2_person", response_2_person, true, false, false, 50);
      addField("response_2_date", response_2_date, false, false, true);
      addField("response_2_status", response_2_status, true, false, false, 50);
      addField("response_2_remarks", response_2_remarks, true, false, false, 5000);
      addField("response_2_mac_address", response_2_mac_address, true, false, false, 50);
      
      // Final response
      addField("final_response_person", final_response_person, true, false, false, 50);
      addField("final_response_date", final_response_date, false, false, true);
      addField("final_response_status", final_response_status, true, false, false, 50);
      addField("final_response_remarks", final_response_remarks, true, false, false, 5000);
      
      // Request information
      addField("requested_date", requested_date, false, false, true);
      addField("requested_by", requested_by, true, false, false, 50);
      addField("requested_mac_address", requested_mac_address, true, false, false, 50);
      
      // Stock and transfer
      addField("stock_company_transfer_ref_no", stock_company_transfer_ref_no, true, false, false, 50);
      addField("loading_port_id", loading_port_id, false, true);
      addField("discharge_port_id", discharge_port_id, false, true);
      addField("shipment_type", shipment_type, true, false, false, 50);
      
      // Additional IDs
      addField("supplier_company_id", supplier_company_id, false, true);
      addField("stock_store_id", stock_store_id, false, true);
      
      // Imports response
      addField("imports_response_1_person", imports_response_1_person, true, false, false, 50);
      addField("imports_response_1_date", imports_response_1_date, false, false, true);
      addField("imports_response_1_status", imports_response_1_status, true, false, false, 50);
      addField("imports_response_1_remarks", imports_response_1_remarks, true, false, false, 500);
      addField("imports_response_1_mac_address", imports_response_1_mac_address, true, false, false, 50);
      
      // Company and purchase head
      addField("company_onbehalf_of", company_onbehalf_of, false, true);
      addField("purchase_head_response_person", purchase_head_response_person, true, false, false, 50);
      addField("purchase_head_response_date", purchase_head_response_date, false, false, true);
      addField("purchase_head_response_status", purchase_head_response_status, true, false, false, 50);
      addField("purchase_head_response_remarks", purchase_head_response_remarks, true, false, false, 500);
      addField("purchase_head_response_mac_address", purchase_head_response_mac_address, true, false, false, 50);
      
      // ERP and pricing
      addField("erp_pi_ref_no", erp_pi_ref_no, true, false, false, 50);
      addField("price_for_cnf_fob", price_for_cnf_fob, true, false, false, 20);
      
      // Status
      addField("status_entry", status_entry, true, false, false, 20);
      
      // Modification info (always added)
      addField("modified_by", modifiedBy, true, false, false, 50);
      updateFields.push("modified_date = NOW()"); // Use PostgreSQL NOW() for consistency
      addField("modified_mac_address", modified_mac_address, true, false, false, 50);
      
    } catch (validationError: any) {
      return res.status(400).json({
        error: validationError.message
      });
    }

    // Add WHERE clause parameter
    values.push(po_ref_no.trim());

    const query = `
      UPDATE tbl_purchase_order_hdr
      SET ${updateFields.join(', ')}
      WHERE po_ref_no = $${paramCounter}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Header not found",
        po_ref_no: po_ref_no.trim()
      });
    }

    res.status(200).json({
      msg: "PO Header updated successfully",
      data: rows[0]
    });
  } catch (error: any) {
    console.error("Error updating header data:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Referenced record not found (check foreign key references)"
      });
    }
    
    if (error.code === '23505') {
      return res.status(409).json({
        error: "Update would create a duplicate record"
      });
    }
    
    if (error.code === '22007') {
      return res.status(400).json({
        error: "Invalid date/time format provided"
      });
    }
    
    if (error.code === '22003') {
      return res.status(400).json({
        error: "Numeric value out of range"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to update header data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * DELETE – Delete PO Header By Reference Number
 */
export const deletePOHeaderByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;

    // Validate reference number parameter
    if (!po_ref_no || typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "PO reference number is required"
      });
    }

    if (po_ref_no.length > 50) {
      return res.status(400).json({
        error: "PO reference number must be 50 characters or less"
      });
    }

    // Check for existing references in child tables before deletion
    const checkReferences = async (tableName: string, refColumn: string): Promise<boolean> => {
      const checkQuery = `SELECT 1 FROM ${tableName} WHERE ${refColumn} = $1 LIMIT 1`;
      const result = await pool.query(checkQuery, [po_ref_no.trim()]);
      return result.rows.length > 0;
    };

    // Check all child tables
    const childTables = [
      { table: 'tbl_purchase_order_dtl', column: 'po_ref_no' },
      { table: 'tbl_purchase_order_conversation_dtl', column: 'po_ref_no' },
      { table: 'tbl_purchase_order_additional_cost_details', column: 'po_ref_no' },
      { table: 'tbl_purchase_order_files_upload', column: 'po_ref_no' }
    ];

    for (const childTable of childTables) {
      const hasReferences = await checkReferences(childTable.table, childTable.column);
      if (hasReferences) {
        return res.status(400).json({
          error: `Cannot delete PO Header. Records exist in ${childTable.table.split('.')[2]}. Delete those records first.`
        });
      }
    }

    const query = `
      DELETE FROM tbl_purchase_order_hdr
      WHERE po_ref_no = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Header not found",
        po_ref_no: po_ref_no.trim()
      });
    }

    res.status(200).json({
      msg: "PO Header deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting header data:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Cannot delete due to existing references"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to delete header data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * SEARCH – Search PO Headers with various criteria
 */
export const searchPOHeaders = async (req: Request, res: Response) => {
  try {
    const {
      po_ref_no,
      supplier_id,
      status,
      start_date,
      end_date,
      company_id,
      purchase_type
    } = req.query;

    // Build query dynamically with parameterized values
    let query = `
      SELECT *
      FROM tbl_purchase_order_hdr
      WHERE 1=1
    `;
    
    const values: any[] = [];
    let paramCounter = 1;

    // Add search criteria with proper validation
    if (po_ref_no) {
      if (typeof po_ref_no !== 'string' || po_ref_no.length > 50) {
        return res.status(400).json({
          error: "po_ref_no must be a string with max 50 characters"
        });
      }
      query += ` AND po_ref_no ILIKE $${paramCounter}`;
      values.push(`%${po_ref_no.trim()}%`);
      paramCounter++;
    }

    if (supplier_id) {
      if (isNaN(Number(supplier_id)) || Number(supplier_id) <= 0) {
        return res.status(400).json({
          error: "supplier_id must be a positive number"
        });
      }
      query += ` AND supplier_id = $${paramCounter}`;
      values.push(Number(supplier_id));
      paramCounter++;
    }

    if (status) {
      if (typeof status !== 'string' || status.length > 20) {
        return res.status(400).json({
          error: "status must be a string with max 20 characters"
        });
      }
      query += ` AND status_entry = $${paramCounter}`;
      values.push(status.trim());
      paramCounter++;
    }

    if (start_date) {
      if (isNaN(Date.parse(start_date.toString()))) {
        return res.status(400).json({
          error: "start_date must be a valid date"
        });
      }
      query += ` AND po_date >= $${paramCounter}`;
      values.push(start_date);
      paramCounter++;
    }

    if (end_date) {
      if (isNaN(Date.parse(end_date.toString()))) {
        return res.status(400).json({
          error: "end_date must be a valid date"
        });
      }
      query += ` AND po_date <= $${paramCounter}`;
      values.push(end_date);
      paramCounter++;
    }

    if (company_id) {
      if (isNaN(Number(company_id)) || Number(company_id) <= 0) {
        return res.status(400).json({
          error: "company_id must be a positive number"
        });
      }
      query += ` AND company_id = $${paramCounter}`;
      values.push(Number(company_id));
      paramCounter++;
    }

    if (purchase_type) {
      if (typeof purchase_type !== 'string' || purchase_type.length > 20) {
        return res.status(400).json({
          error: "purchase_type must be a string with max 20 characters"
        });
      }
      query += ` AND purchase_type = $${paramCounter}`;
      values.push(purchase_type.trim());
      paramCounter++;
    }

    query += ` ORDER BY po_date DESC LIMIT 100`;

    const { rows } = await pool.query(query, values);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error("Error searching PO headers:", error);
    res.status(500).json({ 
      error: "Failed to search PO headers",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};