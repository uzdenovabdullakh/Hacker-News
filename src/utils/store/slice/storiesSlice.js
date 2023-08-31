import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //stories: new Set(),
  stories: [],
};

export const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setStories(state, action) {
     state.stories = action.payload.stories;
     //state.stories.add(action.payload.stories);
    },
  },
});

export const { setStories } = storiesSlice.actions;
export default storiesSlice.reducer;
