// src/Controller/Detail4.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

/* ------------------------------------------------------------------ */
/* Validation Helpers                                                  */
/* ------------------------------------------------------------------ */

const isNonEmptyString = (val: unknown, max = 255): val is string =>
  typeof val === "string" && val.trim().length > 0 && val.length <= max;

const sanitizeOptionalString = (val: unknown, max = 255): string | null =>
  typeof val === "string" && val.trim().length > 0 && val.length <= max
    ? val.trim()
    : null;

/* ------------------------------------------------------------------ */
/* CREATE – Add Purchase Order File Upload                             */
/* ------------------------------------------------------------------ */

export const addPODetail4Data = async (req: Request, res: Response) => {
  const {
    po_ref_no,
    description_details,
    file_name,
    content_type,
    status_master,
    created_by,
    created_mac_address,
    file_type
  } = req.body;

  // Convert Buffer from multer to base64 string
  let content_data: string | null = null;
  
  if (req.file?.buffer) {
    content_data = req.file.buffer.toString("base64");
    console.info(`File upload received: ${file_name}`);
    console.info(`File size: ${req.file.size} bytes`);
    console.info(`Base64 preview: ${content_data.substring(0, 100)}...`);
    console.info(`Base64 length: ${content_data.length} characters`);
  } else if (req.body.content_data && typeof req.body.content_data === "string") {
    content_data = req.body.content_data;
    console.log("file name : ",content_data);
    
    // console.info(`Base64 string received: ${content_data.substring(0, 100)||"empty"}...`);
    // console.info(`Base64 length: ${content_data.length||0} characters`);
  } else {
    console.warn("No file or content_data provided");
  }

  /* -------------------- Input Validation -------------------- */

  if (
    !isNonEmptyString(po_ref_no, 50) ||
    !isNonEmptyString(file_name, 150) ||
    !content_data
  ) {
    console.error("Validation failed - missing required fields");
    return res.status(400).json({
      success: false,
      msg: "Invalid or missing required fields"
    });
  }

  try {
    const query = `
      INSERT INTO TBL_PURCHASE_ORDER_FILES_UPLOAD (
        PO_REF_NO,
        DESCRIPTION_DETAILS,
        FILE_NAME,
        CONTENT_TYPE,
        CONTENT_DATA,
        STATUS_MASTER,
        CREATED_BY,
        CREATED_DATE,
        CREATED_MAC_ADDRESS,
        FILE_TYPE
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8,$9)
      RETURNING SNO
    `;

    const values = [
      po_ref_no.trim(),
      sanitizeOptionalString(description_details, 100),
      file_name.trim(),
      sanitizeOptionalString(content_type, 50) || "application/octet-stream",
      content_data, // Stored as base64 string
      sanitizeOptionalString(status_master, 20) ?? "ACTIVE",
      sanitizeOptionalString(created_by, 50),
      sanitizeOptionalString(created_mac_address, 50),
      sanitizeOptionalString(file_type, 50)
    ];

    console.log(`Inserting file record for PO_REF_NO: ${po_ref_no}`);
    console.log(`Content type: ${values[3]}`);
    console.log(`File type: ${values[8]}`);

    const { rows } = await pool.query(query, values);

    console.info(`File uploaded successfully with SNO: ${rows[0].sno}`);

    res.status(201).json({
      success: true,
      msg: "Purchase order file uploaded successfully",
      sno: rows[0].sno
    });
  } catch (error: any) {
    console.error("addPODetail4Data error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to upload purchase order file"
    });
  }
};

/* ------------------------------------------------------------------ */
/* FETCH – Get All Purchase Order Files (Paginated)                    */
/* ------------------------------------------------------------------ */

export const getAllPODetail4 = async (req: Request, res: Response) => {
  const { 
    page = 1,
    limit = 50,
  } = req.query;

  /* ---- FIX: normalize & protect pagination values ---- */
  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const offset = (pageNum - 1) * limitNum;

  try {
    const dataQuery = `
      SELECT
        SNO,
        PO_REF_NO,
        DESCRIPTION_DETAILS,
        FILE_NAME,
        CONTENT_TYPE,
        STATUS_MASTER,
        CREATED_BY,
        CREATED_DATE,
        FILE_TYPE,
        LENGTH(CONTENT_DATA) as content_size
      FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      ORDER BY CREATED_DATE DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
    `;

    console.log(`Fetching files - page: ${pageNum}, limit: ${limitNum}`);

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [limitNum, offset]),
      pool.query(countQuery)
    ]);

    const total = Number(countResult.rows[0].count);
    
    console.log(`Found ${total} total files, returning ${dataResult.rows.length} files`);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("getAllPODetail4 error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch purchase order files"
    });
  }
};


/* ------------------------------------------------------------------ */
/* FETCH – Get Purchase Order File by ID (Includes base64 content)     */
/* ------------------------------------------------------------------ */

export const getPODetail4ById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Invalid file ID"
    });
  }

  try {
    const query = `
      SELECT 
        SNO,
        PO_REF_NO,
        DESCRIPTION_DETAILS,
        FILE_NAME,
        CONTENT_TYPE,
        CONTENT_DATA,
        STATUS_MASTER,
        CREATED_BY,
        CREATED_DATE,
        FILE_TYPE,
        LENGTH(CONTENT_DATA) as content_size
      FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      WHERE SNO = $1
    `;

    console.log(`Fetching file with ID: ${id}`);
    
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      console.warn(`File with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found"
      });
    }

    const fileData = rows[0];
    
    // Log file details without exposing full base64 content
    console.info(`File retrieved: ${fileData.file_name}`);
    console.info(`Content size: ${fileData.content_size} characters`);
    console.info(`Content type: ${fileData.content_type}`);
    
    // Optional: Show first 50 chars of base64 for debugging
    if (fileData.content_data) {
      console.info(`Base64 preview: ${fileData.content_data.substring(0, 50)}...`);
    }

    res.status(200).json({
      success: true,
      data: fileData
    });
  } catch (error: any) {
    console.error("getPODetail4ById error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch purchase order file"
    });
  }
};

/* ------------------------------------------------------------------ */
/* UPDATE – Update Purchase Order File by ID                           */
/* ------------------------------------------------------------------ */

export const updatePODetail4ById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID",
    });
  }

  const {
    PO_REF_NO,
    DESCRIPTION_DETAILS,
    STATUS_MASTER,
    FILE_TYPE,
    UPDATED_BY,
  } = req.body;

  console.log(`Updating file with ID: ${id}`);
  console.log(`Update data:`, { PO_REF_NO, STATUS_MASTER, FILE_TYPE, UPDATED_BY });

  try {
    const updateQuery = `
      UPDATE TBL_PURCHASE_ORDER_FILES_UPLOAD
      SET
        PO_REF_NO = COALESCE($1, PO_REF_NO),
        DESCRIPTION_DETAILS = COALESCE($2, DESCRIPTION_DETAILS),
        STATUS_MASTER = COALESCE($3, STATUS_MASTER),
        FILE_TYPE = COALESCE($4, FILE_TYPE),
        UPDATED_BY = $5,
        UPDATED_DATE = NOW()
      WHERE SNO = $6
      RETURNING *
    `;

    const values = [
      PO_REF_NO || null,
      DESCRIPTION_DETAILS || null,
      STATUS_MASTER || null,
      FILE_TYPE || null,
      UPDATED_BY,
      id,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      console.warn(`File with ID ${id} not found for update`);
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found",
      });
    }

    console.info(`File with ID ${id} updated successfully`);

    res.status(200).json({
      success: true,
      msg: "Purchase order file updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("updatePODetail4ById error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to update purchase order file",
    });
  }
};


/* ------------------------------------------------------------------ */
/* DELETE – Delete Purchase Order File by ID                            */
/* ------------------------------------------------------------------ */

export const deletePODetail4ById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Invalid file ID"
    });
  }

  console.log(`Deleting file with ID: ${id}`);

  try {
    const query = `
      DELETE FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      WHERE SNO = $1
      RETURNING SNO, FILE_NAME
    `;

    const { rows, rowCount } = await pool.query(query, [id]);

    if (!rowCount) {
      console.warn(`File with ID ${id} not found for deletion`);
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found"
      });
    }

    console.info(`File deleted: ${rows[0].file_name} (SNO: ${rows[0].sno})`);

    res.status(200).json({
      success: true,
      msg: "Purchase order file deleted successfully"
    });
  } catch (error: any) {
    console.error("deletePODetail4ById error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to delete purchase order file"
    });
  }
};