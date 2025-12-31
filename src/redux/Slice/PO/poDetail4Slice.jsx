// Slice/PO/poDetail4Slice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";



// Create PO Detail 4 (File Upload)
export const createPODetail4 = createAsyncThunk(
  "poDetail4/create",
  async (fileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(fileData).forEach(key => {
        formData.append(key, fileData[key]);
      });
      
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log("PO Detail 4 create Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 4 create Error:", error);
      return rejectWithValue(error.response?.data?.msg || error.response?.data?.error || "Failed to upload PO file");
    }
  }
);

// Get all PO Details 4
export const fetchPODetails4 = createAsyncThunk(
  "poDetail4/fetchAll",
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4?page=${page}&limit=${limit}`,
      );
      console.log("PO Details 4 fetch Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Details 4 fetch Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO files");
    }
  }
);

// Get PO Detail 4 by ID
export const fetchPODetail4ById = createAsyncThunk(
  "poDetail4/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${id}`,
      );
      console.log("PO Detail 4 fetch by ID Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 4 fetch by ID Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO file");
    }
  }
);

// Update PO Detail 4 Metadata
export const updatePODetail4 = createAsyncThunk(
  "poDetail4/update",
  async ({ id, metadata }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${id}`,
        metadata,
      );
      console.log("PO Detail 4 update Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 4 update Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to update PO file");
    }
  }
);

// Delete PO Detail 4
export const deletePODetail4 = createAsyncThunk(
  "poDetail4/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/detail4/po-details4/${id}`,
      );
      console.log("PO Detail 4 delete Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Detail 4 delete Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to delete PO file");
    }
  }
);

// PO Detail 4 Slice
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
    error: null,
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
      // Create PO Detail 4
      .addCase(createPODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.success && action.payload.data) {
          state.files = [action.payload.data, ...state.files];
        }
      })
      .addCase(createPODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch All PO Details 4
      .addCase(fetchPODetails4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetails4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.success) {
          state.files = action.payload.data || [];
          if (action.payload.pagination) {
            state.pagination = {
              ...state.pagination,
              ...action.payload.pagination
            };
          }
        }
      })
      .addCase(fetchPODetails4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Detail 4 by ID
      .addCase(fetchPODetail4ById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPODetail4ById.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.success) {
          state.file = action.payload.data || null;
        }
      })
      .addCase(fetchPODetail4ById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update PO Detail 4
      .addCase(updatePODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.success) {
          const index = state.files.findIndex((file) => file.sno === action.meta.arg.id);
          if (index !== -1 && action.payload.data) {
            state.files[index] = action.payload.data;
          }
          if (state.file && state.file.sno === action.meta.arg.id) {
            state.file = { ...state.file, ...action.payload.data };
          }
        }
      })
      .addCase(updatePODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete PO Detail 4
      .addCase(deletePODetail4.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePODetail4.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.success) {
          state.files = state.files.filter((file) => file.sno !== action.meta.arg);
          if (state.file && state.file.sno === action.meta.arg) {
            state.file = null;
          }
        }
      })
      .addCase(deletePODetail4.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearFile, clearError } = poDetail4Slice.actions;
export default poDetail4Slice.reducer;