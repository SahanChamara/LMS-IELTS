import { configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
// import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import {useDispatch, useSelector} from "react-redux";
import rootReducer from "./root-reducer";


const persistConfig = {
    key: "root",
    storage: storageSession,
    whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
        immutableCheck: true,
    }),
    devTools: import.meta.env.VITE_NODE_ENV !== "production",
})

export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;