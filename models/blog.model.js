import { model, Schema } from "mongoose";
import Joi from "joi";

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  homepage: {
    type: Boolean,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",  
    required: true
  }
});

const validateBlog = (blog) => {
  const schema = new Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).max(500).required(),
    homepage: Joi.optional(), 
    approved: Joi.optional(),
  });

  return schema.validate(blog, { allowUnknown: true });
};


const Blog = model("Blog", blogSchema);

export { Blog, validateBlog };
