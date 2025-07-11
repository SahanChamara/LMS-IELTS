import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSubmission, updateSubmission } from "../../service/examIeltsSubmissionService";

const initialState = {
  submission: {},
  currentSubmissionId: null,
  loading: false,
  error: null,
  success: false,
};

export const createSubmissionAPI = createAsyncThunk(
  'examIeltsSubmission/createSubmission',
  async (submission, { rejectWithValue }) => {
    try{
        const response = await createSubmission(submission);
        if(!response.success){
            return rejectWithValue(response.message);
        }
        return response.data;
    }catch(error){
        return rejectWithValue("Create Submission Failed...", error.message);
    }
  }
);

export const updateSubmissionAPI = createAsyncThunk(
    `examIeltsSubmission/updateSubmission`,
    async (updatedSubmission,id, {rejectWithValue}) => {
        try{
            const response = await updateSubmission(updatedSubmission, id);
            if(!response.success){
                return rejectWithValue(response.message);
            }
            return response.data;
        }catch(error){
            return rejectWithValue("Update Submission Failed...", error.message);
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
    
  }
});

export const {setCurrentSubmissionId, resetState} = examIeltsSubmissionSlice.actions;
export default examIeltsSubmissionSlice.reducer
