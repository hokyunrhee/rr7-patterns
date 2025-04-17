import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(
    "progressively-enhanced-form-validation",
    "routes/progressively-enhanced-form-validation/route.tsx",
  ),
] satisfies RouteConfig;
