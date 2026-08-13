import api from "./api";

import item1 from "../assets/img/home/item1.png";
import item2 from "../assets/img/home/item2.png";
import item3 from "../assets/img/home/item3.png";
import item4 from "../assets/img/home/item4.png";
import item5 from "../assets/img/home/item5.png";
import item6 from "../assets/img/home/item6.png";

const fallbackImages = {
  1: item1,
  2: item2,
  3: item3,
  4: item4,
  5: item5,
  6: item6,
};

const statusLabels = {
  pending: "주문접수",
  paid: "결제완료",
  preparing: "배송준비",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "주문취소",
};

export const getOrderStatusLabel = (status) => {
  return statusLabels[status] || status;
};

const normalizeOrderItem = (item) => {
  const productId =
    item.product_id ??
    item.productId;

  return {
    ...item,

    productId,

    option:
      item.option_label ??
      item.optionLabel ??
      "",

    quantity:
      Number(item.quantity ?? 1),

    price:
      Number(
        item.price_at_order ??
          item.price ??
          0
      ),

    image:
      item.image_url ||
      item.image ||
      fallbackImages[productId] ||
      "",
  };
};

export const normalizeOrder = (order) => {
  if (!order) {
    return null;
  }

  return {
    ...order,

    id: Number(order.id),

    number:
      order.order_number ??
      order.orderNumber ??
      "",

    total:
      Number(
        order.total_price ??
          order.totalPrice ??
          0
      ),

    statusLabel:
      getOrderStatusLabel(
        order.status
      ),

    recipient:
      order.recipient_name ??
      order.recipientName ??
      "",

    phone:
      order.recipient_phone ??
      order.recipientPhone ??
      "",

    address:
      order.address ?? "",

    createdAt:
      order.created_at ??
      order.createdAt ??
      "",

    items: Array.isArray(order.items)
      ? order.items.map(
          normalizeOrderItem
        )
      : [],
  };
};

export const createOrder = async ({
  couponCode,
  idempotencyKey,
  recipientName,
  recipientPhone,
  address,
}) => {
  const response = await api.post(
    "/orders",
    {
      couponCode:
        couponCode || undefined,
      idempotencyKey,
      recipientName,
      recipientPhone,
      address,
    }
  );

  return response.data;
};

export const getOrders = async () => {
  const response =
    await api.get("/orders");

  return response.data.map(
    normalizeOrder
  );
};

export const getOrder = async (
  orderId
) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return normalizeOrder(
    response.data
  );
};