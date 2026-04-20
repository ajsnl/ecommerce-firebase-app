import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    userProducts: [], // ✅ for profile
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setUserProducts: (state, action) => {
      state.userProducts = action.payload;
    },
  },
});

// ✅ Export BOTH reducers
export const { setProducts, setUserProducts } = productSlice.actions;

export default productSlice.reducer;



// 🔥 Mark product as SOLD
export const markAsSoldFirestore = (id) => async () => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      sold: true,
    });
  } catch (error) {
    console.error("Error marking as sold:", error);
  }
};



// ✅ Real-time listener (ALL products)
export const listenToProducts = () => (dispatch) => {
  const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(setProducts(products));
  });

  return unsubscribe;
};



// 🔥 NEW: Real-time listener (ONLY current user products)
export const listenToUserProducts = (userId) => (dispatch) => {
  if (!userId) return;

  const q = query(
    collection(db, "products"),
    where("userId", "==", userId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    dispatch(setUserProducts(data));
  });

  return unsubscribe;
};