import { createSlice, createAction } from '@reduxjs/toolkit';

// Define the new action
export const setTripDestinations = createAction('trip/setTripDestinations');

const initialState = {
    trip: null,
    destinations: [], // Add destinations to the initial state
    error: null,
    loading: false,
};

const tripSlice = createSlice({
    name: 'trip',
    initialState,
    reducers: {
        createTripStart: (state) => {
            state.loading = true;
        },
        createTripSuccess: (state, action) => {
            state.trip = action.payload;
            state.loading = false;
            state.error = null;
        },
        createTripFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        // Add the new action to the extra reducers
        builder.addCase(setTripDestinations, (state, action) => {
            state.destinations = action.payload;
        });
    },
});

export const { createTripStart, createTripSuccess, createTripFailure } = tripSlice.actions;

export default tripSlice.reducer;
