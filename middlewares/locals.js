function locals(req, res, next) {
  res.locals.isAuth = req.session.isAuth || false; 
  res.locals.fullname = req.session.user ? req.session.user.fullname : null; 
  res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : null; 
  next();
}

export default locals;
