import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submission: {},
  currentSubmissionId: null,
  loading: false,
  error: null,
  success: false,
};

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
