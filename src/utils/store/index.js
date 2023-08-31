import { configureStore } from "@reduxjs/toolkit";
import storiesReducer from "./slice/storiesSlice";

const store = configureStore({
  reducer: {
    stories: storiesReducer,
  },
});

export default store;
