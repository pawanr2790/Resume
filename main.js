var express      =require("express"),
    app          =express(),
	bodyParser   =require("body-parser"),
	flash        =require('connect-flash'),
	passport     =require("passport"),
	LocalStrategy=require("passport-local"),
	overriding   =require("method-override"),
	mongoose     =require("mongoose"),
	User         =require("./models/user.js"),
	// seedDB       =require("./seed.js"),
	Resumes      =require("./models/resume.js");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const keys = require("./config/keys");
const cookieSession = require("cookie-session");
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const routes           = require('./routes');
const config           = require('./config');
var middleware		   =require("./middleware");
const path			   =require("path");
const session 		   = require('cookie-session');

// require("dotenv").config();
// const passportSetup = require("./config/setup");
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(flash());


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: "143091916171-8tif3ded504q32jbvnhs9cmsocn04lmf.apps.googleusercontent.com"/* your clientID*/ ,
        clientSecret:"6PV28YDl6Q1n7ip2bn0nTfx8",
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    _id: new mongoose.Types.ObjectId(),
                    googleId: profile.id,
                    name: profile.displayName,
                    email:profile._json.email
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);




app.use(passport.initialize());
app.use(passport.session());

// app.use(bodyParser.urlencoded({ extended: false }));


// mongoose.connect(process.env.DATABASEURL,{
// 	useNewUrlParser: true,
// 	useCreateIndex: true ,
// 	useUnifiedTopology: true
// });

//if running localdatabase

mongoose.connect("mongodb+srv://Preet:Dejavu1234@preetsingh.a0rfk.mongodb.net/",{
	useNewUrlParser: true,
	useCreateIndex: true ,
	useUnifiedTopology: true
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(overriding("_method"));



app.use('/', routes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});