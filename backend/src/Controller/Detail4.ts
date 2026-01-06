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
    status_master,
    created_by,
    created_mac_address,
  } = req.body;

  /* -------------------- Validate file -------------------- */
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: "File is required",
    });
  }

  const {
    originalname,
    mimetype,
    buffer,
    size,
  } = req.file;

  /* -------------------- Validate inputs -------------------- */
  if (!isNonEmptyString(po_ref_no, 50)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid PO_REF_NO",
    });
  }

  console.info(`File upload received: ${originalname}`);
  console.info(`File size: ${size} bytes`);
  console.info(`Content type: ${mimetype}`);

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
      originalname,            // FILE_NAME
      mimetype,                // CONTENT_TYPE
      buffer,                  // CONTENT_DATA (BYTEA)
      sanitizeOptionalString(status_master, 20) ?? "ACTIVE",
      sanitizeOptionalString(created_by, 50),
      sanitizeOptionalString(created_mac_address, 50),
      originalname.split(".").pop()?.toLowerCase() || null, // FILE_TYPE
    ];

    console.log(`Inserting file record for PO_REF_NO: ${po_ref_no}`);

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      success: true,
      msg: "Purchase order file uploaded successfully",
      sno: rows[0].sno,
      file: {
        name: originalname,
        type: mimetype,
        size,
      },
    });
  } catch (error: any) {
    console.error("addPODetail4Data error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to upload purchase order file",
    });
  }
};


/* ------------------------------------------------------------------ */
/* FETCH – Get All Purchase Order Files (Paginated)                    */
/* ------------------------------------------------------------------ */

export const getAllPODetail4 = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const offset = (pageNum - 1) * limitNum;

  try {
    const dataQuery = `
      SELECT
        sno,
        po_ref_no,
        description_details,
        file_name,
        content_type,
        file_type,
        status_master,
        created_by,
        created_date,
        LENGTH(content_data) AS content_size,
        ENCODE(content_data, 'base64') AS content_base64
      FROM tbl_purchase_order_files_upload
      ORDER BY created_date DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM tbl_purchase_order_files_upload
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [limitNum, offset]),
      pool.query(countQuery),
    ]);

    const dataWithDataUrl = dataResult.rows.map((row) => ({
      sno: row.sno,
      po_ref_no: row.po_ref_no,
      description_details: row.description_details,
      file_name: row.file_name,
      file_type: row.file_type,
      status_master: row.status_master,
      created_by: row.created_by,
      created_date: row.created_date,
      content_size: row.content_size,
      file_url: `data:${row.content_type};base64,${row.content_base64}`,
    }));

    const total = Number(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: dataWithDataUrl,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("getAllPODetail4 error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch purchase order files",
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