const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var  wishes = require("./src/models/models")
const nodemailer = require("nodemailer");
const App = express();
const port = 3000;
const path = require('path');
const { config } = require("dotenv");
require("dotenv").config();


App.listen(process.env.PORT || port,(err)=>{
    if(err)
    console.log(err)
    else
    console.log("connected to server on port "+port)
});

App.use(express.static('./dist/frontend'));


   

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({extended:true}));

var mdatabase= "mongodb+srv://admin:BWYwoqCPIQAxFUcW@cluster0.shdd5hs.mongodb.net/wishes";

const mongodb = "mongodb://localhost:27017/wish";
mongoose.connect(mdatabase || mongodb,{useNewUrlParser:true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log("Connected to Mongodb");
});

App.post("/api/wishdata",(req,res)=>{
console.log("reach");
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
var Data  = {
    myName: req.body.data.myname,
    friendName: req.body.data.frdname,
    friendMail: req.body.data.frdemail
}
var Data = new wishes(Data);
Data.save((err,data)=>{
    if(err)
    console.log(err)
    else
    res.send(data)
});
});

App.get("/api/wishdata/:id",(req,res)=>{
    console.log("reach");
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
    var id = req.params.id;
    wishes.findOne({"_id":id},(err,data)=>{
        if(err)
        console.log(err)
        else
        res.send(data);
    })
    
    });

App.post("/api/sendwishes",(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
    var id = req.body.item;
    console.log(id);
    wishes.findOne({"_id":id},(err,data)=>{
        if(err)
        console.log(err)
        else
        {

            console.log(process.env.username);
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                  }
            });
            let mailDetails = {
                from: 'subizubin98@gmail.com',
                to: data.friendMail,
                subject: 'Happy 2022',
                text: 'Hello '+data.friendName,
                html:"Hello "+data.friendName+",<br>"+data.myName +" send you wishes-> <a href=https://wishes2022.herokuapp.com/wish/"+id+">click here</a>"
            }

            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Email sent successfully');
                    res.send(data)
                }
            });
        }
    })
    
    });
    App.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname + '/dist//frontend/index.html'));
       });