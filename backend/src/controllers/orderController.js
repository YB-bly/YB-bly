const db = require('../config/db');

function generateOrderNumber() {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');

  const todayCount = db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM orders
       WHERE order_number LIKE ?`
    )
    .get(`${datePart}-%`).count;

  const seq = String(
    todayCount + 1
  ).padStart(5, '0');

  return `${datePart}-${seq}`;
}

function createOrder(req, res) {
  const {
    couponCode,
    idempotencyKey,
    recipientName,
    recipientPhone,
    address,
    items,
    orderType,
  } = req.body;

  const userId = req.user.id;

  if (!idempotencyKey) {
    return res.status(400).json({
      error:
        'idempotencyKey가 필요합니다.',
    });
  }

  if (
    !recipientName ||
    !recipientPhone ||
    !address
  ) {
    return res.status(400).json({
      error:
        '배송지 정보(수령인, 연락처, 주소)를 입력해주세요.',
    });
  }

  const already = db
    .prepare(
      `SELECT id
       FROM orders
       WHERE idempotency_key = ?`
    )
    .get(idempotencyKey);

  if (already) {
    return res.status(200).json({
      orderId: already.id,
      message:
        '이미 처리된 주문입니다.',
    });
  }

  const isDirectOrder =
    orderType === 'direct' &&
    Array.isArray(items) &&
    items.length > 0;

  let orderItems = [];

  if (isDirectOrder) {
    const getProductStmt =
      db.prepare(
        `SELECT
          id AS product_id,
          price,
          stock,
          name
         FROM products
         WHERE id = ?`
      );

    for (
      const requestedItem of items
    ) {
      const productId = Number(
        requestedItem.productId ??
          requestedItem.product_id
      );

      const quantity = Number(
        requestedItem.quantity ?? 1
      );

      const optionLabel =
        requestedItem.optionLabel ??
        requestedItem.option_label ??
        'FREE';

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return res
          .status(400)
          .json({
            error:
              '올바르지 않은 상품 정보입니다.',
          });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res
          .status(400)
          .json({
            error:
              '올바르지 않은 주문 수량입니다.',
          });
      }

      const product =
        getProductStmt.get(
          productId
        );

      if (!product) {
        return res
          .status(404)
          .json({
            error:
              '주문하려는 상품을 찾을 수 없습니다.',
          });
      }

      orderItems.push({
        product_id:
          product.product_id,

        option_label:
          optionLabel,

        quantity,

        price:
          Number(
            product.price
          ),

        stock:
          Number(
            product.stock
          ),

        name:
          product.name,
      });
    }
  } else {
    orderItems = db
      .prepare(
        `SELECT
          c.product_id,
          c.option_label,
          c.quantity,
          p.price,
          p.stock,
          p.name
         FROM cart_items c
         JOIN products p
           ON p.id = c.product_id
         WHERE c.user_id = ?`
      )
      .all(userId);

    if (
      orderItems.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            '장바구니가 비어있습니다.',
        });
    }
  }

  for (
    const item of orderItems
  ) {
    if (
      item.quantity >
      item.stock
    ) {
      return res
        .status(409)
        .json({
          error:
            `${item.name}의 재고가 부족합니다.`,
        });
    }
  }

  const subtotal =
    orderItems.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  let totalPrice = subtotal;
  let couponId = null;

  if (couponCode) {
    const coupon = db
      .prepare(
        `SELECT *
         FROM coupons
         WHERE code = ?`
      )
      .get(couponCode);

    if (!coupon) {
      return res
        .status(400)
        .json({
          error:
            '유효하지 않은 쿠폰입니다.',
        });
    }

    const used = db
      .prepare(
        `SELECT id
         FROM coupon_usage
         WHERE user_id = ?
           AND coupon_id = ?`
      )
      .get(
        userId,
        coupon.id
      );

    if (used) {
      return res
        .status(409)
        .json({
          error:
            '이미 사용한 쿠폰입니다.',
        });
    }

    if (
      coupon.min_order_amount &&
      subtotal <
        coupon.min_order_amount
    ) {
      return res
        .status(400)
        .json({
          error:
            `${coupon.min_order_amount.toLocaleString(
              'ko-KR'
            )}원 이상 구매 시 사용할 수 있는 쿠폰입니다.`,
        });
    }

    couponId =
      coupon.id;

    totalPrice =
      Math.round(
        totalPrice *
          (1 -
            coupon.discount_percent /
              100)
      );
  }

  const orderNumber =
    generateOrderNumber();

  const runTransaction =
    db.transaction(() => {
      const orderResult =
        db
          .prepare(
            `INSERT INTO orders (
              order_number,
              user_id,
              total_price,
              status,
              coupon_id,
              recipient_name,
              recipient_phone,
              address,
              idempotency_key
            )
            VALUES (
              ?,
              ?,
              ?,
              'paid',
              ?,
              ?,
              ?,
              ?,
              ?
            )`
          )
          .run(
            orderNumber,
            userId,
            totalPrice,
            couponId,
            recipientName,
            recipientPhone,
            address,
            idempotencyKey
          );

      const orderId =
        orderResult.lastInsertRowid;

      const insertOrderItem =
        db.prepare(
          `INSERT INTO order_items (
            order_id,
            product_id,
            option_label,
            quantity,
            price_at_order
          )
          VALUES (?, ?, ?, ?, ?)`
        );

      const decrementStock =
        db.prepare(
          `UPDATE products
           SET stock = stock - ?
           WHERE id = ?`
        );

      for (
        const item of orderItems
      ) {
        insertOrderItem.run(
          orderId,
          item.product_id,
          item.option_label,
          item.quantity,
          item.price
        );

        decrementStock.run(
          item.quantity,
          item.product_id
        );
      }

      if (couponId) {
        db.prepare(
          `INSERT INTO coupon_usage (
            user_id,
            coupon_id,
            order_id
          )
          VALUES (?, ?, ?)`
        ).run(
          userId,
          couponId,
          orderId
        );
      }

      if (!isDirectOrder) {
        db.prepare(
          `DELETE FROM cart_items
           WHERE user_id = ?`
        ).run(userId);
      }

      return orderId;
    });

  try {
    const orderId =
      runTransaction();

    return res
      .status(201)
      .json({
        orderId,
        orderNumber,
        totalPrice,
        status: 'paid',
      });
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({
        error:
          '주문 처리 중 오류가 발생했습니다.',
      });
  }
}

function myOrders(req, res) {
  const orders = db
    .prepare(
      `SELECT *
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .all(req.user.id);

  const getItemsStmt =
    db.prepare(
      `SELECT
        oi.*,
        p.name,
        p.brand,
        p.image_url
       FROM order_items oi
       JOIN products p
         ON p.id = oi.product_id
       WHERE oi.order_id = ?`
    );

  const withItems =
    orders.map((order) => ({
      ...order,

      items:
        getItemsStmt.all(
          order.id
        ),
    }));

  return res.json(
    withItems
  );
}

function orderDetail(req, res) {
  const { id } =
    req.params;

  const order = db
    .prepare(
      `SELECT *
       FROM orders
       WHERE id = ?`
    )
    .get(id);

  if (!order) {
    return res
      .status(404)
      .json({
        error:
          '주문을 찾을 수 없습니다.',
      });
  }

  if (
    order.user_id !==
      req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res
      .status(403)
      .json({
        error:
          '접근 권한이 없습니다.',
      });
  }

  const items = db
    .prepare(
      `SELECT
        oi.*,
        p.name,
        p.brand,
        p.image_url
       FROM order_items oi
       JOIN products p
         ON p.id = oi.product_id
       WHERE oi.order_id = ?`
    )
    .all(id);

  return res.json({
    ...order,
    items,
  });
}

function maskName(name) {
  if (!name) {
    return '';
  }

  if (name.length === 1) {
    return name;
  }

  if (name.length === 2) {
    return `${name[0]}*`;
  }

  return `${name[0]}${'*'.repeat(
    name.length - 2
  )}${name[name.length - 1]}`;
}

function maskPhone(phone) {
  if (!phone) {
    return '';
  }

  const normalized =
    String(phone).replace(
      /\D/g,
      ''
    );

  if (
    normalized.length === 11
  ) {
    return `${normalized.slice(
      0,
      3
    )}-****-${normalized.slice(
      7
    )}`;
  }

  if (
    normalized.length === 10
  ) {
    return `${normalized.slice(
      0,
      3
    )}-***-${normalized.slice(
      6
    )}`;
  }

  return '***-****-****';
}

function orderReceipt(req, res) {
  const { id } =
    req.params;

  const order = db
    .prepare(
      `SELECT *
       FROM orders
       WHERE id = ?`
    )
    .get(id);

  if (!order) {
    return res
      .status(404)
      .json({
        error:
          '영수증을 찾을 수 없습니다.',
      });
  }

  const items = db
    .prepare(
      `SELECT
        oi.id,
        oi.product_id,
        oi.option_label,
        oi.quantity,
        oi.price_at_order,
        p.name,
        p.brand,
        p.image_url
       FROM order_items oi
       JOIN products p
         ON p.id = oi.product_id
       WHERE oi.order_id = ?`
    )
    .all(id);

  return res.json({
    id:
      order.id,

    order_number:
      order.order_number,

    created_at:
      order.created_at,

    total_price:
      order.total_price,

    status:
      order.status,

    payment_method:
      order.payment_method ||
      '카드 결제',

    recipient_name:
      maskName(
        order.recipient_name
      ),

    recipient_phone:
      maskPhone(
        order.recipient_phone
      ),

    items,
  });
}

module.exports = {
  createOrder,
  myOrders,
  orderDetail,
  orderReceipt,
  generateOrderNumber,
};