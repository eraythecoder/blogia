export const isAdmin = (req, res, next) => {
    if (req.session.isAuth && req.session.user && req.session.user.isAdmin) {
      next();
    } else {
      req.session.message = {
        text: "Bu sayfaya erişim yetkiniz yok.",
        class: "danger",
      };
      res.redirect("/"); 
    }
  };
  