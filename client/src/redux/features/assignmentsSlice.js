import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllAssignments,
  uploadAssignment,
} from "../../service/assignmentsService";

export const getAllAssignmentsAPI = createAsyncThunk(
  "getAllAsignmentsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAssignments();
      console.log("Get All Assignments Response", response);
      return response.data;
    } catch (error) {
      return rejectWithValue("Get All Asignments Failed...", error);
    }
  }
);

export const uploadAssignmentAPI = createAsyncThunk(
  "uploadAssignmentAPI",
  async (uploadAssignmentData, { rejectWithValue }) => {    
    try {
      const response = await uploadAssignment(uploadAssignmentData);
      console.log("Upload Assignment Response", response);
      return response;
    } catch (error) {
      return rejectWithValue("Upload Assignment Failed...", error);
    }
  }
);

const initialState = {
  loading: false,
  assignment: [],
  error: null,
};

const assignmentsSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAssignmentsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAssignmentsAPI.fulfilled, (state, action) => {
        state.loading = false;
        console.log("payload ", action.payload);

        state.assignment = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getAllAssignmentsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadAssignmentAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAssignmentAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = Array.isArray(state.assignment) 
          ? [...state.assignment, action.payload] 
          : [action.payload];
      })
      .addCase(uploadAssignmentAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
