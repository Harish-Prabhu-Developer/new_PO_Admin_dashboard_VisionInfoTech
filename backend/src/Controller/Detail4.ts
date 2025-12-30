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
  } else if (typeof req.body.content_data === "string") {
    content_data = req.body.content_data;
  }

  /* -------------------- Input Validation -------------------- */

  if (
    !isNonEmptyString(po_ref_no, 50) ||
    !isNonEmptyString(file_name, 150) ||
    !content_data
  ) {
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

    const { rows } = await pool.query(query, values);

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
        FILE_TYPE
      FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      ORDER BY CREATED_DATE DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
    `;

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, [limitNum, offset]),
      pool.query(countQuery)
    ]);

    const total = Number(countResult.rows[0].count);

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
      SELECT *
      FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      WHERE SNO = $1
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
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
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found",
      });
    }

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

  try {
    const query = `
      DELETE FROM TBL_PURCHASE_ORDER_FILES_UPLOAD
      WHERE SNO = $1
      RETURNING SNO
    `;

    const { rowCount } = await pool.query(query, [id]);

    if (!rowCount) {
      return res.status(404).json({
        success: false,
        msg: "Purchase order file not found"
      });
    }

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
