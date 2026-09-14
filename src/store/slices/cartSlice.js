import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, removeCookie } from "../../utils/cookies";

const CART_KEY = "tw_cart";

// ── Guest cart: cookie se load/save ──
const loadGuestCart = () => {
  try {
    const data = getCookie(CART_KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  setCookie(CART_KEY, items, 30);
};

const clearGuestCartCookie = () => {
  removeCookie(CART_KEY);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadGuestCart(),      // guest mode: cookie se
    dbItems: [],                 // auth mode: API se
    isAuth: false,               // auth state track karo
  },
  reducers: {
    // ── Auth login pe: guest items hatao, DB items set karo ──
    setAuthCart: (state, { payload }) => {
      state.isAuth = true;
      state.dbItems = payload || [];
      state.items = [];          // guest items clear
      clearGuestCartCookie();    // cookie bhi saaf
    },

    // ── Auth logout pe: DB items hatao, guest mode wapas ──
    setGuestCart: (state) => {
      state.isAuth = false;
      state.dbItems = [];
      state.items = loadGuestCart();  // cookie se reload
    },

    // ── Guest: item add ──
    addToCart: (state, { payload }) => {
      if (!state.items.some((item) => item._id === payload._id)) {
        state.items.push(payload);
        saveGuestCart(state.items);
      }
    },

    // ── Guest: item remove ──
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((item) => item._id !== payload);
      saveGuestCart(state.items);
    },

    // ── Guest: cart clear ──
    clearCart: (state) => {
      state.items = [];
      saveGuestCart(state.items);
    },

    // ── DB cart replace (API response se) ──
    setDbCart: (state, { payload }) => {
      state.dbItems = payload || [];
    },
  },
});

export const {
  setAuthCart,
  setGuestCart,
  addToCart,
  removeFromCart,
  clearCart,
  setDbCart,
} = cartSlice.actions;

// Selector — auth hai to dbItems, guest hai to items
export const selectCartItems = (state) =>
  state.cart.isAuth ? state.cart.dbItems : state.cart.items;

export default cartSlice.reducer;
