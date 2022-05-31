const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
    userId: { type: String, required:true },
    orderId: { type: String, required:true },
    payment_type: { type: String, required:true},
    amount_paid: { type: Number, required:true},
    balance: { type: Number, required:true},
    
},
{ timestamps: true }
);



module.exports = mongoose.model("Payment", paymentSchema);