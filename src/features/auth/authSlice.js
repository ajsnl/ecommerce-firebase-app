import { createSlice } from "@reduxjs/toolkit";


const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  isAuthenticated: !!savedUser?.uid, 
  user: savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const firebaseUser = action.payload;

      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name:firebaseUser.name
      };

      state.isAuthenticated = true;
      state.user = userData;

      localStorage.setItem("user", JSON.stringify(userData));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;