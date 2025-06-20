import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMessage, sendNewMessage } from "../../service/discussionService";

// Send New Message
export const sendNewMessageAPI = createAsyncThunk(
  "sendNewMessageAPI",
  async (newMessage, { rejectWithValue }) => {
    try {
      const response = await sendNewMessage(newMessage);
      console.log("send New Message Response", response);
      return response;
    } catch (error) {
      return rejectWithValue("Send new Message Failed...", error);
    }
  }
);

// Get Messages
export const getMessageAPI = createAsyncThunk(
  "getMessageAPI",
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await getMessage(unitId);
      console.log("Get Message Response", response);
      return response;
    } catch (error) {
      return rejectWithValue("Get Message Error", error);
    }
  }
);

const initialState = {
  loading: false,
  chat: [],
  error: null,
};

const discussionSlice = createSlice({
  name: "discussionSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(sendNewMessageAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendNewMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(sendNewMessageAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      })

      .addCase(getMessageAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessageAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(getMessageAPI.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default discussionSlice.reducer;
