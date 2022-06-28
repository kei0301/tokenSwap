import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    TokenName: 'avalanche',
    Network: []
};

const TokenReducer = createSlice({
    name: 'Token',
    initialState,
    reducers: {
        SetTokenName: (state, action) => {
            state.TokenName = action.payload;
        },
        SetNetwork: (state, action) => {
            state.Network = action.payload;
        }
    }
});

const { reducer, actions } = TokenReducer;

export const { SetTokenName, SetNetwork } = actions;

export default reducer;
