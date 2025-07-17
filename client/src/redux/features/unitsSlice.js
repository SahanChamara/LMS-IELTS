import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllunits,
  getCourseId,
  getUnitById,
  getUnitByInstructorId,
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

//=======================================================================
export const getUnitByInstructorIdAPI = createAsyncThunk(
  "getUnitByInstructorIdAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUnitByInstructorId(id); // or getUnitByInstructorId
      console.log("Get Unit By ID response", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Unit Fetch Failed...");
    }
  }
);
//=======================================================================

const initialState = {
  loading: false,
  units: { allUnits: [] },
  error: null,
};

// const unitsSlice = createSlice({
//   name: "unitsSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // 🔄 Get All Units
//       .addCase(getAllUnitsAPI.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllUnitsAPI.fulfilled, (state, action) => {
//         state.loading = false;
//         // console.log("All units payload:", action.payload);
//         state.units.allUnits = action.payload;
//       })
//       .addCase(getAllUnitsAPI.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // 🔄 Get Unit(s) by Instructor ID
//       .addCase(getUnitByIdAPI.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getUnitByIdAPI.fulfilled, (state, action) => {
//         state.loading = false;
//         // console.log("Unit by ID payload:", action.payload);
//         state.units.byInstructor = action.payload;
//       })
//       .addCase(getUnitByIdAPI.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

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
      })

      //=============================================================================
      // 🔄 Get Unit(s) by Instructor ID
      .addCase(getUnitByInstructorIdAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnitByInstructorIdAPI.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Unit by ID payload:", action.payload);
        state.units.byInstructor = action.payload;
      })
      .addCase(getUnitByInstructorIdAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      //=============================================================================
  },
});

export default unitsSlice.reducer;
