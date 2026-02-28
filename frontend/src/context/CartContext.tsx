import { createContext, useContext, useEffect, useState } from "react";
import { request } from "../api/client";

interface CartContextType {
  cartCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: () => {}
});

export function CartProvider({ children }: { children: React.ReactNode }) {

  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const cart = await request("/cart");
      const total = cart.items?.reduce((acc:number,item:any)=>acc+item.quantity,0) || 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(()=>{
    refreshCart();
  },[]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);