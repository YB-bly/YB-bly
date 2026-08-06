const CART_KEY = "yb-bly-cart";
const CHECKOUT_KEY = "yb-bly-checkout";
const ORDERS_KEY = "yb-bly-mock-orders";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getCart = () => read(CART_KEY, []);
export const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

export const addCartItem = (product, option, quantity) => {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id && item.option === option);
  const next = existing
    ? cart.map((item) => item === existing ? { ...item, quantity: item.quantity + quantity } : item)
    : [...cart, { id: `${product.id}-${option}`, product, option, quantity }];
  saveCart(next);
  return next;
};

export const saveCheckout = (checkout) => localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
export const getCheckout = () => read(CHECKOUT_KEY, null);
export const clearCheckout = () => localStorage.removeItem(CHECKOUT_KEY);

export const getMockOrders = () => read(ORDERS_KEY, []);
export const saveMockOrder = (order) => {
  const orders = [order, ...getMockOrders()];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
};

export const updateMockOrderStatus = (orderId, status) => {
  const orders = getMockOrders().map((order) => Number(order.id) === Number(orderId) ? { ...order, status } : order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};
