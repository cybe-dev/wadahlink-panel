import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    link: [],
    design: {},
  },
  reducers: {
    design: (state, { payload }) => {
      const data = { ...state };
      const design = { ...data.design, ...payload };
      return { ...data, design };
    },
    push: (state, { payload: { data } }) => {
      const link = state.link;
      return { ...state, link: [...link, data] };
    },
    reset: (state, { payload: { data } }) => {
      return { ...state, link: [...data] };
    },
    replace: (state, { payload: { index, data } }) => {
      const link = [...state.link];
      link[index] = data;
      return { ...state, link: [...link] };
    },
    destroy: (state, { payload: { index } }) => {
      const link = [...state.link];
      link.splice(index, 1);
      return { ...state, link: [...link] };
    },
    removeAll: () => {
      return {
        link: [],
        design: {},
      };
    },
  },
});

export const { push, reset, replace, destroy, design, removeAll } =
  dataSlice.actions;
export default dataSlice.reducer;
