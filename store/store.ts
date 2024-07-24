import {Action, combineSlices, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {flashCardsSlice} from "@/store/flashCardsSlice";

const rootReducer = combineSlices(flashCardsSlice)
export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer
});

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>