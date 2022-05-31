const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const userRoute =  require("./routes/user");
const authRoute =  require("./routes/auth");
const productRoute =  require("./routes/product");
const cartRoute =  require("./routes/cart");
const orderRoute =  require("./routes/order");
const paymentRoute =  require("./routes/payment");
const fileUpload = require('express-fileupload');
const Nexmo = require('nexmo');

app.use(fileUpload({
    useTempFiles: true
}));


dotenv.config();

mongoose.connect(
    process.env.MONGO_URL
    ).then(() => console.log("DBConnection Successful!")
    ).catch((err)=>{console.log(err)})

const options = {
    // swaggerOptions: {
    //     authAction :{
    //          JWT: {
    //              name: "JWT", schema: {type: "apiKey", in: "headers", name: "Authorization", description: ""
    //             }, 
    //         value: "Bearer <JWT>"
    //     } 
    //     }
    //   },
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GOSHOP API",
            version: "1.0.0",
            description: "A simple E-commerce API"
        },
        servers: [
            {
                url: "http://localhost:5000"
            },
            {
                url: "http://174.138.13.109:5000"
            }
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              }
            }
          },
        
    },
    apis: ["./routes/*.js"]
}

console.log('option', options.components)

console.log('options2', options)

const specs = swaggerJsDoc(options)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))


app.use(express.json());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/payments", paymentRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("backend srver is running")
})