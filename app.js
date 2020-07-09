var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine","ejs");


app.get("/",function(req,res){
    res.render("tabs/about");
});

app.get("/index",function(req,res){
    res.render("tabs/index");
});

app.get("/store",function(req,res){
    res.render("tabs/store");
});

app.listen(5500,function(){
    console.log("Store Started");
});