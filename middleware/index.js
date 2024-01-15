var middlewareObj = {};

var Resume = require("../models/resume.js");
var user = require("../models/user.js");

middlewareObj.checkResumeOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Resume.findById(req.params.id, function (err, foundResume) {
      // || ! foundCampground is imp to prevent breaking down of aur app if obj id is chnaged
      if (err || !foundResume) {
        // req.flash("error","Resume Not Found");
        res.send(err);
        res.redirect("back");
      } else {
        //does campground belong to the user
        if (foundResume.author.googleId.equals(req.user._googleId)) {
          next();
        } else {
          req.flash("error", "You dont have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to login first to do that!");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to login first to do that!");
  res.redirect("/auth/google");
};

module.exports = middlewareObj;
