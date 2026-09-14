import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthCart, setGuestCart } from "../store/slices/cartSlice";
import { getCookie, removeCookie } from "../utils/cookies";

const CART_KEY = "tw_cart";

/**
 * Cart merge on login:
 * 1. Token mila → guest items ko DB mein merge karo
 * 2. Token nahi → guest mode wapas
 */
export function useCartSync(mergeCartApi) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.cart.isAuth);
  const merged = useRef(false);

  useEffect(() => {
    if (!token) {
      // Logout ho gaya — guest mode wapas
      if (isAuth) {
        dispatch(setGuestCart());
        merged.current = false;
      }
      return;
    }

    // Token hai but abhi tak merge nahi hua
    if (token && !isAuth && !merged.current) {
      merged.current = true;

      // Guest items cookie se nikalo
      let guestItems = [];
      try {
        const data = getCookie(CART_KEY);
        guestItems = Array.isArray(data) ? data : [];
      } catch { /* ignore */ }

      // Merge API call karo
      const doMerge = async () => {
        try {
          const result = await mergeCartApi(guestItems).unwrap();
          const dbItems = result?.cart?.items || [];
          dispatch(setAuthCart(dbItems));
          removeCookie(CART_KEY);
        } catch {
          // Merge fail — sirf empty cart set karo
          dispatch(setAuthCart([]));
        }
      };

      doMerge();
    }
  }, [token, isAuth, dispatch, mergeCartApi]);
}
