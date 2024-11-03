// express
import express, { urlencoded } from "express";
const app = express();
import { connectDB, store } from "./config/db.js";
import session from "express-session";
import csurf from "csurf";

// dotenv
import dotenv from "dotenv";
dotenv.config();

// node modules
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/static", express.static(path.join(__dirname, "public")));

// template engine
app.set("view engine", "ejs");

// Database Bağlantısı
connectDB();

// middlewares
app.use(express.json()); // JSON formatındaki istek gövdelerini parse eder
app.use(urlencoded({ extended: false })); // Form verilerini URL-encoded formatında parse eder

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use(csurf());

import locals from "./middlewares/locals.js";
app.use(locals);

// Route işlemleri
import admin from "./routes/admin.route.js";
import user from "./routes/user.route.js";
import auth from "./routes/auth.route.js";
app.use("/admin", admin);
app.use("/auth", auth);
app.use(user);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Blogia is running on port ${PORT}`);
});
