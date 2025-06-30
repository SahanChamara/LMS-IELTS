import {combineReducers} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice";
import unitsSlice from "../features/unitsSlice"
import discussionSlice from "../features/discussionSlice";
import assignmentsSlice from "../features/assignmentsSlice";
const rootReducer = combineReducers({
    auth: authSlice,
    units: unitsSlice,
    discussions: discussionSlice,
    assignments: assignmentsSlice,
});


export default rootReducer;