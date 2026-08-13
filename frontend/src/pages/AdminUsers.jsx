import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminHeader from "../components/AdminHeader";
import AdminBottomNavigation from "../components/AdminBottomNavigation";
import Pagination from "../components/Pagination";

import {
  getAdminUsers,
} from "../api/adminApi";

const PAGE_SIZE = 5;

const AdminUsers = () => {
  const [
    members,
    setMembers,
  ] = useState([]);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminUsers();

        setMembers(data);
      } catch (error) {
        console.error(
          "관리자 회원 목록 조회 실패:",
          error
        );

        setError(
          error.response?.data?.error ||
            "회원 목록을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const users = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return members;
    }

    return members.filter(
      (user) =>
        `${user.name} ${user.email} ${user.role}`
          .toLowerCase()
          .includes(
            normalizedQuery
          )
    );
  }, [
    members,
    query,
  ]);

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "ko-KR"
    );
  };

  return (
    <div className="admin-users-page admin-page">
      <div className="container">
        <AdminHeader
          title="회원 관리"
          back
        />

        <main className="admin-users">
          <div className="admin-search">
            <input
              value={query}
              onChange={(event) => {
                setQuery(
                  event.target.value
                );

                setPage(1);
              }}
              placeholder="이름 또는 이메일 검색"
            />
          </div>

          <section className="admin-users__stats">
            <div>
              <span>
                전체 회원
              </span>

              <strong>
                {members.length}
              </strong>
            </div>

            <div>
              <span>
                일반 회원
              </span>

              <strong>
                {
                  members.filter(
                    (user) =>
                      user.role ===
                      "user"
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>
                관리자
              </span>

              <strong>
                {
                  members.filter(
                    (user) =>
                      user.role ===
                      "admin"
                  ).length
                }
              </strong>
            </div>
          </section>

          {loading ? (
            <section className="empty-state">
              <strong>
                회원 목록을 불러오는
                중...
              </strong>
            </section>
          ) : error ? (
            <section className="empty-state">
              <span>!</span>

              <strong>
                회원 목록을
                불러오지 못했어요
              </strong>

              <p>
                {error}
              </p>
            </section>
          ) : (
            <>
              <section className="admin-users__list">
                {users
                  .slice(
                    (page - 1) *
                      PAGE_SIZE,

                    page *
                      PAGE_SIZE
                  )
                  .map(
                    (user) => (
                      <article
                        key={
                          user.id
                        }
                      >
                        <div className="admin-users__avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div>
                          <strong>
                            {
                              user.name
                            }

                            <em>
                              {user.role ===
                              "admin"
                                ? "관리자"
                                : "회원"}
                            </em>
                          </strong>

                          <p>
                            {
                              user.email
                            }
                          </p>

                          <span>
                            가입{" "}
                            {formatDate(
                              user.createdAt
                            )}
                          </span>
                        </div>

                        <span
                          className={
                            user.role ===
                            "admin"
                              ? "is-admin"
                              : ""
                          }
                        >
                          {user.role ===
                          "admin"
                            ? "Admin"
                            : "User"}
                        </span>
                      </article>
                    )
                  )}
              </section>

              {users.length ===
                0 && (
                <section className="empty-state">
                  <span>!</span>

                  <strong>
                    조건에 맞는 회원이
                    없어요
                  </strong>
                </section>
              )}

              <Pagination
                page={page}
                total={
                  users.length
                }
                pageSize={
                  PAGE_SIZE
                }
                onChange={
                  setPage
                }
              />
            </>
          )}
        </main>

        <AdminBottomNavigation />
      </div>
    </div>
  );
};

export default AdminUsers;