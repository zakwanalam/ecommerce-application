import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const registerRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api", userRoutes);
  app.use("/api", cartRoutes);
  app.use("/api", orderRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api", adminRoutes);
  app.use("/api", uploadRoutes);
};

export default registerRoutes;
