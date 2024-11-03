import express from "express";
const router = express.Router();

import imageUpload from "../helpers/image-upload.js";
import {
  getBlogCreate,
  getBlogDelete,
  getBlogEdit,
  getBlogsList,
  getCategoriesList,
  getCategoryCreate,
  getCategoryDelete,
  getCategoryEdit,
  postBlogCreate,
  postBlogDelete,
  postBlogEdit,
  postCategoryCreate,
  postCategoryDelete,
  postCategoryEdit,
} from "../controllers/admin.controller.js";

import isAuth from "../middlewares/isAuth.js";

import csrf from "../middlewares/csrf.js";

import { isAdmin } from "../middlewares/isAdmin.js";

router.get("/category/delete/:categoryid", isAuth, csrf, isAdmin, getCategoryDelete);

router.post("/category/delete/:categoryid", isAuth,  isAdmin, postCategoryDelete);

router.get("/category/create", isAuth, csrf, isAdmin, getCategoryCreate);

router.post("/category/create", isAuth, isAdmin, postCategoryCreate);

router.get("/categories/:categoryid", isAuth, csrf, isAdmin, getCategoryEdit);

router.post("/categories/:categoryid", isAuth, isAdmin, postCategoryEdit);

router.get("/categories", isAuth, csrf, isAdmin, getCategoriesList);

router.get("/blog/delete/:blogid", csrf, isAuth, getBlogDelete);

router.post("/blog/delete/:blogid", isAuth, postBlogDelete);

router.get("/blog/create", isAuth, csrf, getBlogCreate);

router.post(
  "/blog/create",
  isAuth,
  imageUpload.upload.single("image"),
  postBlogCreate
);

router.get("/blogs/:blogid", isAuth, csrf, getBlogEdit);

router.post(
  "/blogs/:blogid",
  isAuth,
  imageUpload.upload.single("image"),
  postBlogEdit
);

router.get("/blogs", isAuth, csrf, getBlogsList);

export default router;
