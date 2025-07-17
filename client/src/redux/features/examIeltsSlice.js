import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllPublishedExam } from "../../service/examIeltsService";

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
      });
  },
});

export const {clearCurrentExam} = examSlice.actions;
export default examSlice.reducer;
