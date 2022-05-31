const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: String, required:true, unique: true },
    products: [
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default: 1,
            },
        },
    ],
    amount: { type: Number, required: true},
    address: { type: Object, required: true}, 
    status: { type: String, default: "pending"},  
    
},
{ timestamps: true }
);


// const orderSchema = new mongoose.Schema({
//     userId: { type: String, required:true, unique: true },
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',  required: true},
//     quantity: { type: Number, default:1, required: true},
//     amount: { type: Number, required: true},
//     address: { type: Object, required: true}, 
//     status: { type: String, default: "pending"},  
    
// },
// { timestamps: true }
// );



module.exports = mongoose.model("Order", orderSchema);