import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSubmission,
  getSubmissionById,
  gradeSubmission,
  updateSubmission,
} from "../../service/examIeltsSubmissionService";

const initialState = {
  submission: {},
  currentSubmissionId: null,
  loading: false,
  error: null,
  success: false,
};

export const createSubmissionAPI = createAsyncThunk(
  "examIeltsSubmission/createSubmissionAPI",
  async (submission, { rejectWithValue }) => {
    try {
      const response = await createSubmission(submission);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      console.log("Create Submission API Rrespone", response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Create Submission Failed...", error.message);
    }
  }
);

export const updateSubmissionAPI = createAsyncThunk(
  `examIeltsSubmission/updateSubmissionAPI`,
  async ({id, updates}, { rejectWithValue }) => {
    try {
      const response = await updateSubmission(id, updates);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Update Submission Failed...", error.message);
    }
  }
);

export const getSubmissionByIdAPI = createAsyncThunk(
  `examIeltsSubmission/getSubmissionByIdAPI`,
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await getSubmissionById(submissionId);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Get Submission By ID Failed...", error.message);
    }
  }
);

export const gradeSubmissionAPI = createAsyncThunk(
  `examIeltsSubmission/gradeSubmissionAPI`,
  async (submissionId, grade, { rejectWithValue }) => {
    try {
      const response = await gradeSubmission(submissionId, grade);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Grade Submission Failed", error.message);
    }
  }
);

const examIeltsSubmissionSlice = createSlice({
  name: "examIeltsSubmission",
  initialState,
  reducers: {
    setCurrentSubmissionId(state, action) {
      state.currentSubmissionId = action.payload;
    },
    resetState(state) {
      Object.assign(state.initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubmissionAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubmissionAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submission[action.payload._id] = action.payload;
        state.currentSubmissionId = action.payload._id;
      })
      .addCase(createSubmissionAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSubmissionAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubmissionAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submission[action.payload._id] = action.payload;
      })
      .addCase(updateSubmissionAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubmissionByIdAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getSubmissionByIdAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submission[action.payload._id] = action.payload;
        state.currentSubmissionId = action.payload._id;
      })
      .addCase(getSubmissionByIdAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(gradeSubmissionAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(gradeSubmissionAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submission[action.payload._id] = action.payload;
      })
      .addCase(gradeSubmissionAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentSubmissionId, resetState } = examIeltsSubmissionSlice.actions;
export default examIeltsSubmissionSlice.reducer;
