import { createSlice } from "@reduxjs/toolkit";
import service from "../../service";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    username: null,
    fullname: null,
    photo: null,
    email: null,
    _proceedLogin: () => {},
    id: null,
  },
  reducers: {
    login: (state, { payload: { token, id } }) => {
      service.defaults.headers.common["Authorization"] = "Bearer " + token;
      return {
        ...state,
        token,
        id,
      };
    },
    set: (state, { payload }) => {
      const data = { ...state };
      return {
        ...data,
        ...payload,
      };
    },
    replace: (state, { payload: { field, value } }) => {
      const data = { ...state };
      data[field] = value;
      return { ...data };
    },
    logout: (state) => {
      service.defaults.headers.common["Authorization"] = undefined;
      return {
        ...state,
        token: null,
        username: null,
        fullname: null,
        photo: null,
        email: null,
        id: null,
      };
    },
    setProceedLogin: (state, { payload }) => {
      return {
        ...state,
        _proceedLogin: payload,
      };
    },
  },
});

export const { login, setProceedLogin, logout, replace, set } =
  authSlice.actions;
export default authSlice.reducer;
