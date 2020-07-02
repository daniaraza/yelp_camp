var express= require("express");
var http= require("http");
var bodyParser= require("body-parser");
var app= express();
var mongoose= require("mongoose");
var Campground= require("./models/campground");
var Comment= require("./models/comment");
var passport= require("passport");
var LocalStrategy= require("passport-local");
var User= require("./models/user");
var methodOveride= require("method-override");
var seedDB= require("./seeds")
var flash= require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// seedDB();
// seed the db

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOveride("_method"));
app.use(flash());

// passport Configuration
app.use(require("express-session")(
    {
        secret: "Rusty wins",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
    res.locals.currentUser= req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});


mongoose.connect("mongodb://localhost/yelpcamp")
app.set("view engine", "ejs");
server= http.createServer(app);


// Campground.create(
//     {
//         name: "dania",
//         school: "aaa",
//         description: "whatever"
//     }, function(err, campground){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("new created");
//         console.log(campground)
//     }}
// ); 

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("yelp")
})

server.listen(8080);