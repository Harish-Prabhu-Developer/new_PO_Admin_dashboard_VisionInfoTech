// src/Controller/Detail3.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * CREATE – Add Purchase Order Conversation Detail
 */
export const addPODetail3Data = async (req: Request, res: Response) => {
  try {
    const {
      po_ref_no,
      respond_person,
      discussion_details,
      response_status,
      status_entry,
      remarks,
      created_by,
      created_mac_address
    } = req.body;

    // Required field validation
    if (!po_ref_no || !respond_person || !discussion_details || !created_by) {
      return res.status(400).json({
        error: "Missing required fields: po_ref_no, respond_person, discussion_details, created_by"
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
      { field: respond_person, name: "respond_person", maxLength: 50 },
      { field: response_status, name: "response_status", maxLength: 50, optional: true },
      { field: status_entry, name: "status_entry", maxLength: 50, optional: true },
      { field: remarks, name: "remarks", maxLength: 50, optional: true },
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

    // Discussion details validation (TEXT field, no max length but validate it's a string)
    if (typeof discussion_details !== 'string') {
      return res.status(400).json({
        error: "discussion_details must be a string"
      });
    }

    // Trim discussion details if too long (optional)
    const sanitizedDiscussion = discussion_details.trim();

    const query = `
      INSERT INTO public.tbl_purchase_order_conversation_dtl(
        po_ref_no,
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_date,
        created_mac_address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
      RETURNING *
    `;

    const values = [
      po_ref_no.trim(),
      respond_person.trim(),
      sanitizedDiscussion,
      response_status ? response_status.trim() : null,
      status_entry ? status_entry.trim() : 'ACTIVE',
      remarks ? remarks.trim() : null,
      created_by.trim(),
      created_mac_address ? created_mac_address.trim() : null
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      msg: "Purchase Order Conversation Detail created successfully",
      data: rows[0]
    });

  } catch (error: any) {
    console.error("PO Conversation Detail Insert Error:", error);
    
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
      error: "Failed to create PO conversation detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get all Purchase Order Conversation Details with Pagination
 */
export const getAllPODetail3s = async (req: Request, res: Response) => {
  try {
    const { 
      po_ref_no,
      page = 1,
      limit = 50,
      sort_by = 'sno',
      sort_order = 'DESC',
      respond_person,
      response_status,
      status_entry,
      created_by,
      start_date,
      end_date,
      search
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
    const validSortColumns = ['sno', 'created_date', 'modified_date', 'respond_person', 
                             'response_status', 'po_ref_no'];
    const sortBy = validSortColumns.includes(sort_by as string) ? sort_by : 'sno';
    const sortOrder = sort_order === 'ASC' || sort_order === 'asc' ? 'ASC' : 'DESC';

    // Build query dynamically with parameterized values
    let query = `
      SELECT 
        sno,
        po_ref_no,
        respond_person,
        SUBSTRING(discussion_details FROM 1 FOR 200) as discussion_preview,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_date,
        created_mac_address,
        modified_by,
        modified_date,
        modified_mac_address,
        LENGTH(discussion_details) as discussion_length
      FROM public.tbl_purchase_order_conversation_dtl
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
    
    if (respond_person) {
      if (typeof respond_person !== 'string' || respond_person.length > 50) {
        return res.status(400).json({
          error: "respond_person must be a string with max 50 characters"
        });
      }
      query += ` AND respond_person ILIKE $${paramCounter}`;
      values.push(`%${respond_person.trim()}%`);
      paramCounter++;
    }
    
    if (response_status) {
      if (typeof response_status !== 'string' || response_status.length > 50) {
        return res.status(400).json({
          error: "response_status must be a string with max 50 characters"
        });
      }
      query += ` AND response_status = $${paramCounter}`;
      values.push(response_status.trim());
      paramCounter++;
    }
    
    if (status_entry) {
      if (typeof status_entry !== 'string' || status_entry.length > 50) {
        return res.status(400).json({
          error: "status_entry must be a string with max 50 characters"
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
    
    // Search in discussion details
    if (search) {
      if (typeof search !== 'string') {
        return res.status(400).json({
          error: "search must be a string"
        });
      }
      query += ` AND discussion_details ILIKE $${paramCounter}`;
      values.push(`%${search.trim()}%`);
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
    let countQuery = `SELECT COUNT(*) as total FROM public.tbl_purchase_order_conversation_dtl WHERE 1=1`;
    const countValues: any[] = [];
    let countParam = 1;
    
    if (po_ref_no) {
      countQuery += ` AND po_ref_no = $${countParam}`;
      countValues.push(po_ref_no.trim());
      countParam++;
    }
    
    if (respond_person) {
      countQuery += ` AND respond_person ILIKE $${countParam}`;
      countValues.push(`%${respond_person.trim()}%`);
      countParam++;
    }
    
    if (response_status) {
      countQuery += ` AND response_status = $${countParam}`;
      countValues.push(response_status.trim());
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
    
    if (search) {
      countQuery += ` AND discussion_details ILIKE $${countParam}`;
      countValues.push(`%${search.trim()}%`);
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
    
    // Get conversation statistics if po_ref_no is provided
    let stats = {};
    if (po_ref_no) {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_conversations,
          COUNT(DISTINCT respond_person) as unique_respondents,
          MIN(created_date) as first_conversation,
          MAX(created_date) as last_conversation,
          COUNT(CASE WHEN response_status = 'POSITIVE' THEN 1 END) as positive_responses,
          COUNT(CASE WHEN response_status = 'NEGATIVE' THEN 1 END) as negative_responses,
          COUNT(CASE WHEN response_status IS NULL THEN 1 END) as pending_responses
        FROM public.tbl_purchase_order_conversation_dtl
        WHERE po_ref_no = $1
      `;
      const statsResult = await pool.query(statsQuery, [po_ref_no.trim()]);
      stats = statsResult.rows[0];
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
    console.error("Error fetching PO conversation details:", error);
    res.status(500).json({ 
      error: "Failed to fetch PO conversation details",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get Purchase Order Conversation Detail by ID (Full details)
 */
export const getPODetail3ById = async (req: Request, res: Response) => {
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
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_date,
        created_mac_address,
        modified_by,
        modified_date,
        modified_mac_address
      FROM public.tbl_purchase_order_conversation_dtl
      WHERE sno = $1
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Conversation Detail not found",
        id: id
      });
    }

    // Get previous and next conversation IDs for navigation
    const navQuery = `
      SELECT 
        (SELECT sno FROM public.tbl_purchase_order_conversation_dtl WHERE sno < $1 ORDER BY sno DESC LIMIT 1) as prev_id,
        (SELECT sno FROM public.tbl_purchase_order_conversation_dtl WHERE sno > $1 ORDER BY sno ASC LIMIT 1) as next_id
    `;
    const navResult = await pool.query(navQuery, [Number(id)]);

    res.status(200).json({
      success: true,
      data: rows[0],
      navigation: navResult.rows[0]
    });
  } catch (error) {
    console.error("Error fetching PO conversation detail by ID:", error);
    res.status(500).json({ 
      error: "Failed to fetch PO conversation detail by ID",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * UPDATE – Update Purchase Order Conversation Detail by ID
 */
export const updatePODetail3ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      respond_person,
      discussion_details,
      response_status,
      status_entry,
      remarks,
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
      respond_person, discussion_details, response_status, status_entry, remarks
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
      { field: respond_person, name: "respond_person", maxLength: 50, optional: true },
      { field: response_status, name: "response_status", maxLength: 50, optional: true },
      { field: status_entry, name: "status_entry", maxLength: 50, optional: true },
      { field: remarks, name: "remarks", maxLength: 50, optional: true },
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

    // Discussion details validation
    if (discussion_details !== undefined && discussion_details !== null) {
      if (typeof discussion_details !== 'string') {
        return res.status(400).json({
          error: "discussion_details must be a string"
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
    addField("respond_person", respond_person, true);
    addField("discussion_details", discussion_details, true);
    addField("response_status", response_status, true);
    addField("status_entry", status_entry, true);
    addField("remarks", remarks, true);
    addField("modified_by", modified_by, true);
    updateFields.push("modified_date = NOW()"); // Use PostgreSQL NOW() for consistency
    addField("modified_mac_address", modified_mac_address, true);

    // Add WHERE clause parameter
    values.push(Number(id));

    const query = `
      UPDATE public.tbl_purchase_order_conversation_dtl
      SET ${updateFields.join(', ')}
      WHERE sno = $${paramCounter}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Conversation Detail not found",
        id: id
      });
    }

    res.status(200).json({
      msg: "PO Conversation Detail updated successfully",
      data: rows[0]
    });
  } catch (error: any) {
    console.error("Error updating PO conversation detail:", error);
    
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
      error: "Failed to update PO conversation detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * DELETE – Delete Purchase Order Conversation Detail by ID
 */
export const deletePODetail3ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "Invalid ID parameter. Must be a positive number."
      });
    }

    const query = `
      DELETE FROM public.tbl_purchase_order_conversation_dtl
      WHERE sno = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "PO Conversation Detail not found",
        id: id
      });
    }

    res.status(200).json({
      msg: "PO Conversation Detail deleted successfully",
      deleted_record: {
        id: rows[0].sno,
        po_ref_no: rows[0].po_ref_no,
        respond_person: rows[0].respond_person,
        created_date: rows[0].created_date
      }
    });
  } catch (error: any) {
    console.error("Error deleting PO conversation detail:", error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Cannot delete due to existing references"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to delete PO conversation detail",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * FETCH – Get Conversation Details by PO Reference Number
 */
export const getPODetail3ByRefNo = async (req: Request, res: Response) => {
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
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_date,
        created_mac_address
      FROM public.tbl_purchase_order_conversation_dtl
      WHERE po_ref_no = $1
      ORDER BY created_date ASC
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    // Get conversation timeline and summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(DISTINCT respond_person) as unique_participants,
        MIN(created_date) as conversation_started,
        MAX(created_date) as last_message,
        STRING_AGG(DISTINCT response_status, ', ') as all_statuses
      FROM public.tbl_purchase_order_conversation_dtl
      WHERE po_ref_no = $1
    `;
    const summaryResult = await pool.query(summaryQuery, [po_ref_no.trim()]);

    res.status(200).json({
      success: true,
      count: rows.length,
      summary: summaryResult.rows[0],
      timeline: rows.map(record => ({
        id: record.sno,
        date: record.created_date,
        person: record.respond_person,
        status: record.response_status,
        preview: record.discussion_details.substring(0, 100) + (record.discussion_details.length > 100 ? '...' : '')
      })),
      data: rows
    });
  } catch (error) {
    console.error("Error fetching conversation details by reference:", error);
    res.status(500).json({ 
      error: "Failed to fetch conversation details by reference",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * FETCH – Get Latest Conversation for a PO
 */
export const getLatestPODetail3ByRefNo = async (req: Request, res: Response) => {
  try {
    const { po_ref_no } = req.params;

    if (!po_ref_no || typeof po_ref_no !== 'string' || po_ref_no.trim().length === 0) {
      return res.status(400).json({
        error: "PO reference number is required"
      });
    }

    const query = `
      SELECT 
        sno,
        po_ref_no,
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_date
      FROM public.tbl_purchase_order_conversation_dtl
      WHERE po_ref_no = $1
      ORDER BY created_date DESC
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [po_ref_no.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        msg: "No conversation found for this PO",
        po_ref_no: po_ref_no.trim()
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error("Error fetching latest conversation:", error);
    res.status(500).json({ 
      error: "Failed to fetch latest conversation",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};