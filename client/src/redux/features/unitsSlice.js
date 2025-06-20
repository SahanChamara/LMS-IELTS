import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllunits,
  getCourseId,
  getUnitById,
} from "../../service/unitsService";

// Get All Units
export const getAllUnitsAPI = createAsyncThunk(
  "getAllUnitsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllunits();
      console.log("Get All Units Response ->>", response);
      return response;
    } catch (error) {
      return rejectWithValue("All Units Fetch Failed...", error);
    }
  }
);

// Get coruse ID
export const getCourseIdAPI = createAsyncThunk(
  "getCourseIdAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCourseId();
      console.log("Get Course ID Respone ->>", response);
      return response;
    } catch (error) {
      return rejectWithValue("Course ID Fetch Failed...", error);
    }
  }
);

// Get Unit By ID
export const getUnitBytIdAPI = createAsyncThunk(
  "getUnitByIdAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUnitById(id);
      console.log("Get Unit By ID response", response);
      return response;
    } catch (error) {
      return rejectWithValue("Unit Fetch By ID Failed...", error);
    }
  }
);



const initialState = {
  loading: false,
  units: { allUnits: [] },
  error: null,
};

const unitsSlice = createSlice({
  name: "unitsSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUnitsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUnitsAPI.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.units = action.payload;
      })
      .addCase(getAllUnitsAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default unitsSlice.reducer;
