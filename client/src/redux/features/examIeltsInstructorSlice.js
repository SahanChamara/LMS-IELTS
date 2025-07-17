import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllExams } from "../../service/examIeltsInstructorService";

const initialState = {
  exams: {},
  sections: {},
  questions: {},
  loading: false,
  error: null,
  currentExamId: null,
};

export const getAllExamsAPI = createAsyncThunk(
  "examInstructor/getAllExamsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllExams();
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to Get All Exams", error.message);
    }
  }
);

const examIeltsInstructorSlice = createSlice({
  name: "examInstructor",
  initialState,
  reducers: {
    setCurrentExamId: (state, action) => {
      state.currentExamId = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(getAllExamsAPI.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllExamsAPI.fulfilled, (state, action) => {
            state.loading = false;
            action.payload.forEach((exam) => {
                
            })
        })
  }
});
