// Slice/PO/poHeaderSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../../Config";


// Create PO Header
export const createPOHeader = createAsyncThunk(
  "poHeader/create",
  async (headerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/v1/po/header/po-headers`,
        headerData
      );
      console.log("PO Header create Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Header create Error:", error);
      return rejectWithValue(error.response?.data?.msg || error.response?.data?.error || "Failed to create PO header");
    }
  }
);

// Get all PO Headers
export const fetchPOHeaders = createAsyncThunk(
  "poHeader/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/header/po-headers?page=${page}&limit=${limit}`,
         
      );
      console.log("PO Headers fetch Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Headers fetch Error:", error);
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch PO headers");
    }
  }
);

// Get PO Header by reference number
export const fetchPOHeaderByRef = createAsyncThunk(
  "poHeader/fetchByRef",
  async (poRefNo, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/v1/po/header/po-headers/${poRefNo}`
      );
      console.log("PO Header fetch by ref Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Header fetch by ref Error:", error.message);
      return rejectWithValue(error.response?.data?.msg || error.response?.data?.error || "Failed to fetch PO header");
    }
  }
);

// Update PO Header
export const updatePOHeader = createAsyncThunk(
  "poHeader/update",
  async ({ poRefNo, headerData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/v1/po/header/po-headers/${poRefNo}`,
        headerData,
         
      );
      console.log("PO Header update Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Header update Error:", error.message);
      return rejectWithValue(error.response?.data?.msg || "Failed to update PO header");
    }
  }
);

// Delete PO Header
export const deletePOHeader = createAsyncThunk(
  "poHeader/delete",
  async (poRefNo, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${CONFIG.BASE_URL}/api/v1/po/header/po-headers/${poRefNo}`,
        
      );
      console.log("PO Header delete Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("PO Header delete Error:", error.message);
      return rejectWithValue(error.response?.data?.msg || "Failed to delete PO header");
    }
  }
);

// PO Header Slice
const poHeaderSlice = createSlice({
  name: "poHeader",
  initialState: {
    headers: [],
    header: null,
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
    clearHeader: (state) => {
      state.header = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create PO Header
      .addCase(createPOHeader.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPOHeader.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.data) {
          state.headers = [action.payload.data, ...state.headers];
        }
      })
      .addCase(createPOHeader.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch All PO Headers
      .addCase(fetchPOHeaders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPOHeaders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.headers = action.payload.data || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.pages = Math.ceil(action.payload.total / state.pagination.limit);
        }
      })
      .addCase(fetchPOHeaders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch PO Header by Ref
      .addCase(fetchPOHeaderByRef.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPOHeaderByRef.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.header = action.payload.data || null;
      })
      .addCase(fetchPOHeaderByRef.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update PO Header
      .addCase(updatePOHeader.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePOHeader.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.headers.findIndex((header) => header.po_ref_no === action.meta.arg.poRefNo);
        if (index !== -1 && action.payload.data) {
          state.headers[index] = action.payload.data;
        }
        if (state.header && state.header.po_ref_no === action.meta.arg.poRefNo) {
          state.header = { ...state.header, ...action.payload.data };
        }
      })
      .addCase(updatePOHeader.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete PO Header
      .addCase(deletePOHeader.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePOHeader.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.headers = state.headers.filter((header) => header.po_ref_no !== action.meta.arg);
        if (state.header && state.header.po_ref_no === action.meta.arg) {
          state.header = null;
        }
      })
      .addCase(deletePOHeader.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearHeader, clearError } = poHeaderSlice.actions;
export default poHeaderSlice.reducer;