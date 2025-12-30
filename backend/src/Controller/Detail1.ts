// src/Controller/Detail1.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * CREATE – Add Purchase Order Detail
 */
export const addPODetail1Data = async (req: Request, res: Response) => {
  try {
    const {
      po_ref_no,
      request_store_id,
      po_request_ref_no,
      proforma_invoice_ref_no,
      section_id,
      machine_id,
      main_category_id,
      sub_category_id,
      product_id,
      packing_type,
      no_pcs_per_packing,
      total_pcs,
      total_packing,
      rate_per_pcs,
      product_amount,
      discount_percentage,
      discount_amount,
      total_product_amount,
      vat_percentage,
      vat_amount,
      final_product_amount,
      remarks,
      created_by,
      created_mac_address,
      alternate_product_name,
      lc_needed_status,
      lc_apply_status,
      lc_applied_date,
      lc_no,
      sup_doc_file,
      truck_id,
      trailer_id
    } = req.body;

    // Required field validation
    if (!po_ref_no || !created_by) {
      return res.status(400).json({
        error: "Missing required fields: po_ref_no, created_by"
      });
    }

    // Numeric field validation
    const numericFields = [
      { field: request_store_id, name: "request_store_id", optional: true },
      { field: section_id, name: "section_id", optional: true },
      { field: machine_id, name: "machine_id", optional: true },
      { field: main_category_id, name: "main_category_id", optional: true },
      { field: sub_category_id, name: "sub_category_id", optional: true },
      { field: product_id, name: "product_id", optional: true },
      { field: no_pcs_per_packing, name: "no_pcs_per_packing", optional: true },
      { field: total_pcs, name: "total_pcs", optional: true },
      { field: total_packing, name: "total_packing", optional: true },
      { field: rate_per_pcs, name: "rate_per_pcs", optional: true },
      { field: product_amount, name: "product_amount", optional: true },
      { field: discount_percentage, name: "discount_percentage", optional: true },
      { field: discount_amount, name: "discount_amount", optional: true },
      { field: total_product_amount, name: "total_product_amount", optional: true },
      { field: vat_percentage, name: "vat_percentage", optional: true },
      { field: vat_amount, name: "vat_amount", optional: true },
      { field: final_product_amount, name: "final_product_amount", optional: true },
      { field: truck_id, name: "truck_id", optional: true },
      { field: trailer_id, name: "trailer_id", optional: true }
    ];

    for (const { field, name, optional } of numericFields) {
      if (field !== undefined && field !== null && field !== '') {
        if (isNaN(Number(field)) || Number(field) < 0) {
          return res.status(400).json({
            error: `${name} must be a non-negative number`
          });
        }
      } else if (!optional) {
        return res.status(400).json({
          error: `${name} is required`
        });
      }
    }

    // String field length validation
    const stringFields = [
      { field: po_ref_no, name: "po_ref_no", maxLength: 50 },
      { field: po_request_ref_no, name: "po_request_ref_no", maxLength: 50, optional: true },
      { field: proforma_invoice_ref_no, name: "proforma_invoice_ref_no", maxLength: 50, optional: true },
      { field: packing_type, name: "packing_type", maxLength: 50, optional: true },
      { field: remarks, name: "remarks", maxLength: 2000, optional: true },
      { field: created_by, name: "created_by", maxLength: 50 },
      { field: created_mac_address, name: "created_mac_address", maxLength: 50, optional: true },
      { field: alternate_product_name, name: "alternate_product_name", maxLength: 500, optional: true },
      { field: lc_needed_status, name: "lc_needed_status", maxLength: 50, optional: true },
      { field: lc_apply_status, name: "lc_apply_status", maxLength: 50, optional: true },
      { field: lc_no, name: "lc_no", maxLength: 50, optional: true }
    ];

    for (const { field, name, maxLength, optional } of stringFields) {
      if (field !== undefined && field !== null && field !== '') {
        if (typeof field !== 'string') {
          return res.status(400).json({
            error: `${name} must be a string`
          });
        }
        if (field.length > maxLength) {
          return res.status(400).json({
            error: `${name} must be less than ${maxLength} characters`
          });
        }
      } else if (!optional) {
        return res.status(400).json({
          error: `${name} is required`
        });
      }
    }

    // Date validation
    if (lc_applied_date && isNaN(Date.parse(lc_applied_date))) {
      return res.status(400).json({
        error: "lc_applied_date must be a valid date"
      });
    }

    const query = `
      INSERT INTO tbl_purchase_order_dtl(
        po_ref_no,
        request_store_id,
        po_request_ref_no,
        proforma_invoice_ref_no,
        section_id,
        machine_id,
        main_category_id,
        sub_category_id,
        product_id,
        packing_type,
        no_pcs_per_packing,
        total_pcs,
        total_packing,
        rate_per_pcs,
        product_amount,
        discount_percentage,
        discount_amount,
        total_product_amount,
        vat_percentage,
        vat_amount,
        final_product_amount,
        remarks,
        status_entry,
        created_by,
        created_date,
        created_mac_address,
        alternate_product_name,
        lc_needed_status,
        lc_apply_status,
        lc_applied_date,
        lc_no,
        sup_doc_file,
        truck_id,
        trailer_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, 'CREATED', $23, NOW(), $24,
        $25, $26, $27, $28, $29, $30, $31, $32
      )
      RETURNING *
    `;

    const values = [
      po_ref_no.trim(),
      request_store_id ? Number(request_store_id) : null,
      po_request_ref_no ? po_request_ref_no.trim() : null,
      proforma_invoice_ref_no ? proforma_invoice_ref_no.trim() : null,
      section_id ? Number(section_id) : null,
      machine_id ? Number(machine_id) : null,
      main_category_id ? Number(main_category_id) : null,
      sub_category_id ? Number(sub_category_id) : null,
      product_id ? Number(product_id) : null,
      packing_type ? packing_type.trim() : null,
      no_pcs_per_packing ? Number(no_pcs_per_packing) : null,
      total_pcs ? Number(total_pcs) : null,
      total_packing ? Number(total_packing) : null,
      rate_per_pcs ? Number(rate_per_pcs) : null,
      product_amount ? Number(product_amount) : null,
      discount_percentage ? Number(discount_percentage) : null,
      discount_amount ? Number(discount_amount) : null,
      total_product_amount ? Number(total_product_amount) : null,
      vat_percentage ? Number(vat_percentage) : null,
      vat_amount ? Number(vat_amount) : null,
      final_product_amount ? Number(final_product_amount) : null,
      remarks ? remarks.trim() : null,
      created_by.trim(),
      created_mac_address ? created_mac_address.trim() : null,
      alternate_product_name ? alternate_product_name.trim() : null,
      lc_needed_status ? lc_needed_status.trim() : null,
      lc_apply_status ? lc_apply_status.trim() : null,
      lc_applied_date || null,
      lc_no ? lc_no.trim() : null,
      sup_doc_file || null,
      truck_id ? Number(truck_id) : null,
      trailer_id ? Number(trailer_id) : null
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      msg: "Purchase Order Detail created successfully",
      data: rows[0]
    });

  } catch (error: any) {
    console.error("PO Detail Insert Error:", error);
    
    // Handle foreign key constraint errors
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Referenced record not found (check po_ref_no or other foreign keys)"
      });
    }
    
    // Handle unique constraint errors
    if (error.code === '23505') {
      return res.status(400).json({
        error: "Duplicate record found"
      });
    }
    
    res.status(500).json({ error: "Failed to create PO detail" });
  }
};

/**
 * FETCH – Get all Purchase Order Details with Pagination
 */
export const getAllPODetail1s = async (req: Request, res: Response) => {
  try {
    const { 
      po_ref_no,
      page = 1,
      limit = 50,
      sort_by = 'sno',
      sort_order = 'DESC',
      product_id,
      status_entry,
      created_by,
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
    
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 500) {
      return res.status(400).json({
        error: "limit must be between 1 and 500"
      });
    }
    
    const offset = (pageNum - 1) * limitNum;
    
    // Validate sort parameters
    const validSortColumns = ['sno', 'created_date', 'modified_date', 'product_id', 
                             'total_pcs', 'final_product_amount', 'po_ref_no'];
    const sortBy = validSortColumns.includes(sort_by as string) ? sort_by : 'sno';
    const sortOrder = sort_order === 'ASC' || sort_order === 'asc' ? 'ASC' : 'DESC';

    // Build query dynamically with parameterized values
    let query = `
      SELECT 
        sno,
        po_ref_no,
        request_store_id,
        po_request_ref_no,
        proforma_invoice_ref_no,
        section_id,
        machine_id,
        main_category_id,
        sub_category_id,
        product_id,
        packing_type,
        no_pcs_per_packing,
        total_pcs,
        total_packing,
        rate_per_pcs,
        product_amount,
        discount_percentage,
        discount_amount,
        total_product_amount,
        vat_percentage,
        vat_amount,
        final_product_amount,
        remarks,
        status_entry,
        created_by,
        created_date,
        created_mac_address,
        modified_by,
        modified_date,
        modified_mac_address,
        alternate_product_name,
        lc_needed_status,
        lc_apply_status,
        lc_applied_date,
        lc_no,
        truck_id,
        trailer_id
      FROM tbl_purchase_order_dtl
      WHERE 1=1
    `;
    
    const values: any[] = [];
    let paramCounter = 1;
    
    // Add filters with parameterized queries
    if (po_ref_no) {
      if (typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
        return res.status(400).json({
          error: "po_ref_no must be a non-empty string"
        });
      }
      query += ` AND po_ref_no = $${paramCounter}`;
      values.push(po_ref_no.trim());
      paramCounter++;
    }
    
    if (product_id) {
      if (isNaN(Number(product_id)) || Number(product_id) <= 0) {
        return res.status(400).json({
          error: "product_id must be a positive number"
        });
      }
      query += ` AND product_id = $${paramCounter}`;
      values.push(Number(product_id));
      paramCounter++;
    }
    
    if (status_entry) {
      if (typeof status_entry !== 'string' || status_entry.length > 20) {
        return res.status(400).json({
          error: "status_entry must be a string with max 20 characters"
        });
      }
      query += ` AND status_entry = $${paramCounter}`;
      values.push(status_entry.trim());
      paramCounter++;
    }
    
    if (created_by) {
      if (typeof created_by !== 'string' || created_by.length > 50) {
        return res.status(400).json({
          error: "created_by must be a string with max 50 characters"
        });
      }
      query += ` AND created_by ILIKE $${paramCounter}`;
      values.push(`%${created_by.trim()}%`);
      paramCounter++;
    }
    
    if (start_date) {
      if (isNaN(Date.parse(start_date.toString()))) {
        return res.status(400).json({
          error: "start_date must be a valid date"
        });
      }
      query += ` AND created_date >= $${paramCounter}`;
      values.push(start_date);
      paramCounter++;
    }
    
    if (end_date) {
      if (isNaN(Date.parse(end_date.toString()))) {
        return res.status(400).json({
          error: "end_date must be a valid date"
        });
      }
      query += ` AND created_date <= $${paramCounter}`;
      values.push(end_date);
      paramCounter++;
    }
    
    // Add ordering
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Add pagination
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limitNum, offset);
    
    // Execute query
    const { rows } = await pool.query(query, values);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM tbl_purchase_order_dtl WHERE 1=1`;
    const countValues: any[] = [];
    let countParam = 1;
    
    if (po_ref_no) {
      countQuery += ` AND po_ref_no = $${countParam}`;
      countValues.push(po_ref_no.trim());
      countParam++;
    }
    
    if (product_id) {
      countQuery += ` AND product_id = $${countParam}`;
      countValues.push(Number(product_id));
      countParam++;
    }
    
    if (status_entry) {
      countQuery += ` AND status_entry = $${countParam}`;
      countValues.push(status_entry.trim());
      countParam++;
    }
    
    if (created_by) {
      countQuery += ` AND created_by ILIKE $${countParam}`;
      countValues.push(`%${created_by.trim()}%`);
      countParam++;
    }
    
    if (start_date) {
      countQuery += ` AND created_date >= $${countParam}`;
      countValues.push(start_date);
      countParam++;
    }
    
    if (end_date) {
      countQuery += ` AND created_date <= $${countParam}`;
      countValues.push(end_date);
      countParam++;
    }
    
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);
    
    // Calculate summary statistics if po_ref_no is provided
    let summary = {};
    if (po_ref_no) {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_items,
          COALESCE(SUM(total_pcs), 0) as total_quantity,
          COALESCE(SUM(final_product_amount), 0) as total_amount,
          COALESCE(AVG(rate_per_pcs), 0) as average_rate
        FROM tbl_purchase_order_dtl
        WHERE po_ref_no = $1
      `;
      const statsResult = await pool.query(statsQuery, [po_ref_no.trim()]);
      summary = statsResult.rows[0];
    }
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error: any) {
    console.error("Error fetching PO details:", error);
    res.status(500).json({ 
      error: "Failed to fetch PO details",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * FETCH – Get Purchase Order Detail by ID
 */
export const getPODetail1ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    const query = `
      SELECT *
      FROM tbl_purchase_order_dtl
      WHERE sno = $1
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "PO Detail not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching PO detail by ID:", error);
    res.status(500).json({ error: "Failed to fetch PO detail by ID" });
  }
};

/**
 * UPDATE – Update Purchase Order Detail by ID
 */
export const updatePODetail1ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      request_store_id,
      po_request_ref_no,
      proforma_invoice_ref_no,
      section_id,
      machine_id,
      main_category_id,
      sub_category_id,
      product_id,
      packing_type,
      no_pcs_per_packing,
      total_pcs,
      total_packing,
      rate_per_pcs,
      product_amount,
      discount_percentage,
      discount_amount,
      total_product_amount,
      vat_percentage,
      vat_amount,
      final_product_amount,
      remarks,
      modified_by,
      modified_mac_address,
      alternate_product_name,
      lc_needed_status,
      lc_apply_status,
      lc_applied_date,
      lc_no,
      sup_doc_file,
      truck_id,
      trailer_id
    } = req.body;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    // Check if at least one field is being updated
    const hasUpdateData = [
      request_store_id, po_request_ref_no, proforma_invoice_ref_no, section_id,
      machine_id, main_category_id, sub_category_id, product_id, packing_type,
      no_pcs_per_packing, total_pcs, total_packing, rate_per_pcs, product_amount,
      discount_percentage, discount_amount, total_product_amount, vat_percentage,
      vat_amount, final_product_amount, remarks, modified_by, modified_mac_address,
      alternate_product_name, lc_needed_status, lc_apply_status, lc_applied_date,
      lc_no, sup_doc_file, truck_id, trailer_id
    ].some(field => field !== undefined);

    if (!hasUpdateData) {
      return res.status(400).json({
        error: "No update data provided"
      });
    }

    if (!modified_by) {
      return res.status(400).json({
        error: "modified_by is required for update"
      });
    }

    // Numeric field validation (only validate if provided)
    const numericFields = [
      { field: request_store_id, name: "request_store_id" },
      { field: section_id, name: "section_id" },
      { field: machine_id, name: "machine_id" },
      { field: main_category_id, name: "main_category_id" },
      { field: sub_category_id, name: "sub_category_id" },
      { field: product_id, name: "product_id" },
      { field: no_pcs_per_packing, name: "no_pcs_per_packing" },
      { field: total_pcs, name: "total_pcs" },
      { field: total_packing, name: "total_packing" },
      { field: rate_per_pcs, name: "rate_per_pcs" },
      { field: product_amount, name: "product_amount" },
      { field: discount_percentage, name: "discount_percentage" },
      { field: discount_amount, name: "discount_amount" },
      { field: total_product_amount, name: "total_product_amount" },
      { field: vat_percentage, name: "vat_percentage" },
      { field: vat_amount, name: "vat_amount" },
      { field: final_product_amount, name: "final_product_amount" },
      { field: truck_id, name: "truck_id" },
      { field: trailer_id, name: "trailer_id" }
    ];

    for (const { field, name } of numericFields) {
      if (field !== undefined && field !== null && field !== '') {
        if (isNaN(Number(field)) || Number(field) < 0) {
          return res.status(400).json({
            error: `${name} must be a non-negative number`
          });
        }
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Helper function to add field to update
    const addField = (fieldName: string, value: any, isString: boolean = false) => {
      if (value !== undefined) {
        updateFields.push(`${fieldName} = $${paramCounter}`);
        values.push(isString && value !== null ? value.toString().trim() : value);
        paramCounter++;
      }
    };

    // Add fields to update
    addField("request_store_id", request_store_id !== undefined ? Number(request_store_id) : null);
    addField("po_request_ref_no", po_request_ref_no, true);
    addField("proforma_invoice_ref_no", proforma_invoice_ref_no, true);
    addField("section_id", section_id !== undefined ? Number(section_id) : null);
    addField("machine_id", machine_id !== undefined ? Number(machine_id) : null);
    addField("main_category_id", main_category_id !== undefined ? Number(main_category_id) : null);
    addField("sub_category_id", sub_category_id !== undefined ? Number(sub_category_id) : null);
    addField("product_id", product_id !== undefined ? Number(product_id) : null);
    addField("packing_type", packing_type, true);
    addField("no_pcs_per_packing", no_pcs_per_packing !== undefined ? Number(no_pcs_per_packing) : null);
    addField("total_pcs", total_pcs !== undefined ? Number(total_pcs) : null);
    addField("total_packing", total_packing !== undefined ? Number(total_packing) : null);
    addField("rate_per_pcs", rate_per_pcs !== undefined ? Number(rate_per_pcs) : null);
    addField("product_amount", product_amount !== undefined ? Number(product_amount) : null);
    addField("discount_percentage", discount_percentage !== undefined ? Number(discount_percentage) : null);
    addField("discount_amount", discount_amount !== undefined ? Number(discount_amount) : null);
    addField("total_product_amount", total_product_amount !== undefined ? Number(total_product_amount) : null);
    addField("vat_percentage", vat_percentage !== undefined ? Number(vat_percentage) : null);
    addField("vat_amount", vat_amount !== undefined ? Number(vat_amount) : null);
    addField("final_product_amount", final_product_amount !== undefined ? Number(final_product_amount) : null);
    addField("remarks", remarks, true);
    addField("modified_by", modified_by, true);
    addField("modified_date", new Date());
    addField("modified_mac_address", modified_mac_address, true);
    addField("alternate_product_name", alternate_product_name, true);
    addField("lc_needed_status", lc_needed_status, true);
    addField("lc_apply_status", lc_apply_status, true);
    addField("lc_applied_date", lc_applied_date || null);
    addField("lc_no", lc_no, true);
    addField("sup_doc_file", sup_doc_file || null);
    addField("truck_id", truck_id !== undefined ? Number(truck_id) : null);
    addField("trailer_id", trailer_id !== undefined ? Number(trailer_id) : null);

    // Add WHERE clause parameter
    values.push(Number(id));

    const query = `
      UPDATE tbl_purchase_order_dtl
      SET ${updateFields.join(', ')}
      WHERE sno = $${paramCounter}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "PO Detail not found" });
    }

    res.status(200).json({
      msg: "PO Detail updated successfully",
      data: rows[0]
    });
  } catch (error: any) {
    console.error("Error updating PO detail:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Referenced record not found"
      });
    }
    
    res.status(500).json({ error: "Failed to update PO detail" });
  }
};

/**
 * DELETE – Delete Purchase Order Detail by ID
 */
export const deletePODetail1ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    const query = `
      DELETE FROM tbl_purchase_order_dtl
      WHERE sno = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "PO Detail not found" });
    }

    res.status(200).json({
      msg: "PO Detail deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting PO detail:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Cannot delete due to existing references"
      });
    }
    
    res.status(500).json({ error: "Failed to delete PO detail" });
  }
};

/**
 * FETCH – Get Purchase Order Details by PO Reference Number
 * (Alternative endpoint for getting details by po_ref_no)
 */
export const getPODetailsByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;

    if (!po_ref_no || typeof po_ref_no !== 'string') {
      return res.status(400).json({
        error: "PO reference number is required"
      });
    }

    const query = `
      SELECT *
      FROM tbl_purchase_order_dtl
      WHERE po_ref_no = $1
      ORDER BY sno
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "No PO details found for this reference number" 
      });
    }

    res.status(200).json({
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error("Error fetching PO details by reference:", error);
    res.status(500).json({ error: "Failed to fetch PO details by reference" });
  }
};