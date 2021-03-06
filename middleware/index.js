// all middleware goes here
var middlewareObj=  {};
var Campground= require("../models/campground");
var Comment= require("../models/comment")

middlewareObj.checkCampgroundOwnership = function(req,res,next)
    {
        if(req.isAuthenticated())
        {  Campground.findById(req.params.id, function(err, foundCampground)
            {
                if(err)
                {   req.flash("error", "Couldnt find Campground");
                    res.redirect("back");
                }
                else{
                    // one is a mongoose object and one is a string
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error", "You dont have the permission to do that")
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            req.flash("error", "You need to be logged in")
            res.redirect("back");
        }}



middlewareObj.checkCommentOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
    {  Comment.findById(req.params.comment_id, function(err, foundComment)
        {
            if(err)
            {
                res.redirect("back");
            }
            else{
                // one is a mongoose object and one is a string
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }}

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "You need to login first");
    res.redirect("/login");
}

module.exports= middlewareObj;