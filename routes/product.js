const Product = require("../models/Product");
const productCategory = require("../models/ProductCategory");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
// const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const router = require("express").Router();
const { append } = require("express/lib/response");
const cloudinary = require('cloudinary').v2
const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');

app.use(fileUpload({
    useTempFiles: true
}));

cloudinary.config({
    cloud_name: 'dxzrwvflo',
    api_key: '248583444414373',
    api_secret: 'C1i08PVkjl0ht6vRxGXvq5GeUoc'
})




/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              required:
 *              - title
 *              - desc
 *              - img
 *              - categories
 *              - size
 *              - color
 *              - price
 *          
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the product
 *                  desc:
 *                      type: string
 *                      description: the description of the product
 *                  img:
 *                      type: string
 *                      description: the img of the product
 *                  categories:
 *                      type: string
 *                      description: the categories of the product
 *                  size:
 *                      type: string
 *                      description: the size of the product
 *                  color:
 *                      type: string
 *                      description: the color of the product
 *                  price:
 *                      type: string
 *                      description: the price of the product
 *      schemas_addProduct:
 *          Product:
 *              type: object
 *              required:
 *              - title
 *              - desc
 *              - img
 *              - categories
 *              - size
 *              - color
 *              - price
 *          
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the product
 *                  desc:
 *                      type: string
 *                      description: the description of the product
 *                  img:
 *                      type: string
 *                      description: the img of the product
 *                  categories:
 *                      type: string
 *                      description: the categories of the product
 *                  size:
 *                      type: string
 *                      description: the size of the product
 *                  color:
 *                      type: string
 *                      description: the color of the product
 *                  price:
 *                      type: string
 *                      description: the price of the product
 * 
 * 
 *      schemas_updateProduct:
 *          Product:
 *              type: object
 *              required:
 *              - title
 *              - desc
 *              - img
 *              - categories
 *              - size
 *              - color
 *              - price
 *          
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of the product
 *                  desc:
 *                      type: string
 *                      description: the description of the product
 *                  img:
 *                      type: string
 *                      description: the img of the product
 *                  categories:
 *                      type: string
 *                      description: the categories of the product
 *                  size:
 *                      type: string
 *                      description: the size of the product
 *                  color:
 *                      type: string
 *                      description: the color of the product
 *                  price:
 *                      type: string
 *                      description: the price of the product
 *                  
 */


/** 
 * @swagger
 * /api/v1/products:
 *  post:
 *      
 *      description: This api is used to add product
 *      tags:
 *         - product
 *      security:
 *	         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas_addProduct/Product'
 *      responses:
 *          200:
 *            description: Product Successfully Added
 *            
 *              
 */

// CREATE PRODUCT
router.post("/",verifyTokenAndAdmin,  async(req, res) => {
    const newProduct = new Product(req.body);
    console.log('seeP', newProduct)
    
    try{
        const savedProduct = await newProduct.save();
        console.log('savedp', savedProduct)   
        
        res.status(200).json(savedProduct);
    } catch (err){
        res.status(500).json(err); 
    }
})

// CREATE PRODUCT CATEGORY
router.post("/category",verifyTokenAndAdmin,  async(req, res) => {
    const newCategory = new productCategory(req.body);
    console.log('seeP', newCategory)
    
    try{
        const savedCategory = await newCategory.save();
        console.log('savedp', savedCategory)   
        
        res.status(200).json(savedCategory);
    } catch (err){
        res.status(500).json(err); 
    }
})


// UPLOAD PRODUCT IMAGE
router.post("/image",verifyTokenAndAdmin,  function(req, res, next) {
    console.log('files', req.files)
    
    
    try{
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
        const file = req.files.image;
        console.log('file', file)
        cloudinary.uploader.upload(file.tempFilePath, function(err, result){
            console.log('error', err)
            console.log('result', result)
            res.send({
                success: true,
                result
            })
        });
        
         
    } catch (err){
        res.status(500).json(err); 
    }
})

// UPLOAD PRODUCT IMAGE
router.post("/image_two",verifyTokenAndAdmin,  function(req, res, next) {
    console.log('files', req.files)
    
    
    try{
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
        const file = req.files.image;
        console.log('file', file)
        cloudinary.uploader.upload(file.tempFilePath, function(err, result){
            console.log('error', err)
            console.log('result', result)
            res.send({
                success: true,
                result
            })
        });
        
         
    } catch (err){
        res.status(500).json(err); 
    }
})

/** 
 * @swagger
 * /api/v1/products/{id}:
 *  put:
 *      
 *      description: This api is used to update a product
 *      tags:
 *         - product
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
 *                      $ref: '#components/schemas_updateProduct/Product'
 *      responses:
 *          200:
 *            description: Product Successfully Updated
 *            content:
 *              application/json:
 *                 schema:   
 *                 type: array                     
 *                 items:
 *                    $ref: '#components/schemas_updateProduct/Product'
 *            
 *              
 */

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
        {
         $set: req.body
        },
        {new: true}
        );
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET PRODUCTS
router.get("/find/:id",  async(req,res) => {
    
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json( product ); 
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS
router.get("/", async(req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category; 
    try{
        let products; 

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in:[qCategory],
                },
            });
        }else{
            products = await Product.find();
        }

        
        res.status(200).json( products );
    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router