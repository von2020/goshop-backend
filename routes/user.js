const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

const Nexmo = require('nexmo');

// Init nexmo

const nexmo = new Nexmo ({
    apiKey: '15263dd9',
    apiSecret: 'zlDNcuIt0whoXwz2'
}, {debug: true})

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
 *      schemas_updateUser:
 *          User:
 *              type: object
 *              required:
 *              - username
 *              - email
 *          
 *              properties:
 *                  username:
 *                      type: string
 *                      description: the username of the user
 *                  email:
 *                      type: string
 *                      description: the email of the user
 *                  
 */


/** 
 * @swagger
 * /api/v1/users/{id}:
 *  put:
 *      
 *      description: This api is used to update a single user
 *      tags:
 *         - users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      security:
 *	         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas_updateUser/User'
 *      responses:
 *          200:
 *            description: User Successfully Updated
 *            content:
 *              application/json:
 *                 schema:   
 *                 type: array                     
 *                 items:
 *                    $ref: '#components/schemas/User'
 *            
 *              
 */

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async(req,res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
        {
         $set: req.body
        },
        {new: true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});


/** 
 * @swagger
 * /api/v1/users/{id}:
 *  delete:
 *      
 *      description: This api is used to delete a single user
 *      tags:
 *         - users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      security:
 *	         - bearerAuth: []
 *      responses:
 *          200:
 *            description: User deleted successfully
 *              
 */

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req,res) => {
    
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});



/** 
 * @swagger
 * /api/v1/users/find/{id}:
 *  get:
 *      
 *      description: This api is used to get single user from database
 *      tags:
 *         - users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *      security:
 *	         - bearerAuth: []
 *      responses:
 *          200:
 *            description: Successful
 *            content:
 *              application/json:
 *                 schema:   
 *                 type: array                     
 *                 items:
 *                    $ref: '#components/schemas/User'
 *              
 */

// GET SINGLE USER
router.get("/find/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const user = await User.findById(req.params.id);

        const {password, ...others} = user._doc;
        res.status(200).json( others );
    }catch(err){
        res.status(500).json(err);
    }
});


/** 
 * @swagger
 * /api/v1/users:
 *  get:
 *      
 *      description: This api is used to get all users
 *      tags:
 *         - users
 *      security:
 *	         - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 */
// GET ALL USER
router.get("/", verifyTokenAndAdmin, async(req,res) => {
    const query = req.query.new
    try{
        const users = query ? await User.find().sort({_id: -1}).limit(10) : await User.find();

        
        res.status(200).json( users );
    }catch(err){
        res.status(500).json(err);
    }
});


/** 
 * @swagger
 * /api/v1/users/stats:
 *  get:
 *      
 *      description: This api is used to get all users
 *      tags:
 *         - users
 *      security:
 *	         - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to get all users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */
// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async(req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));
    try{
        const data = await User.aggregate([
            { $match: {createdAt: { $gte: lastYear}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: { $sum: 1},
                }
            }
        ])
        res.status(200).json( data );
        
    }catch(err){
        res.status(500).json(err);
    }
});


// TWILIO SMS NOTIFICATION
router.post("/notification", verifyTokenAndAdmin, async(req,res) => {
    
    // try{
        // const user = await User.findById(req.params.id);
        // const {password, ...others} = user._doc;
        const number = req.body.number;
        const text = req.body.text

        nexmo.message.sendSms(
            ''
        )
            

    //     res.status(200).json( others );
    // }catch(err){
    //     res.status(500).json(err);
    // }
});

module.exports = router