var express= require("express");
var router= express.Router();
var Campground= require("../models/campground");
var middleware= require("../middleware");


// Index Route
router.get("/campgrounds", function(req,res)
{
    Campground.find(
    {}, function(err, allCampgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("./campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    }
);
    
});

// Create Route
router.post("/campgrounds", middleware.isLoggedIn,function(req,res)
{
    console.log("Post route");
    var name= req.body.name;
    var school= req.body.school;
    var desc= req.body.description;
    var author= {
        id: req.user._id,
        username:req.user.username
    }
    var newCampgrounds= {name:name, school:school, description: desc, author:author};
    Campground.create(newCampgrounds, function(err, newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect("/campgrounds")
            console.log(newlyCreated);
            console.log(newCampgrounds);
        }
    })
});

// New Route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res)
{
    res.render("./campgrounds/new.ejs");
});

// Show Route
router.get("/campgrounds/:id", function(req,res)
{
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground)
    {
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
            res.render("./campgrounds/show.ejs", {campground: foundCampground});

        }
    });
})


// Edit campgrounds
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req,res)
    {  Campground.findById(req.params.id, function(err, foundCampground)
        {
           res.render("./campgrounds/edit.ejs", {campground: foundCampground});
                });
});

// update campgrounds
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership ,function(req,res)
{   var data= {name: req.body.name, school: req.body.school, description: req.body.description }
    Campground.findByIdAndUpdate(req.params.id,data, function(err,updatedCampground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    } )
})


// destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership ,function(req,res)
{
    Campground.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports= router;