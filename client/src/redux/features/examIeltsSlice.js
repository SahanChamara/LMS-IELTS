import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllPublishedExam,
  getexamById,
} from "../../service/examIeltsService";

// Create Asynk thunks
export const  getAllPublishedExamsAPI = createAsyncThunk(
  "exam/getAllPublishedExamsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPublishedExam();
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Get All Published Exam Failed...", error.message);
    }
  }
);

export const getExamByIdAPI = createAsyncThunk(
  "exam/getExamByIdAPI",
  async (examId, { rejectWithValue }) => {
    try {
      const response = await getexamById(examId);
      console.log("Get ExamBy ID API Response", response);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Get Exam By Id Failed...", error.message);
    }
  }
);

const initialState = {
  exams: {},
  sections: {},
  questions: {},
  loading: false,
  error: null,
  currentExam: null,
};

// Helper function to add sections to state
function addSectionsToState(state, sections) {
  if (!sections) return;
  sections.forEach((section) => {
    state.sections[section._id] = section;
    if (section.questions) {
      section.questions.forEach((question) => {
        state.questions[question._id] = question;
      });
    }
  });
}

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPublishedExamsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPublishedExamsAPI.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((exam) => {
          state.exams[exam._id] = exam;          
          addSectionsToState(state, exam.sections);
        });
      })
      .addCase(getAllPublishedExamsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(getExamByIdAPI.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getExamByIdAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload;
      })
      .addCase(getExamByIdAPI.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { clearCurrentExam } = examSlice.actions;
export default examSlice.reducer;
