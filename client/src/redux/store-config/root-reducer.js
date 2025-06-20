import {combineReducers} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice";
import unitsSlice from "../features/unitsSlice"
import discussionSlice from "../features/discussionSlice";
const rootReducer = combineReducers({
    auth: authSlice,
    units: unitsSlice,
    discussions: discussionSlice,
});


export default rootReducer;