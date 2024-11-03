import fs from "fs";

import { Blog, validateBlog } from "../models/blog.model.js";
import { Category, validateCategory } from "../models/category.model.js";

export const getBlogsList = async (req, res) => {
  try {
    let blogs;
    if (req.session.user.isAdmin) {
      blogs = await Blog.find();
    } else {
      const user = req.session.user.id;
      blogs = await Blog.find({ user });
    }

    res.render("admin/blog-list.ejs", {
      title: "Bloglar",
      blogs,
      action: req.query.action,
      blogname: req.query.blogname,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCategoriesList = async (req, res) => {
  try {
    const categories = await Category.find();

    res.render("admin/category-list.ejs", {
      title: "Kategoriler",
      categories,
      action: req.query.action,
      categoryname: req.query.categoryname,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogEdit = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogid);
    const categories = await Category.find();

    const message = req.session.message;
    delete req.session.message;

    if (blog) {
      return res.render("admin/blog-edit.ejs", {
        title: "Blog Düzenle",
        blog,
        categories,
        message,
      });
    }

    res.redirect("/admin/blogs");
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryEdit = async (req, res) => {
  const categoryid = req.params.categoryid;
  const message = req.session.message;
  delete req.session.message;
  try {
    const category = await Category.findById(categoryid);

    if (category) {
      return res.render("admin/category-edit.ejs", {
        title: "Kategori Düzenle",
        category,
        message,
      });
    }

    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
};

export const postBlogEdit = async (req, res) => {
  const { error } = validateBlog(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };
    return res.redirect(`/admin/blogs/${req.body.blogid}`);
  }

  const blogid = req.body.blogid;
  const title = req.body.title;
  const description = req.body.description;

  let image = req.body.image;

  if (req.file) {
    const newImage = req.file.filename;

    if (req.body.category === "-1") {
      req.session.message = {
        text: "Lütfen bir kategori seçiniz.",
        class: "warning",
      };

      fs.unlink("./public/images/" + newImage, (err) => {
        if (err) console.log(err);
      });
      return res.redirect(`/admin/blogs/${blogid}`);
    } else {
      image = newImage;

      fs.unlink("./public/images/" + req.body.image, (err) => {
        if (err) console.log(err);
      });
    }
  }

  const category = req.body.category;
  const homepage = req.body.homepage == "on" ? true : false;
  const approved = req.body.approved == "on" ? true : false;

  try {
    await Blog.findByIdAndUpdate(
      blogid,
      {
        $set: {
          title,
          description,
          image,
          category,
          homepage,
          approved,
        },
      },
      { new: true }
    );

    res.redirect(`/admin/blogs?action=edit&blogname=${title}`);
  } catch (error) {
    console.log(error);
  }
};

export const postCategoryEdit = async (req, res) => {
  const { error } = validateCategory(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };

    return res.redirect(`/admin/categories/${req.body.categoryid}`);
  }

  const categoryid = req.body.categoryid;
  const name = req.body.name;
  try {
    await Category.findByIdAndUpdate(categoryid, {
      $set: {
        name,
      },
    });
    res.redirect(`/admin/categories?action=edit&categoryname=${name}`);
  } catch (error) {
    console.log(error);
  }
};

export const getBlogCreate = async (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    const categories = await Category.find();

    res.render("admin/blog-create.ejs", {
      title: "Blog Oluştur",
      categories,
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryCreate = (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    res.render("admin/category-create.ejs", {
      title: "Kategori Oluştur",
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postBlogCreate = async (req, res) => {
  const { error } = validateBlog(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };
    return res.redirect(`/admin/blog/create`);
  }

  if (!req.file) {
    req.session.message = {
      text: "Resim yüklenmesi zorunludur.",
      class: "warning",
    };
    return res.redirect(`/admin/blog/create`);
  }

  if (req.body.category === "-1") {
    req.session.message = {
      text: "Geçerli bir kategori seçmelisiniz.",
      class: "warning",
    };
    return res.redirect(`/admin/blog/create`);
  }

  const title = req.body.title;
  const description = req.body.description;
  const image = req.file.filename;
  const category = req.body.category;
  const homepage = req.body.homepage == "on" ? true : false;
  const approved = req.body.approved == "on" ? true : false;
  const user = req.session.user.id;

  const newBlog = new Blog({
    title,
    description,
    image,
    category,
    homepage,
    approved,
    user,
  });

  try {
    await newBlog.save();
    res.redirect(`/admin/blogs?action=create&blogname=${title}`);
  } catch (error) {
    console.log(error);
  }
};

export const postCategoryCreate = async (req, res) => {
  const { error } = validateCategory(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };

    return res.redirect("/admin/category/create");
  }

  const name = req.body.name;
  const newCategory = new Category({ name });
  try {
    await newCategory.save();

    res.redirect(`/admin/categories?action=create&categoryname=${name}`);
  } catch (error) {
    console.log(error);
  }
};

export const getBlogDelete = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogid);

    if (blog) {
      return res.render("admin/blog-delete.ejs", {
        title: "Aşağıdaki Blogu Silmek İster misiniz?",
        blog,
      });
    }

    res.redirect("/admin/blogs");
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryDelete = async (req, res) => {
  const categoryid = req.params.categoryid;
  try {
    const category = await Category.findById(categoryid);

    if (category) {
      return res.render("admin/category-delete.ejs", {
        title: "Aşağıdaki Kategoriyi Silmek İster misiniz?",
        category,
      });
    }

    res.redirect("/admin/categories");
  } catch (error) {
    console.log(error);
  }
};

export const postBlogDelete = async (req, res) => {
  const blogid = req.body.blogid;
  const image = req.body.image;

  try {
    const blog = await Blog.findByIdAndDelete(blogid);

    fs.unlink("./public/images/" + image, (err) => {
      console.log(err);
    });

    res.redirect(`/admin/blogs?action=delete&blogname=${blog.title}`);
  } catch (error) {
    console.log(error);
  }
};

export const postCategoryDelete = async (req, res) => {
  const categoryid = req.body.categoryid;
  try {
    const categoryDelete = await Category.findByIdAndDelete(categoryid);

    res.redirect(
      `/admin/categories?action=delete&categoryname=${categoryDelete.name}`
    );
  } catch (error) {
    console.log(error);
  }
};
