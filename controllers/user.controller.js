import { Blog } from "../models/blog.model.js";
import { Category } from "../models/category.model.js";

export const getHomepage = async (req, res) => {
  try {
    const blogs = await Blog.find({ homepage: true, approved: true });
    const categories = await Category.find();
    const message = req.session.message;
    delete req.session.message;
    res.render("users/homepage", {
      title: "Anasayfa",
      blogs,
      categories,
      selectedid: "homepage",
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogsPage = async (req, res) => {
  const size = 3;
  const { page = 0 } = req.query;

  try {
    const blogs = await Blog.find({ approved: true })
      .limit(size)
      .skip(page * size);

    const count = await Blog.countDocuments();
    const categories = await Category.find();

    res.render("users/blogs.ejs", {
      title: "Bloglar",
      blogs,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: parseInt(page, 10),
      categories,
      selectedid: null,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBlogDetailsPage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogid);

    if (blog) {
      return res.render("users/blog-details.ejs", {
        title: "Blog Detay",
        blog,
      });
    }

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryBlogsPage = async (req, res) => {
  const size = 3;
  const { page = 0 } = req.query;
  try {
    const blogs = await Blog.find({
      category: req.params.categoryid,
    })
      .populate("category", "_id -name")
      .limit(size)
      .skip(page * size);

    const count = await Blog.countDocuments({
      category: req.params.categoryid,
    });

    const categories = await Category.find();
    const category = await Category.findById(req.params.categoryid);

    if (blogs) {
      return res.render("users/blogs.ejs", {
        title: category.name,
        blogs,
        totalItems: count,
        totalPages: Math.ceil(count / size),
        currentPage: parseInt(page, 10),
        categories,
        selectedid: req.params.categoryid,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
