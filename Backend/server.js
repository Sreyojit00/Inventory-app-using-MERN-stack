const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const cartRoute = require("./router/cart");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/product");
const connectDB = require("./config/db");
require('dotenv').config();


const app = express();
const PORT = 4000;
connectDB();
app.use(express.json());
app.use(cors(
  {
    origin: ["http://localhost:3000", "https://yourfrontend.com"]
  }

));

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

//Cart API
app.use("/api/cart", cartRoute);

// ------------- Signin --------------
let userAuthCheck;
app.post("/api/login", async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("Logged in User: ", user);
    if (user) {
      res.send(user);
      userAuthCheck = user;

    } else {
      res.status(401).send("Invalid Credentials");
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/api/update-inventory', async (req, res) => {
  const { cart } = req.body; // Expect cart as an array of { productId, quantity }

  console.log("Received Cart Data:", cart); // Debugging log

  try {
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (product) {

        if (product.quantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        product.quantity -= item.quantity;
        await product.save();
      }
    }
    res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error("Error updating inventory:", error); // Debugging log
    res.status(500).json({ message: 'Error updating inventory' });
  }
});


// Getting User Details of login user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});
// ------------------------------------

// Registration API
app.post("/api/register", (req, res) => {
  let registerUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
  });

  registerUser
    .save()
    .then((result) => {
      res.status(200).send(result);
      alert("Signup Successfull");
    })
    .catch((err) => console.log("Signup: ", err));
  console.log("request: ", req.body);
});


// Here we are listening to the server
app.listen(PORT, () => {
  console.log(`I am live again on PORT ${PORT}`);
});
