import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllAssignments } from "../../service/assignmentsService";

export const getAllAssignmentsAPI = createAsyncThunk(
  "getAllAsignmentsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAssignments();
      console.log("Get All Assignments Response", response);
      return response;
    } catch (error) {
      return rejectWithValue("Get All Asignments Failed...", error);
    }
  }
);

const initialState = {
  loading: false,
  assignment: [],
  error: null,
};

const assignmentsSlice = createSlice({
  name: "assignmentsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAssignmentsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAssignmentsAPI.fulfilled, (state, action) => {
        state.loading = false;
        console.log("payload ",action.payload);
        
        state.assignment = action.payload.data;
      })
      .addCase(getAllAssignmentsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentsSlice.reducer;
