const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

// CREATE ORDER
// router.post("/",verifyToken, async(req,res)=>{
//     Product.findById(req.body.productId)
//     .then(product => {
//         if(!product){
//             return res.status(404).json({
//                 messsage: "Product not found"
//             })
//         }
//     });
    // .catch(err => {
    //     res.status(500).json({
    //         message: "Product Not Found"
            
    //     })
    // })
//     const newOrder = new Order(req.body);
//     console.log('see', newOrder)
//     try{
//         const savedOrder = await newOrder.save();
//         console.log('hey', savedOrder)
//         res.status(200).json(savedOrder);
//     } catch (err){
//         res.status(500).json(err); 
//     }
// })

router.post("/",verifyToken, async(req,res)=>{
    const newOrder = new Order(req.body)
    console.log('see', newOrder)
    try{
        const savedOrder = await newOrder.save();
        console.log('hey', savedOrder)
        res.status(200).json(savedOrder);
    } catch (err){
        res.status(500).json(err); 
    }
})

// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
        {
         $set: req.body
        },
        {new: true}
        );
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

// DELETE 
router.delete("/:id", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET SINGLE ORDER
router.get("/:id", verifyTokenAndAuthorization, async(req,res) => {
    
    try{
        const order = await Order.findById(req.params.id);
        // const order = await Cart.find({ userId: req.params.userId});
        res.status(200).json( order ); 
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res) => {
    
    try{
        const order = await Cart.find({ userId: req.params.userId});
        res.status(200).json( order ); 
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL ORDERS (ADMIN)
router.get("/", verifyTokenAndAdmin, async(req,res) => {
    
    try{
        const orders = await Order.find();         
        res.status(200).json( orders );
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async(req,res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
    try{
        const income = await Order.aggregate([
            { $match: {createdAt: { $gte: previousMonth}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                    sales: "$amount",
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            },
        ]);
        res.status(200).json( income );
        
    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router