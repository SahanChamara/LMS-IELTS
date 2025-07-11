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
      return response.data;
    } catch (error) {
      return rejectWithValue("Create Submission Failed...", error.message);
    }
  }
);

export const updateSubmissionAPI = createAsyncThunk(
  `examIeltsSubmission/updateSubmissionAPI`,
  async (updatedSubmission, id, { rejectWithValue }) => {
    try {
      const response = await updateSubmission(updatedSubmission, id);
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
  extraReducers: (builder) => {},
});

export const { setCurrentSubmissionId, resetState } =
  examIeltsSubmissionSlice.actions;
export default examIeltsSubmissionSlice.reducer;
