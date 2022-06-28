import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Repositories: [],
    Developers: [],
};

const GitReducer = createSlice({
    name: 'Git',
    initialState,
    reducers: {
        SetRepo: (state, action) => {
            state.Repositories = action.payload;
        },
        SetDev: (state, action) => {
            state.Developers = action.payload;
        },
    }
});

const { reducer, actions } = GitReducer;

export const { SetRepo, SetDev } = actions;

export default reducer;
