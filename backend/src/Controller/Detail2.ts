// src/Controller/Detail2.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * CREATE – Add Purchase Order Additional Cost Detail
 */
export const addPODetail2Data = async (req: Request, res: Response) => {
  try {
    const {
      po_ref_no,
      additional_cost_type,
      amount,
      remarks,
      status_master,
      created_by,
      created_mac_address
    } = req.body;

    // Required field validation
    if (!po_ref_no || !additional_cost_type || !amount || !created_by) {
      return res.status(400).json({
        error: "Missing required fields: po_ref_no, additional_cost_type, amount, created_by"
      });
    }

    // Check if PO header exists
    const checkHeaderQuery = `SELECT 1 FROM public.tbl_purchase_order_hdr WHERE po_ref_no = $1`;
    const headerCheck = await pool.query(checkHeaderQuery, [po_ref_no.trim()]);
    
    if (headerCheck.rows.length === 0) {
      return res.status(400).json({
        error: `Purchase Order with reference ${po_ref_no} does not exist. Create header first.`
      });
    }

    // String field length validation
    const stringFields = [
      { field: po_ref_no, name: "po_ref_no", maxLength: 50 },
      { field: additional_cost_type, name: "additional_cost_type", maxLength: 100 },
      { field: remarks, name: "remarks", maxLength: 1000, optional: true },
      { field: status_master, name: "status_master", maxLength: 50, optional: true },
      { field: created_by, name: "created_by", maxLength: 50 },
      { field: created_mac_address, name: "created_mac_address", maxLength: 50, optional: true }
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

    // Amount validation
    if (isNaN(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({
        error: "amount must be a non-negative number"
      });
    }

    const query = `
      INSERT INTO public.tbl_purchase_order_additional_cost_details(
        po_ref_no,
        additional_cost_type,
        amount,
        remarks,
        status_master,
        created_by,
        created_date,
        created_mac_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
      RETURNING *
    `;

    const values = [
      po_ref_no.trim(),
      additional_cost_type.trim(),
      Number(amount),
      remarks ? remarks.trim() : null,
      status_master ? status_master.trim() : 'ACTIVE',
      created_by.trim(),
      created_mac_address ? created_mac_address.trim() : null
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      msg: "Purchase Order Additional Cost Detail created successfully",
      data: rows[0]
    });

  } catch (error: any) {
    console.error("PO Additional Cost Detail Insert Error:", error);
    
    // Handle foreign key constraint errors
    if (error.code === '23503') {
      const detail = error.detail || '';
      if (detail.includes('po_ref_no')) {
        return res.status(400).json({
          error: "Purchase Order header does not exist. Create header first."
        });
      }
      return res.status(400).json({
        error: "Referenced record not found"
      });
    }
    
    // Handle unique constraint errors
    if (error.code === '23505') {
      return res.status(400).json({
        error: "Duplicate record found"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to create PO additional cost detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get all Purchase Order Additional Cost Details with Pagination
 */
export const getAllPODetail2s = async (req: Request, res: Response) => {
  try {
    const { 
      po_ref_no,
      page = 1,
      limit = 50,
      sort_by = 'sno',
      sort_order = 'DESC',
      additional_cost_type,
      status_master,
      start_date,
      end_date,
      min_amount,
      max_amount
    } = req.query;

    // Validate pagination parameters
    const pageNum = Number(page);
    const limitNum = Number(limit);
    
    if (isNaN(pageNum) || pageNum <= 0) {
      return res.status(400).json({
        error: "page must be a positive number"
      });
    }
    
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 200) {
      return res.status(400).json({
        error: "limit must be between 1 and 200"
      });
    }
    
    const offset = (pageNum - 1) * limitNum;
    
    // Validate sort parameters
    const validSortColumns = ['sno', 'created_date', 'modified_date', 'amount', 
                             'additional_cost_type', 'po_ref_no'];
    const sortBy = validSortColumns.includes(sort_by as string) ? sort_by : 'sno';
    const sortOrder = sort_order === 'ASC' || sort_order === 'asc' ? 'ASC' : 'DESC';

    // Build query dynamically with parameterized values
    let query = `
      SELECT 
        sno,
        po_ref_no,
        additional_cost_type,
        amount,
        remarks,
        status_master,
        created_by,
        created_date,
        created_mac_address,
        modified_by,
        modified_date,
        modified_mac_address
      FROM public.tbl_purchase_order_additional_cost_details
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
    
    if (additional_cost_type) {
      if (typeof additional_cost_type !== 'string' || additional_cost_type.length > 100) {
        return res.status(400).json({
          error: "additional_cost_type must be a string with max 100 characters"
        });
      }
      query += ` AND additional_cost_type ILIKE $${paramCounter}`;
      values.push(`%${additional_cost_type.trim()}%`);
      paramCounter++;
    }
    
    if (status_master) {
      if (typeof status_master !== 'string' || status_master.length > 50) {
        return res.status(400).json({
          error: "status_master must be a string with max 50 characters"
        });
      }
      query += ` AND status_master = $${paramCounter}`;
      values.push(status_master.trim());
      paramCounter++;
    }
    
    if (min_amount) {
      if (isNaN(Number(min_amount)) || Number(min_amount) < 0) {
        return res.status(400).json({
          error: "min_amount must be a non-negative number"
        });
      }
      query += ` AND amount >= $${paramCounter}`;
      values.push(Number(min_amount));
      paramCounter++;
    }
    
    if (max_amount) {
      if (isNaN(Number(max_amount)) || Number(max_amount) < 0) {
        return res.status(400).json({
          error: "max_amount must be a non-negative number"
        });
      }
      query += ` AND amount <= $${paramCounter}`;
      values.push(Number(max_amount));
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
    let countQuery = `SELECT COUNT(*) as total FROM public.tbl_purchase_order_additional_cost_details WHERE 1=1`;
    const countValues: any[] = [];
    let countParam = 1;
    
    if (po_ref_no) {
      countQuery += ` AND po_ref_no = $${countParam}`;
      countValues.push(po_ref_no.trim());
      countParam++;
    }
    
    if (additional_cost_type) {
      countQuery += ` AND additional_cost_type ILIKE $${countParam}`;
      countValues.push(`%${additional_cost_type.trim()}%`);
      countParam++;
    }
    
    if (status_master) {
      countQuery += ` AND status_master = $${countParam}`;
      countValues.push(status_master.trim());
      countParam++;
    }
    
    if (min_amount) {
      countQuery += ` AND amount >= $${countParam}`;
      countValues.push(Number(min_amount));
      countParam++;
    }
    
    if (max_amount) {
      countQuery += ` AND amount <= $${countParam}`;
      countValues.push(Number(max_amount));
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
          COUNT(*) as total_costs,
          COALESCE(SUM(amount), 0) as total_amount,
          MIN(amount) as min_amount,
          MAX(amount) as max_amount,
          AVG(amount) as average_amount
        FROM public.tbl_purchase_order_additional_cost_details
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
      },
    });
  } catch (error: any) {
    console.error("Error fetching PO additional cost details:", error);
    res.status(500).json({ 
      error: "Failed to fetch PO additional cost details",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get Purchase Order Additional Cost Detail by ID
 */
export const getPODetail2ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    const query = `
      SELECT 
        sno,
        po_ref_no,
        additional_cost_type,
        amount,
        remarks,
        status_master,
        created_by,
        created_date,
        created_mac_address,
        modified_by,
        modified_date,
        modified_mac_address
      FROM public.tbl_purchase_order_additional_cost_details
      WHERE sno = $1
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Additional Cost Detail not found",
        id: id
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error("Error fetching PO additional cost detail by ID:", error);
    res.status(500).json({ 
      error: "Failed to fetch PO additional cost detail by ID",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * UPDATE – Update Purchase Order Additional Cost Detail by ID
 */
export const updatePODetail2ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      additional_cost_type,
      amount,
      remarks,
      status_master,
      modified_by,
      modified_mac_address
    } = req.body;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    // Check if at least one field is being updated
    const hasUpdateData = [
      additional_cost_type, amount, remarks, status_master
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

    // String field validation
    const stringFields = [
      { field: additional_cost_type, name: "additional_cost_type", maxLength: 100, optional: true },
      { field: remarks, name: "remarks", maxLength: 1000, optional: true },
      { field: status_master, name: "status_master", maxLength: 50, optional: true },
      { field: modified_by, name: "modified_by", maxLength: 50 },
      { field: modified_mac_address, name: "modified_mac_address", maxLength: 50, optional: true }
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
      } else if (!optional && name === 'modified_by') {
        return res.status(400).json({
          error: `${name} is required`
        });
      }
    }

    // Amount validation
    if (amount !== undefined && amount !== null && amount !== '') {
      if (isNaN(Number(amount)) || Number(amount) < 0) {
        return res.status(400).json({
          error: "amount must be a non-negative number"
        });
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
    addField("additional_cost_type", additional_cost_type, true);
    addField("amount", amount !== undefined ? Number(amount) : null);
    addField("remarks", remarks, true);
    addField("status_master", status_master, true);
    addField("modified_by", modified_by, true);
    updateFields.push("modified_date = NOW()"); // Use PostgreSQL NOW() for consistency
    addField("modified_mac_address", modified_mac_address, true);

    // Add WHERE clause parameter
    values.push(Number(id));

    const query = `
      UPDATE public.tbl_purchase_order_additional_cost_details
      SET ${updateFields.join(', ')}
      WHERE sno = $${paramCounter}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Additional Cost Detail not found",
        id: id
      });
    }

    res.status(200).json({
      msg: "PO Additional Cost Detail updated successfully",
      data: rows[0]
    });
  } catch (error: any) {
    console.error("Error updating PO additional cost detail:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Referenced record not found"
      });
    }
    
    if (error.code === '23505') {
      return res.status(400).json({
        error: "Duplicate record found"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to update PO additional cost detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * DELETE – Delete Purchase Order Additional Cost Detail by ID
 */
export const deletePODetail2ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    const query = `
      DELETE FROM public.tbl_purchase_order_additional_cost_details
      WHERE sno = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Additional Cost Detail not found",
        id: id
      });
    }

    res.status(200).json({
      msg: "PO Additional Cost Detail deleted successfully",
      deleted_record: {
        id: rows[0].sno,
        po_ref_no: rows[0].po_ref_no,
        additional_cost_type: rows[0].additional_cost_type,
        amount: rows[0].amount
      }
    });
  } catch (error: any) {
    console.error("Error deleting PO additional cost detail:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Cannot delete due to existing references"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to delete PO additional cost detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get Additional Cost Details by PO Reference Number
 */
export const getAdditionalCostsByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;

    if (!po_ref_no || typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "PO reference number is required"
      });
    }

    // Check if PO exists
    const checkHeaderQuery = `SELECT 1 FROM public.tbl_purchase_order_hdr WHERE po_ref_no = $1`;
    const headerCheck = await pool.query(checkHeaderQuery, [po_ref_no.trim()]);
    
    if (headerCheck.rows.length === 0) {
      return res.status(404).json({
        error: `Purchase Order ${po_ref_no} not found`
      });
    }

    const query = `
      SELECT 
        sno,
        po_ref_no,
        additional_cost_type,
        amount,
        remarks,
        status_master,
        created_by,
        created_date
      FROM public.tbl_purchase_order_additional_cost_details
      WHERE po_ref_no = $1
      ORDER BY sno
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    // Calculate totals
    const totalQuery = `
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM public.tbl_purchase_order_additional_cost_details
      WHERE po_ref_no = $1
    `;
    const totalResult = await pool.query(totalQuery, [po_ref_no.trim()]);

    res.status(200).json({
      success: true,
      count: rows.length,
      total: totalResult.rows[0],
      data: rows
    });
  } catch (error) {
    console.error("Error fetching additional costs by reference:", error);
    res.status(500).json({ 
      error: "Failed to fetch additional costs by reference",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};