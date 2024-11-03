import express from "express";
const router = express.Router();


import { getBlogDetailsPage, getBlogsPage, getCategoryBlogsPage, getHomepage } from "../controllers/user.controller.js";



router.get("/blogs/category/:categoryid", getCategoryBlogsPage);

router.get("/blogs/:blogid", getBlogDetailsPage);
router.get("/blogs", getBlogsPage);
router.get("/", getHomepage);

export default router;
