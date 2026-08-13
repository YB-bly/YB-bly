import api from "./api";

export const getCartItems = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addCartItem = async ({
  productId,
  quantity,
  optionLabel,
}) => {
  const response = await api.post("/cart", {
    productId,
    quantity,
    optionLabel,
  });

  return response.data;
};

export const updateCartItem = async (
  cartItemId,
  quantity
) => {
  const response = await api.patch(
    `/cart/${cartItemId}`,
    {
      quantity,
    }
  );

  return response.data;
};

export const removeCartItem = async (
  cartItemId
) => {
  const response = await api.delete(
    `/cart/${cartItemId}`
  );

  return response.data;
};