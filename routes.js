const passport = require("passport");
const express = require("express");
var router = express.Router();
const session = require("express-session");
const Resumes = require("./models/resume.js"),
  bodyParser = require("body-parser"),
  overriding = require("method-override");
var middleware = require("./middleware");
var User = require("./models/user.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(overriding("_method"));

router.get("/", function (req, res) {
  res.render("landing.ejs");
});

//Landing page of website
router.get("/landing", function (req, res) {
  res.render("landing.ejs");
});

router.get("/resume", function (req, res) {
  Resumes.find({}, function (err, allResumes) {
    if (err) {
      console.log(err);
    } else {
      res.render("resume/resume.ejs", {
        resumes: allResumes,
        currentUser: req.user,
      });
    }
  });
  // get the user out of session and pass to template
});

// New Resume Form Link
router.get("/resume/new/personal", middleware.isLoggedIn, (req, res) => {
  res.render("resume/personal");
});

//posting data from new resume to show page
router.post("/resume", middleware.isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  console.log(req.body.name);
  var name = req.body.name;
  var email = req.body.email;
  var contact = req.body.contact;
  var education = req.body.education;
  var skills = req.body.skills;
  var personalProjects = req.body.personalProjects;
  var achievements = req.body.achievements;
  var hobbies = req.body.hobbies;
  var accountLinks = req.body.accountLinks;
  var work_projects = req.body.work_projects;
  var author = {
    googleId: req.user.googleId,
    name: req.user.name,
  };

  var newResume = {
    name: name,
    email: email,
    contact: contact,
    education: education,
    skills: skills,
    personalProjects: personalProjects,
    achievements: achievements,
    hobbies: hobbies,
    accountLinks: accountLinks,
    author: author,
    work_projects: work_projects,
  };

  Resumes.create(newResume, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      req.flash("success", "New Resume Created");
      res.redirect("/resume");
    }
  });
});

//View Resumes//
router.get("/resume/pro/:id", middleware.isLoggedIn, function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err || !foundResume) {
      req.flash("error", "Resume Not Found");
      res.redirect("back");
    } else {
      console.log(foundResume, "found");
      // render show template with that resume
      res.render("resume/show", { resume: foundResume });
    }
  });
});

// router.get("/register",function(req,res){
// 	res.render("register.ejs");
// });

// router.post("/register",function(req,res){
// 	var newUser=new User({username:req.body.username});
// 	User.register(newUser,req.body.password,function(err,user){
// 		if(err){
// 			req.flash("error",err.message);
// 			res.redirect("/register");
// 		}
// 		else{
// 			passport.authenticate("local")(req,res,function(){
// 				req.flash("success","Welcome to Resume Builder "+ user.username);
// 				res.redirect("/resume");
// 			});
// 		}
// 	});
// });

// router.get("/login",function(req,res){
// 	res.render("login.ejs",{message:req.flash("error")});
// });

// router.post("/login",passport.authenticate("local",
// {
// 	successRedirect:"/resume",
// 	failureRedirect:"/login",
// 	failureFlash: true
// }
// ),function(req,res){

// });

router.get("/resume/normal/:id", middleware.isLoggedIn, function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err || !foundResume) {
      res.redirect("back");
    } else {
      console.log(foundResume, "found normal");
      // render show template with that resume
      res.render("resume/newVersion3", { resume: foundResume });
    }
  });
});

//edit routes//
router.get("/resume/pro/:id/edit", function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundResume, "edit");
      // render show template with that resume
      res.render("resume/edit", { resume: foundResume, redirect: "pro" });
    }
  });
});

router.get("/resume/normal/:id/edit", function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundResume, "edit normal");
      // render show template with that resume
      res.render("resume/edit", { resume: foundResume, redirect: "normal" });
    }
  });
});

router.put("/resume/pro/:id", function (req, res) {
  Resumes.findByIdAndUpdate(
    req.params.id,
    req.body.resume,
    function (err, updatedResumes) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/resume");
      } else {
        req.flash("success", "Successfully Updated Resume");
        res.redirect("/resume/pro/" + req.params.id);
      }
    }
  );
});

router.put("/resume/normal/:id", function (req, res) {
  Resumes.findByIdAndUpdate(
    req.params.id,
    req.body.resume,
    function (err, updatedResumes) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/resume");
      } else {
        req.flash("success", "Successfully Updated Resume");
        res.redirect("/resume/normal/" + req.params.id);
      }
    }
  );
});

//download routes//

router.get("/resume/normal/:id/download", function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundResume, "download");
      // render show template with that resume
      res.render("resume/template3", { resume: foundResume });
    }
  });
});

router.get("/resume/pro/:id/download", function (req, res) {
  //find the resume with provided ID
  Resumes.findById(req.params.id, function (err, foundResume) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundResume, "pro download");
      // render show template with that resume
      res.render("resume/downloadpreview", { resume: foundResume });
    }
  });
});

router.delete("/resume/pro/:id", function (req, res) {
  Resumes.findByIdAndDelete(
    req.params.id,
    req.body.resume,
    function (err, updatedResumes) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/resume");
      } else {
        req.flash("success", "Successfully Deleted Resume");
        res.redirect("/resume");
        // res.send("it worked");
      }
    }
  );
});
router.delete("/resume/normal/:id", function (req, res) {
  Resumes.findByIdAndDelete(
    req.params.id,
    req.body.resume,
    function (err, updatedResumes) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/resume");
      } else {
        req.flash("success", "Successfully Deleted Resume");
        res.redirect("/resume");
        // res.send("it worked");
      }
    }
  );
});

//google auth routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.render("landing.ejs");
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/google");
  // res.redirect("http://localhost:3000/resume")
});

module.exports = router;
