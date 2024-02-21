import userRoutes from "./api/user/user.routes";

// app.use("/api/users", userRoutes);

export default [
  {
    path: "users",
    router: userRoutes,
  },
];
