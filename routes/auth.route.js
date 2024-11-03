import express from "express";
const router = express.Router();

import { getLogin, getLogout, getRegister, postLogin, postRegister } from "../controllers/auth.controller.js";

import csrf from "../middlewares/csrf.js";

router.get("/register", csrf, getRegister);

router.post("/register",  postRegister);

router.get("/login", csrf, getLogin);

router.post("/login",  postLogin);

router.get("/logout", csrf, getLogout);

export default router;
