import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateMyProfile = async ({
  name,
  password,
}) => {
  const response = await api.patch(
    "/users/me",
    {
      name,
      password,
    }
  );

  return response.data;
};