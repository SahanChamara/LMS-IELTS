import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStudentProfile } from "../../service/studentService";

export const getStudentDetailsAPI = createAsyncThunk(
  "student/getStudentDetailsAPI",
  async (userId, { rejectWithValue }) => {
    try {
        console.log(userId)
      const response = await getStudentProfile(userId);
      
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to fetch student details");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch student details");
    }
  }
);

const initialState = {
  student: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "studentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDetailsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentDetailsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
        state.error = null;
      })
      .addCase(getStudentDetailsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student details";
      });
  },
});

export default studentSlice.reducer;