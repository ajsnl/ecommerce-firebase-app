import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;



export const listenToWishlist = (user) => (dispatch) => {
  if (!user) return;

  const ref = collection(db, "users", user.uid, "wishlist");

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // Firestore doc ID
      ...doc.data(),
    }));

    dispatch(setWishlist(data));
  });

  return unsubscribe;
};


// add
export const addToWishlist = (product) => async (dispatch, getState) => {
  const user = getState().auth.user;
  if (!user) return alert("Login required");

  const ref = collection(db, "users", user.uid, "wishlist");

  // check if already exists
  const q = query(ref, where("productId", "==", product.id));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("Already in wishlist ❤️");
    return;
  }

  await addDoc(ref, {
    productId: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
  });
};


// removing
export const removeFromWishlist = (productId) => async (dispatch, getState) => {
  const user = getState().auth.user;
  if (!user) return;

  const ref = collection(db, "users", user.uid, "wishlist");

  // find correct doc using productId
  const q = query(ref, where("productId", "==", productId));
  const snapshot = await getDocs(q);

  snapshot.forEach(async (docItem) => {
    await deleteDoc(doc(db, "users", user.uid, "wishlist", docItem.id));
  });
};