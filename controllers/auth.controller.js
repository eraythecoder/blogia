import { Auth, validateRegister, validateLogin } from "../models/auth.model.js";
import bcrypt from "bcrypt";

export const getRegister = (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    res.render("auth/register.ejs", {
      title: "Kayıt Olun",
      message,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postRegister = async (req, res) => {
  const { error } = validateRegister(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };

    return res.redirect("/auth/register");
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const isSameUser = await Auth.findOne({ email });

    if (isSameUser) {
      req.session.message = {
        text: "Girdiğiniz email adresiyle daha önce kayıt olunmuş.",
        class: "warning",
      };
      return res.redirect("/auth/register");
    }

    const newAccount = new Auth({
      fullname: name,
      email: email,
      password: hashedPassword,
      isAdmin: false,
    });

    await newAccount.save();

    req.session.message = {
      text: "Hesabınıza giriş yapabilirsiniz",
      class: "success",
    };

    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
};

export const getLogin = (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    res.render("auth/login.ejs", {
      title: "Giriş Yapınız",
      message,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const postLogin = async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    req.session.message = {
      text: error.details[0].message,
      class: "warning",
    };

    return res.redirect("/auth/login");
  }

  const email = req.body.email;
  const password = req.body.password;
  try {
    const account = await Auth.findOne({ email: email });

    if (!account) {
      req.session.message = {
        text: "Hatalı email girdiniz",
        class: "warning",
      };
      return res.redirect("/auth/login");
    }

    const match = await bcrypt.compare(password, account.password);

    if (!match) {
      req.session.message = {
        text: "Hatalı şifre girdiniz",
        class: "warning",
      };
      return res.redirect("/auth/login");
    }

    req.session.isAuth = true;
    req.session.user = {
      id: account._id,
      fullname: account.fullname,
      isAdmin: account.isAdmin,
    };

    await account.save();

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const getLogout = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
};
