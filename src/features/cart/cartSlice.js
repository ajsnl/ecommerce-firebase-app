import { createSlice } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// 🔥 INITIAL STATE (no localStorage)
const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Set cart from Firestore
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;

//////////////////////////////////////////////////////////////
// 🔥 FIRESTORE LOGIC (USER-SPECIFIC)
//////////////////////////////////////////////////////////////

// ✅ ADD TO CART (per user)
export const addToCartFirestore = (product) => async (dispatch, getState) => {
  const user = getState().auth.user;

  if (!user) {
    alert("Please login first");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const snap = await getDoc(cartRef);

  let items = [];

  if (snap.exists()) {
    items = snap.data().items || [];
  }

  // ❌ Prevent duplicate
  const exists = items.find((item) => item.id === product.id);
  if (exists) {
    alert("Already in cart ⚠️");
    return;
  }

  // ✅ Store only required fields
  const newItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
  };

  items.push(newItem);

  await setDoc(cartRef, { items });
};


// ✅ REMOVE FROM CART (per user)
export const removeFromCartFirestore = (id) => async (dispatch, getState) => {
  const user = getState().auth.user;

  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const snap = await getDoc(cartRef);

  if (!snap.exists()) return;

  const items = snap.data().items || [];

  const updatedItems = items.filter((item) => item.id !== id);

  await setDoc(cartRef, { items: updatedItems });
};


// ✅ CLEAR CART (after checkout)
export const clearCartFirestore = () => async (dispatch, getState) => {
  const user = getState().auth.user;

  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);

  await setDoc(cartRef, { items: [] });
};


// ✅ REAL-TIME LISTENER (per user)
export const listenToCart = () => (dispatch, getState) => {
  const user = getState().auth.user;

  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);

  return onSnapshot(cartRef, (snapshot) => {
    if (snapshot.exists()) {
      dispatch(setCart(snapshot.data().items));
    } else {
      dispatch(setCart([]));
    }
  });
};