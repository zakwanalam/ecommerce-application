import "./config/dotenv.js";   // must be first — loads .env before anything else
import e from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import "./config/db.js";       // initializes & connects MySQL on import
import "./config/firebase.js"; // initializes Firebase on import
import registerRoutes from "./routes.js";

const app = e();

// ── Middleware ────────────────────────────────────────────────
app.use(cookieParser());
app.use(e.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ── Routes ────────────────────────────────────────────────────
registerRoutes(app);

// ── Start Server ──────────────────────────────────────────────
const { PORT } = process.env;
app.listen(PORT || 3000, () => {
  console.log(`app is running on port ${PORT || 3000}`);
});

export default app;
