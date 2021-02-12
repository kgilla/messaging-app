const passport = require("passport");

const requireSignin = function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      const err = {};
      err.status = 400;
      err.code = "CP_SI_ValidationFailed";
      err.msg = info.msg;
      return res.json(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = {
  requireSignin,
};
