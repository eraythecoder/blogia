import { model, Schema } from "mongoose";
import Joi from "joi";

const authSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, 
  },
});

// validate
const validateRegister = (user) => {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(5).max(50).required(),
  });

  
  return schema.validate(user, { allowUnknown: true });
};

const validateLogin = (user) => {
  const schema = new Joi.object({
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(user, { allowUnknown: true });
};

const Auth = model("User", authSchema);
export { Auth, validateRegister, validateLogin };
