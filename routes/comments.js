var express= require("express");
var router= express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware= require("../middleware");

// Comments route

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res)
{
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground: campground});
        }
    })
});


router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res)
{
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
            res.redirectt("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, function(err,comment)
            {
                if(err)
                {   req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else{
                    // add username and id to comment
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comments");
                    res.redirect("/campgrounds/"+campground._id);
                }
            })

        }
    }) 
})

// Edit route for comments
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req,res)
{   Comment.findById(req.params.comment_id, function(err, foundComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id:req.params.id, comment: foundComment});
        }
    })
    
})


// update route for comments

router.put("/campgrounds/:id/comments/:comment_id/", middleware.checkCommentOwnership, function(req,res)
{   
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updayedComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    
})

// destroy route

router.delete("/campgrounds/:id/comments/:comment_id/", middleware.checkCommentOwnership,function(req,res)
{
    Comment.findByIdAndRemove(req.params.comment_id, function(err)
    {
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Deleted");
           res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


module.exports= router;