const express = require("express");
const {
    getAllProduct,
    createProduct,
    addBid,
    getSingleProduct,
} = require("../controller/productController");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

router.route("/products").get(getAllProduct);
router.route("/product/create").post(isAuthenticated, createProduct);
router.route("/product/bid").post(isAuthenticated, addBid);
router.route("/product/:id").get(isAuthenticated, getSingleProduct);
module.exports = router;
