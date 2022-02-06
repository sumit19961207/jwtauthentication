const express = require("express");


const app = express();

app.use(express.json());

const users = [
    {
        id: "1",
        username: "sumit",
        password: "sumit123",
        isAdmin: true
    }, {
        id: "2",
        username: "nikhil",
        password: "nikhil123",
        isAdmin: false
    }
];

//Port route

app.post("/api/login",(req,res)=>{
    const {username, password} =req.body;
    const user = users.find((r)=>{
        return r.username===username && r.password===password;
    });
    if(user){
        res.json(user);
    } else {
        res.status(400).json("Username or password incorrect");
    }
})

app.listen(5000, () => {
    console.log("Backend server is running");
})