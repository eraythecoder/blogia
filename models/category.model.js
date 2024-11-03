import { Schema, model } from "mongoose";
import Joi from "joi";

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
});

// validate
const validateCategory = (category) => {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(category, { allowUnknown: true });
};

const Category = model("Category", categorySchema);

export { Category, validateCategory };
