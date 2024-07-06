
import { configureStore } from "@reduxjs/toolkit";
import {userReducer} from "./reducer/userreducer"
export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;