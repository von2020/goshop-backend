const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *              - username
 *              - email
 *              - password
 *          
 *              properties:
 *                  username:
 *                      type: string
 *                      description: the username of the user
 *                  email:
 *                      type: string
 *                      description: the email of the user
 *                  password:
 *                      type: string
 *                      description: the password of the user
 *      schemas_login:
 *          User:
 *              type: object
 *              required:
 *              - username
 *              - password
 *          
 *              properties:
 *                  username:
 *                      type: string
 *                      description: the username of the user
 *                  password:
 *                      type: string
 *                      description: the password of the user
 *                  
 */


/** 
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *      
 *      description: This api is used to create a single user
 *      tags:
 *         - auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *            description: User Successfully Added
 *            
 *              
 */

// REGISTER
router.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try{
        const savedUser = await newUser.save();
        console.log(savedUser)
        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});


/** 
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *      
 *      description: User Login
 *      tags:
 *         - auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas_login/User'
 *      responses:
 *          200:
 *            description: User successfully logged in
 *            
 *              
 */
// LOGIN
router.post("/login", async(req, res) => {
   
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Wrong Credentials!")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SEC
            );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        
        originalPassword !== req.body.password && 
        res.status(401).json("Wrong Credentials!")
        
        const accessToken =  jwt.sign({
            id:user._id,
             isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn:"3d"}
        );
        const { password,  ...others} = user._doc;

        res.status(200).json({...others, accessToken});

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});


module.exports = router