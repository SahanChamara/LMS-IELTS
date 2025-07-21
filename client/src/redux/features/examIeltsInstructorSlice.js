import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createExam, getAllExams } from "../../service/examIeltsInstructorService";

const initialState = {
  examsIns: {},
  sections: {},
  questions: {},
  loading: false,
  error: null,
  currentExamId: null,
};

export const getAllExamsAPI = createAsyncThunk(
  "examIeltsInstructor/getAllExamsAPI",
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

export const createBasicExamAPI = createAsyncThunk(
  "examIeltsInstructor/createBasicExamAPI",
  async (exam, {rejectWithValue}) => {
    try{
      const response = await createExam(exam);
      if(!response.success){
        return rejectWithValue(response.message);
      }
      return response.data;
    }catch(error){
      return rejectWithValue("Failed to create basic exam",error.message);
    }
  }
);

//Helper function for section and questions
const addSectionsAndQuestions = (state, sections) => {
  if (!sections) return;
  sections.forEach((section) => {
    state.sections[section._id] = section;
    if (section.questions) {
      section.questions.forEach((question) => {
        state.questions[question._id] = question;
      });
    }
  });
};

const examIeltsInstructorSlice = createSlice({
  name: "examIeltsInstructor",
  initialState,
  reducers: {
    setCurrentExamId: (state, action) => {
      state.currentExamId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
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
          state.examsIns[exam._id] = exam;
          addSectionsAndQuestions(state,exam.sections || []);
        });
      })
      .addCase(getAllExamsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBasicExamAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBasicExamAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.examsIns[action.payload._id] = action.payload;
        state.currentExamId = action.payload._id;
      })
      .addCase(createBasicExamAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  },
});

export const { setCurrentExamId, clearError } =  examIeltsInstructorSlice.actions;
export default examIeltsInstructorSlice.reducer;
