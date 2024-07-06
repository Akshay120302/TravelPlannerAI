import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedHotels: [], // Array to store selected hotel IDs
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setSelectedHotel(state, action = { payload: null }){
      const hotelId = action.payload;
      const alreadySelected = state.selectedHotels.includes(hotelId);
      if (alreadySelected) {
        // Deselect hotel if already selected
        state.selectedHotels = state.selectedHotels.filter(id => id !== hotelId);
      } else {
        // Select hotel if not already selected
        state.selectedHotels.push(hotelId);
      }
    },
  },
});

export const { setSelectedHotel } = hotelSlice.actions;