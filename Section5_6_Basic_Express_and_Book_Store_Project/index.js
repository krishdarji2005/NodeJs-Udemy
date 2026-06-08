const express = require("express");

const app = express();
//this created an application for me
//using this you can structure my server

app.get("/", (req, res) => {
  res.end("Home Page");
});

app.get("/contact-us", (req, res) => {
  // req.header();
  // res.json()
  res.end("contact: email : abc@gmail.com");
});
app.post('/tweets',(req,res)=>{
  res.end('here are your tweets')
})
//default status code 200

app.post('/tweet',(req,res)=>{
  res.status(201).end('Sucessfully tweeted')
})

app.listen(8000, ()=>{
  console.log('Listening on port 8000');
  
})


//code is well structures and manage by express