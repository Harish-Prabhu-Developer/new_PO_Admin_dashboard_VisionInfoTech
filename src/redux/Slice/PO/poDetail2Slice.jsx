// Slice/PO/poDetail2Slice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";


// Create PO Detail 2
export const createPODetail2 = createAsyncThunk(
  "poDetail2/create",
  async (detailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2`,
        detailData,
          
      );
      console.log("PO Detail 2 create Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 2 create Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to create PO detail 2");
    }
  }
);

// Get all PO Details 2
export const fetchPODetails2 = createAsyncThunk(
  "poDetail2/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2?page=${page}&limit=${limit}`,
          
      );
      console.log("PO Details 2 fetch Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 2 fetch Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 2");
    }
  }
);

// Get PO Details 2 by reference number
export const fetchPODetails2ByRef = createAsyncThunk(
  "poDetail2/fetchByRef",
  async (poRefNo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2/ref/${poRefNo}`,
          
      );
      console.log("PO Details 2 fetch by ref Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 2 fetch by ref Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO details 2");
    }
  }
);

// Get PO Detail 2 by ID
export const fetchPODetail2ById = createAsyncThunk(
  "poDetail2/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2/${id}`,
          
      );
      console.log("PO Detail 2 fetch by ID Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 2 fetch by ID Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO detail 2");
    }
  }
);

// Update PO Detail 2
export const updatePODetail2 = createAsyncThunk(
  "poDetail2/update",
  async ({ id, detailData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2/${id}`,
        detailData,
          
      );
      console.log("PO Detail 2 update Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 2 update Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to update PO detail 2");
    }
  }
);

// Delete PO Detail 2
export const deletePODetail2 = createAsyncThunk(
  "poDetail2/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/detail2/po-details2/${id}`,
          
      );
      console.log("PO Detail 2 delete Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 2 delete Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to delete PO detail 2");
    }
  }
);

// PO Detail 2 Slice
const poDetail2Slice = createSlice({
  name: "poDetail2",
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
    clearDetail2: (state) => {
      state.detail = null;
      state.detailsByRef = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create PO Detail 2
      .addCase(createPODetail2.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPODetail2.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.data) {
          state.details = [action.payload.data, ...state.details];
        }
      })
      .addCase(createPODetail2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch All PO Details 2
      .addCase(fetchPODetails2.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails2.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.pages = Math.ceil(action.payload.total / state.pagination.limit);
        }
      })
      .addCase(fetchPODetails2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Details 2 by Ref
      .addCase(fetchPODetails2ByRef.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails2ByRef.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detailsByRef = action.payload.data || [];
      })
      .addCase(fetchPODetails2ByRef.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Detail 2 by ID
      .addCase(fetchPODetail2ById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetail2ById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload.data || null;
      })
      .addCase(fetchPODetail2ById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update PO Detail 2
      .addCase(updatePODetail2.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePODetail2.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.details.findIndex((detail) => detail.id === action.meta.arg.id);
        if (index !== -1 && action.payload.data) {
          state.details[index] = action.payload.data;
        }
        if (state.detail && state.detail.id === action.meta.arg.id) {
          state.detail = { ...state.detail, ...action.payload.data };
        }
      })
      .addCase(updatePODetail2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete PO Detail 2
      .addCase(deletePODetail2.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePODetail2.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = state.details.filter((detail) => detail.id !== action.meta.arg);
        if (state.detail && state.detail.id === action.meta.arg) {
          state.detail = null;
        }
      })
      .addCase(deletePODetail2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearDetail2, clearError } = poDetail2Slice.actions;
export default poDetail2Slice.reducer;