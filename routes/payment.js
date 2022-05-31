const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();


// CREATE PAYMENT
router.post("/",verifyToken, async(req,res)=>{
    const newPayment = new Payment(req.body)
    console.log('see', newPayment)
    try{
        const savedPayment = await newPayment.save();
        console.log('hey', savedPayment)
        res.status(200).json(savedPayment);
    } catch (err){
        res.status(500).json(err); 
    }
})

// UPDATE PAYMENT
router.put("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
        {
         $set: req.body
        },
        {new: true}
        );
        res.status(200).json(updatedPayment);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE 
router.delete("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        await Payment.findByIdAndDelete(req.params.id);
        res.status(200).json("Payment has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET SINGLE PAYMENT
router.get("/:id", verifyTokenAndAuthorization, async(req,res) => {
    
    try{
        const payment = await Payment.findById(req.params.id);
        res.status(200).json( payment ); 
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER PAYMENTS
router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res) => {
    
    try{
        const payment = await Payment.find({ userId: req.params.userId});
        res.status(200).json( payment ); 
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL PAYMENTS (ADMIN)
router.get("/", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const payments = await Payment.find();         
        res.status(200).json( payments );
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY PAYMENTS (ADMIN)
router.get("/income", verifyTokenAndAdmin, async(req,res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
    try{
        console.log('heyyyythere')
        const payment = await Payment.aggregate([
            { $match: {createdAt: { $gte: previousMonth}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                    sales: "$amount_paid",
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            },
        ]);
        console.log('payment', payment)
        res.status(200).json( payment );
        
    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router