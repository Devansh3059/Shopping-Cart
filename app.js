if (process.env.NODE_ENV !=='production'){
    require("dotenv").config()
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY


var express = require("express");
var app = express();
var fs = require("fs");
const stripe = require('stripe')(stripeSecretKey)

app.use(express.static(__dirname + "/public"));

app.set("view engine","ejs");
app.use(express.json())


app.get("/",function(req,res){
    res.render("tabs/about");
});

app.get("/index",function(req,res){
    res.render("tabs/index");
});

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('tabs/store', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })

app.post("/purchase",function(req,res){
    fs.readFile("items.json",(err,data)=>{
        if(err){
            res.status(500).end()
        }
        else{
            // console.log('purchase')
            const itemsJson=JSON.parse(data)
            const itemsArray = items.Json.music.concat(items.Json.merch)
            let total = 0
            req.body.items.forEach(item => {
                const itemJson = itemsArray.find((i)=>{
                    return i.id == item.id
                })
                total = total + itemJson.price * item*quantity
            });

            stripe.charges.create({
                amount:total,
                source: req.body.stripeTokenId,
                currency:'usd'
            }).then(()=>{
                console.log('charge succesful')
                res.json({ message:'Transaction successful'})
            }).catch(()=>{
                console.log('Failed')
                res.status(500).end()
            })

        }
    })
});

app.listen(5500,function(){
    console.log("Store Started");
});