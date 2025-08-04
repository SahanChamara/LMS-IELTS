import {combineReducers} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice";
import unitsSlice from "../features/unitsSlice"
import discussionSlice from "../features/discussionSlice";
import assignmentsSlice from "../features/assignmentsSlice";
import examIeltsSlice from "../features/examIeltsSlice";
import studentsSlice from "../features/studentSlice"
import examIeltsSubmissionSlice from "../features/examIeltsSubmissionSlice";
import examIeltsInstructorSlice from "../features/examIeltsInstructorSlice"

const rootReducer = combineReducers({
    auth: authSlice,
    units: unitsSlice,
    discussions: discussionSlice,
    assignments: assignmentsSlice,
    examIelts: examIeltsSlice,
    examIeltsSubmission: examIeltsSubmissionSlice,
    students: studentsSlice,
    examIeltsInstructor: examIeltsInstructorSlice,
});


export default rootReducer;