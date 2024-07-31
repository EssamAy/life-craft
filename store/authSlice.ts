import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store/store";
import {User} from "@/models/user";

interface AuthSliceState {
    user: User | null
}

const initialState: AuthSliceState = {
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        }
    }
})

export const {
    setUser
} = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
