import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllLectures } from "../../service/adminService";

// export const getLecturesDetailsAPI = createAsyncThunk(
//   "lecture/getLectureDetailsAPI",
//   async (userId, { rejectWithValue }) => {
//     try {
//       console.log(userId);
//       const response = await getStudentProfile(userId);

//       if (!response.success) {
//         return rejectWithValue(
//           response.message || "Failed to fetch lecture details"
//         );
//       }

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.message || "Failed to fetch lecture details"
//       );
//     }
//   }
// );

// ========================================================================
export const getAllLectursAPI = createAsyncThunk(
  "admin/getAllLecturesAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllLectures();
    //   console.log("Get All Lecture Response ->>", response);
      return response;
    } catch (error) {
      return rejectWithValue("All lecture Fetch Failed...", error);
    }
  }
);
// ========================================================================

const initialState = {
  admin: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //   .addCase(getStudentDetailsAPI.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getStudentDetailsAPI.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.student = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(getStudentDetailsAPI.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload || "Failed to fetch student details";
    //   })

      //=============================================================================
      // 🔄 Get Students
      .addCase(getAllLectursAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllLectursAPI.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Students Slice :", action.payload);
        // state.units.byInstructor = action.payload;
        console.log("Admin Slice :", action.payload);
        state.admin = action.payload;
        
      })
      .addCase(getAllLectursAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //=============================================================================
  },
});

export default adminSlice.reducer;
