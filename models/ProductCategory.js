const mongoose = require("mongoose");


const productCategorySchema = new mongoose.Schema({
    name: { type: String, required:true, unique: true }, 
},
{ timestamps: true }
);




module.exports = mongoose.model("productCategory", productCategorySchema);