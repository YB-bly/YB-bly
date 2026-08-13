import api from "./api";

const STATUS_LABELS = {
  pending: "주문접수",
  paid: "결제완료",
  preparing: "배송준비",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

export const getAdminStatusLabel = (
  status
) => {
  return (
    STATUS_LABELS[status] ||
    status
  );
};

export const getAdminDashboard =
  async () => {
    const response = await api.get(
      "/admin/dashboard"
    );

    return {
      userCount: Number(
        response.data.userCount ?? 0
      ),

      productCount: Number(
        response.data.productCount ?? 0
      ),

      orderCount: Number(
        response.data.orderCount ?? 0
      ),

      salesTotal: Number(
        response.data.salesTotal ?? 0
      ),
    };
  };

export const getAdminOrders =
  async () => {
    const response = await api.get(
      "/admin/orders"
    );

    return response.data.map(
      (order) => ({
        ...order,

        id: Number(order.id),

        number:
          order.order_number ??
          order.orderNumber ??
          "",

        total: Number(
          order.total_price ??
            order.totalPrice ??
            0
        ),

        statusLabel:
          getAdminStatusLabel(
            order.status
          ),

        customer:
          order.userName ??
          order.name ??
          "",

        email:
          order.email ?? "",

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
      })
    );
  };

export const updateAdminOrderStatus =
  async (
    orderId,
    status
  ) => {
    const response =
      await api.patch(
        `/admin/orders/${orderId}/status`,
        {
          status,
        }
      );

    return response.data;
  };

export const getAdminUsers =
  async () => {
    const response = await api.get(
      "/admin/users"
    );

    return response.data.map(
      (user) => ({
        ...user,

        id: Number(user.id),

        createdAt:
          user.created_at ??
          user.createdAt ??
          "",
      })
    );
  };

/*
 * 상품 관리자 API
 */

export const createAdminProduct =
  async (product) => {
    const response =
      await api.post(
        "/products",
        product
      );

    return response.data;
  };

export const updateAdminProduct =
  async (
    productId,
    product
  ) => {
    const response =
      await api.put(
        `/products/${productId}`,
        product
      );

    return response.data;
  };

export const deleteAdminProduct =
  async (productId) => {
    const response =
      await api.delete(
        `/products/${productId}`
      );

    return response.data;
  };

export const updateAdminProductStock =
  async (
    productId,
    stock
  ) => {
    const response =
      await api.patch(
        `/products/${productId}/stock`,
        {
          stock,
        }
      );

    return response.data;
  };