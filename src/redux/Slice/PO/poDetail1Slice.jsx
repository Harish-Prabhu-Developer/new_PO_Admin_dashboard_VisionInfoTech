// Slice/PO/poDetail1Slice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";



// Create PO Detail 1
export const createPODetail1 = createAsyncThunk(
  "poDetail1/create",
  async (detailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1`,
        detailData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Failed to create PO detail");
    }
  }
);

// Get all PO Details 1
export const fetchPODetails1 = createAsyncThunk(
  "poDetail1/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1?page=${page}&limit=${limit}`,
          
      );
      console.log("PO Details 1 fetch Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 1 fetch Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 1");
    }
  }
);

// Get PO Details 1 by reference number
export const fetchPODetails1ByRef = createAsyncThunk(
  "poDetail1/fetchByRef",
  async (poRefNo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1/ref/${poRefNo}`,
          
      );
      console.log("PO Details 1 fetch by ref Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 1 fetch by ref Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 1");
    }
  }
);

// Get PO Detail 1 by ID
export const fetchPODetail1ById = createAsyncThunk(
  "poDetail1/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1/${id}`,
          
      );
      console.log("PO Detail 1 fetch by ID Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 1 fetch by ID Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO detail 1");
    }
  }
);

// Update PO Detail 1
export const updatePODetail1 = createAsyncThunk(
  "poDetail1/update",
  async ({ id, detailData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1/${id}`,
        detailData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Failed to update PO detail");
    }
  }
);
// Delete PO Detail 1
export const deletePODetail1 = createAsyncThunk(
  "poDetail1/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/detail1/po-details1/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "Failed to delete PO detail");
    }
  }
);

// PO Detail 1 Slice
const poDetail1Slice = createSlice({
  name: "poDetail1",
  initialState: {
    details: [],
    detail: null,
    detailsByRef: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    },
    status: "idle",
    error: null,
  },
  reducers: {
    clearDetail1: (state) => {
      state.detail = null;
      state.detailsByRef = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create PO Detail 1
      .addCase(createPODetail1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPODetail1.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.data) {
          state.details = [action.payload.data, ...state.details];
        }
      })
      .addCase(createPODetail1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch All PO Details 1
      .addCase(fetchPODetails1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails1.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.pages = Math.ceil(action.payload.total / state.pagination.limit);
        }
      })
      .addCase(fetchPODetails1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Details 1 by Ref
      .addCase(fetchPODetails1ByRef.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails1ByRef.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detailsByRef = action.payload.data || [];
      })
      .addCase(fetchPODetails1ByRef.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Detail 1 by ID
      .addCase(fetchPODetail1ById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetail1ById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload.data || null;
      })
      .addCase(fetchPODetail1ById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update PO Detail 1
      .addCase(updatePODetail1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePODetail1.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.details.findIndex((detail) => detail.id === action.meta.arg.id);
        if (index !== -1 && action.payload.data) {
          state.details[index] = action.payload.data;
        }
        if (state.detail && state.detail.id === action.meta.arg.id) {
          state.detail = { ...state.detail, ...action.payload.data };
        }
      })
      .addCase(updatePODetail1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete PO Detail 1
      .addCase(deletePODetail1.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePODetail1.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = state.details.filter((detail) => detail.id !== action.meta.arg);
        if (state.detail && state.detail.id === action.meta.arg) {
          state.detail = null;
        }
      })
      .addCase(deletePODetail1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearDetail1, clearError } = poDetail1Slice.actions;
export default poDetail1Slice.reducer;