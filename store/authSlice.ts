import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store/store";
import {User} from "@/models/user";

interface AuthSliceState {
    authChecked: boolean;
    user: User | null
}

const initialState: AuthSliceState = {
    authChecked: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.authChecked = true;
            state.user = action.payload;
        }
    }
})

export const {
    setUser
} = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectAuthChecked = (state: RootState) => state.auth.authChecked
