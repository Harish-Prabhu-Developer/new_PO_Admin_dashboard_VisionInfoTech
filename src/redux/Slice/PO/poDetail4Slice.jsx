import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";

/* ------------------------------------------------------------------ */
/* Create PO Detail 4 (File Upload)                                    */
/* ------------------------------------------------------------------ */
export const createPODetail4 = createAsyncThunk(
  "poDetail4/create",
  async (fileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.entries(fileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to upload purchase order file"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* Fetch All PO Detail 4                                               */
/* ------------------------------------------------------------------ */
export const fetchPODetails4 = createAsyncThunk(
  "poDetail4/fetchAll",
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4`,
        { params: { page, limit } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch purchase order files"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* Fetch PO Detail 4 By SNO                                            */
/* ------------------------------------------------------------------ */
export const fetchPODetail4ById = createAsyncThunk(
  "poDetail4/fetchById",
  async (sno, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${sno}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch purchase order file"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* Update PO Detail 4 Metadata                                         */
/* ------------------------------------------------------------------ */
export const updatePODetail4 = createAsyncThunk(
  "poDetail4/update",
  async ({ sno, metadata }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${sno}`,
        metadata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update purchase order file"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* Delete PO Detail 4                                                  */
/* ------------------------------------------------------------------ */
export const deletePODetail4 = createAsyncThunk(
  "poDetail4/delete",
  async (sno, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${sno}`
      );

      return { ...response.data, sno };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete purchase order file"
      );
    }
  }
);

/* ------------------------------------------------------------------ */
/* Slice                                                              */
/* ------------------------------------------------------------------ */
const poDetail4Slice = createSlice({
  name: "poDetail4",
  initialState: {
    files: [],
    file: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      pages: 0
    },
    status: "idle",
    error: null
  },
  reducers: {
    clearFile: (state) => {
      state.file = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- Create ---------------- */
      .addCase(createPODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.success && action.payload.data) {
          state.files.unshift(action.payload.data);
        }
      })
      .addCase(createPODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ---------------- Fetch All ---------------- */
      .addCase(fetchPODetails4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.success) {
          state.files = action.payload.data || [];
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination
          };
        }
      })
      .addCase(fetchPODetails4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ---------------- Fetch By ID ---------------- */
      .addCase(fetchPODetail4ById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetail4ById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.file = action.payload?.success ? action.payload.data : null;
      })
      .addCase(fetchPODetail4ById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ---------------- Update ---------------- */
      .addCase(updatePODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload?.success && action.payload.data) {
          const idx = state.files.findIndex(
            (f) => f.sno === action.payload.data.sno
          );

          if (idx !== -1) state.files[idx] = action.payload.data;

          if (state.file?.sno === action.payload.data.sno) {
            state.file = action.payload.data;
          }
        }
      })
      .addCase(updatePODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ---------------- Delete ---------------- */
      .addCase(deletePODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.success) {
          state.files = state.files.filter(
            (file) => file.sno !== action.payload.sno
          );
          if (state.file?.sno === action.payload.sno) {
            state.file = null;
          }
        }
      })
      .addCase(deletePODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearFile, clearError } = poDetail4Slice.actions;
export default poDetail4Slice.reducer;
