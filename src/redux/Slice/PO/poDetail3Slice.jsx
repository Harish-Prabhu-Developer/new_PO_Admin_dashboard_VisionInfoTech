// Slice/PO/poDetail3Slice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";



// Create PO Detail 3
export const createPODetail3 = createAsyncThunk(
  "poDetail3/create",
  async (detailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3`,
        detailData
      );
      console.log("PO Detail 3 create Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 3 create Error:", error);
      return rejectWithValue(error.response?.data?.msg || error.response?.data?.error || "Failed to create PO detail 3");
    }
  }
);

// Get all PO Details 3
export const fetchPODetails3 = createAsyncThunk(
  "poDetail3/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3?page=${page}&limit=${limit}`,
        
      );
      console.log("PO Details 3 fetch Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 3 fetch Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 3");
    }
  }
);

// Get PO Details 3 by reference number
export const fetchPODetails3ByRef = createAsyncThunk(
  "poDetail3/fetchByRef",
  async (poRefNo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3/ref/${poRefNo}`,
        
      );
      console.log("PO Details 3 fetch by ref Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 3 fetch by ref Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 3");
    }
  }
);

// Get PO Detail 3 by ID
export const fetchPODetail3ById = createAsyncThunk(
  "poDetail3/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3/${id}`,
        
      );
      console.log("PO Detail 3 fetch by ID Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 3 fetch by ID Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO detail 3");
    }
  }
);

// Update PO Detail 3
export const updatePODetail3 = createAsyncThunk(
  "poDetail3/update",
  async ({ id, detailData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3/${id}`,
        detailData,
        
      );
      console.log("PO Detail 3 update Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 3 update Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to update PO detail 3");
    }
  }
);

// Delete PO Detail 3
export const deletePODetail3 = createAsyncThunk(
  "poDetail3/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/detail3/po-details3/${id}`,
        
      );
      console.log("PO Detail 3 delete Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 3 delete Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to delete PO detail 3");
    }
  }
);

// PO Detail 3 Slice
const poDetail3Slice = createSlice({
  name: "poDetail3",
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
    clearDetail3: (state) => {
      state.detail = null;
      state.detailsByRef = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create PO Detail 3
      .addCase(createPODetail3.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPODetail3.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.data) {
          state.details = [action.payload.data, ...state.details];
        }
      })
      .addCase(createPODetail3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch All PO Details 3
      .addCase(fetchPODetails3.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails3.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.pages = Math.ceil(action.payload.total / state.pagination.limit);
        }
      })
      .addCase(fetchPODetails3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Details 3 by Ref
      .addCase(fetchPODetails3ByRef.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails3ByRef.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detailsByRef = action.payload.data || [];
      })
      .addCase(fetchPODetails3ByRef.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Detail 3 by ID
      .addCase(fetchPODetail3ById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetail3ById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload.data || null;
      })
      .addCase(fetchPODetail3ById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update PO Detail 3
      .addCase(updatePODetail3.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePODetail3.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.details.findIndex((detail) => detail.id === action.meta.arg.id);
        if (index !== -1 && action.payload.data) {
          state.details[index] = action.payload.data;
        }
        if (state.detail && state.detail.id === action.meta.arg.id) {
          state.detail = { ...state.detail, ...action.payload.data };
        }
      })
      .addCase(updatePODetail3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete PO Detail 3
      .addCase(deletePODetail3.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePODetail3.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = state.details.filter((detail) => detail.id !== action.meta.arg);
        if (state.detail && state.detail.id === action.meta.arg) {
          state.detail = null;
        }
      })
      .addCase(deletePODetail3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearDetail3, clearError } = poDetail3Slice.actions;
export default poDetail3Slice.reducer;