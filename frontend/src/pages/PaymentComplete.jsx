import {
  useEffect,
  useState,
} from "react";

import { Link } from "../router";

import {
  useSearchParams,
} from "../router-hooks";

import AppHeader from "../components/AppHeader";

import {
  formatPrice,
} from "../data/products";

import {
  getOrder,
} from "../api/orderApi";

const PaymentComplete = () => {
  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("order");

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!orderId) {
      setError(
        "주문 정보를 찾을 수 없습니다."
      );
      setLoading(false);
      return;
    }

    const fetchOrder =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getOrder(
              orderId
            );

          setOrder(data);
        } catch (error) {
          console.error(
            "주문 완료 정보 조회 실패:",
            error
          );

          setError(
            error.response?.data
              ?.error ||
              "주문 정보를 불러오지 못했습니다."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="payment-complete-page">
      <div className="container">
        <AppHeader
          title="주문 완료"
          actions={false}
        />

        <main className="payment-complete">
          <div className="payment-complete__icon">
            ✓
          </div>

          <h1>
            모의 결제가 완료됐어요
          </h1>

          <p>
            실제 금액은 결제되지
            않았습니다.
            <br />
            주문 상태가 결제완료로
            변경됐어요.
          </p>

          {loading ? (
            <section>
              <p>
                주문 정보를 불러오는
                중...
              </p>
            </section>
          ) : error ? (
            <section>
              <p>
                {error}
              </p>
            </section>
          ) : order ? (
            <section>
              <dl>
                <dt>
                  주문번호
                </dt>

                <dd>
                  {order.number}
                </dd>

                <dt>
                  결제 금액
                </dt>

                <dd>
                  <strong>
                    {formatPrice(
                      order.total
                    )}
                  </strong>
                </dd>

                <dt>
                  배송지
                </dt>

                <dd>
                  {order.address}
                </dd>
              </dl>
            </section>
          ) : null}

          <div className="payment-complete__actions">
            <Link to="/orders">
              주문 내역 보기
            </Link>

            <Link to="/">
              쇼핑 계속하기
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentComplete;