const express = require("express");
const jwt = require("jsonwebtoken");



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
    },{
        id: "3",
        username: "kamal",
        password: "kamal123",
        isAdmin: true
    }
];

let refreshTokens = [];

app.post("/api/refresh", (req,res)=>{
    //take refresh token from the user
    const refreshToken = req.body.token;


    if(!refreshToken) return res.status(401).json("you are not authenticated!");

    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json("Refresh token is not valid!");
    };

    jwt.verify(refreshToken, "myRefreshSecretkey", (err,user)=>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token)=>token !== refreshToken);
        const newAcessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            acessToken : newAcessToken,
            refreshToken : newRefreshToken,
            Hello: "Sumit"
        })
    })

});

const generateAccessToken = (user) => {
    return jwt.sign({id:user.id,isAdmin:user.isAdmin},"mySecretkey", {expiresIn: "1m"});
};

const generateRefreshToken = (user) => {
    return jwt.sign({id:user.id,isAdmin:user.isAdmin},"myRefreshSecretkey");   
}

//Port route

app.post("/api/login",(req,res)=>{
    const {username, password} =req.body;
    const user = users.find((r)=>{
        return r.username===username && r.password===password;
    });
    if(user){
        //Generate an access token
        const acessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        refreshTokens.push(refreshToken);
        res.json({
            username:user.username,
            isAdmin:user.isAdmin,
            acessToken,
            refreshToken
        });
    } else {
        res.status(400).json("Username or password incorrect");
    }
});


const verify = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token,"mysecreactkey", (err,user)=>{
          if(err){
              res.status(403).json("Token is invalid");
          }
          req.user=user;
          next();
        });
    }else{
        res.status(401).json("You are not authenticated");
    }
};

app.delete("/api/users/:userId", verify, (req,res)=>{
    if(req.user.id=== req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted");
    }else{
        res.status(403).json("You are not allowed to deleted");
    }
})

app.listen(5000, () => {
    console.log("Backend server is running");
});