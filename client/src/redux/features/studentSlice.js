import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllStudents,
  getStudentProfile,
} from "../../service/studentService";

export const getStudentDetailsAPI = createAsyncThunk(
  "student/getStudentDetailsAPI",
  async (userId, { rejectWithValue }) => {
    try {
      console.log(userId);
      const response = await getStudentProfile(userId);

      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to fetch student details"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch student details"
      );
    }
  }
);

// ========================================================================
export const getAllStudentsAPI = createAsyncThunk(
  "student/getAllStudentsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStudents();
      // console.log("Get All Students Response ->>", response);
      return response;
    } catch (error) {
      return rejectWithValue("All Students Fetch Failed...", error);
    }
  }
);
// ========================================================================

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
      })

      //=============================================================================
      // 🔄 Get Students
      .addCase(getAllStudentsAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllStudentsAPI.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Students Slice :", action.payload);
        // state.units.byInstructor = action.payload;
        state.student = action.payload;
      })
      .addCase(getAllStudentsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //=============================================================================
  },
});

export default studentSlice.reducer;
