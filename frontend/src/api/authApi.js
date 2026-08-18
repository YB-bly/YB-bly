import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  if (response.data?.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};

export const register = async ({ email, password, name }) => {
  const response = await api.post("/auth/register", {
    email,
    password,
    name,
  });

  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("access_token");
  }
};