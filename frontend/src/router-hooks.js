import { useContext } from "react";
import RouterContext from "./router-context";

export const useRouter = () => useContext(RouterContext);
export const useNavigate = () => useRouter().navigate;
export const useSearchParams = () => [new URLSearchParams(useRouter().search)];
export const useParams = () => {
  const { pathname } = useRouter();
  const match = pathname.match(/^\/products\/(\d+)$/);
  return { productId: match?.[1] };
};

export const useOrderParams = () => {
  const { pathname } = useRouter();
  const match = pathname.match(/^\/orders\/(\d+)$/);
  return { orderId: match?.[1] };
};

export const useAdminProductParams = () => {
  const { pathname } = useRouter();
  const match = pathname.match(/^\/admin\/products\/(\d+)\/edit$/);
  return { productId: match?.[1] };
};

export const useAdminOrderParams = () => {
  const { pathname } = useRouter();
  const match = pathname.match(/^\/admin\/orders\/(\d+)$/);
  return { orderId: match?.[1] };
};
