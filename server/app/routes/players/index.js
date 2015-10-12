'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var User = mongoose.model("User");

router.get("/me", function(req,res){
    if(req.user){
        User.findOne({_id:req.user._id})
        .then((foundUser) => {
            res.json(foundUser);
        }) 
    }else{
        res.json({player:"notLoggedIn"});
    }
});

router.put("/", function(req,res){
    if(req.user){
        User.findOne({_id:req.user._id})
        .then((foundUser) => {
            foundUser.game = req.body;
            return foundUser.save();
        })
        .then((savedUser) => {
            res.json(savedUser);
        })
    }else{
        res.json({player: "notLoggedIn"})
    }
});