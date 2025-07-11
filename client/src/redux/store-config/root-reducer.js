import {combineReducers} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice";
import unitsSlice from "../features/unitsSlice"
import discussionSlice from "../features/discussionSlice";
import assignmentsSlice from "../features/assignmentsSlice";
import examIeltsSlice from "../features/examIeltsSlice";
import examIeltsSubmissionSlice from "../features/examIeltsSubmissionSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    units: unitsSlice,
    discussions: discussionSlice,
    assignments: assignmentsSlice,
    examIelts: examIeltsSlice,
    examIeltsSubmission: examIeltsSubmissionSlice,
});


export default rootReducer;