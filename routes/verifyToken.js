const res = require("express/lib/response");
const jwt = require("jsonwebtoken");


const verifyToken = (req, res,next)=>{
    const authHeader = req.headers.token
    const authHeader_two = req.headers.authorization
    console.log('heyyyy', authHeader)
    console.log('heyyyy', authHeader_two)
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
            if(err) res.status(403).json("Token is not valid!");
            req.user = user
            next()
        })
    }else if(authHeader_two){
        const token = authHeader_two.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
            if(err) res.status(403).json("Token is not valid!");
            req.user = user
            next()
        })    
    }else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("User is not authorised")
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("User is not authorised")
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };