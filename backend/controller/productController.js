const Product = require("../models/productModel");
exports.getAllProduct = async (req, res, next) => {
    // const keyw = req.query.keyword;
    // if (keyw !== "") {
    //     const keyword = keyw
    //         ? {
    //               name: {
    //                   $regex: req.query.keyword,
    //                   $options: "i",
    //               },
    //           }
    //         : {};
    //     const allProducts = await Product.find({ ...keyword });
    //     if (!allProducts) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "No Product",
    //         });
    //     }
    // } else {
    //     const allProducts = await Product.find();
    //     if (!allProducts) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "No Product",
    //         });
    //     }
    // }

    const allProducts = await Product.find();

    console.log("allProducts");
    console.log(allProducts);
    if (!allProducts) {
        return res.status(404).json({
            success: false,
            message: "No Product",
        });
    }
    res.status(200).json({
        success: true,
        message: allProducts,
    });
};
exports.createProduct = async (req, res, next) => {
    const { name, maxBidding, category, description, images, time } = req.body;
    console.log("ss", name, maxBidding, category, description, images, time);
    try {
        console.log("sdddd", req.user);
        const newProduct = await Product.create({
            name,
            maxBidding,
            category,
            description,
            images,
            time,
            createdBy: req.user._id.valueOf(),
        });
        console.log("sdfsdf", newProduct);
        const user = req.user;
        user.waitingProduct.push({
            productId: newProduct._id,
        });
        await user.save();
        res.status(200).json({
            success: true,
            user: user,
            product: newProduct,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error,
        });
    }
};

exports.addBid = async (req, res, next) => {
    const { amount, product_id } = req.body;
    try {
        console.log(product_id);
        const product = await Product.findOne({ _id: product_id });
        console.log(product);
        const user = req.user;
        const productDBTime = product.time;
        const currentTime = new Date(Date.now());
        const productTime = new Date(productDBTime);
        if (productTime.getTime() - currentTime.getTime() < 0) {
            return res.status(404).json({
                success: false,
                message: "Time Expired",
            });
        }

        console.log("sdfsdf");
        if (product.bidding.length > 0) {
            console.log("insedsfdsdf");
            const userBid = product.bidding.filter((bid) => {
                return bid.user === user._id;
            });

            if (userBid.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "User already bid",
                });
            }
        }
        product.bidding.push({
            name: req.user.name,
            amount,
            user: req.user._id,
        });
        await product.save();
        user.biddingProduct.push({
            productId: product.id,
        });
        console.log("sd3");
        await user.save();
        res.status(200).json({
            success: true,
            user,
            product,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error,
        });
    }
};
exports.getSingleProduct = async (req, res) => {
    const product_id = req.params.id;
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "No product exist",
        });
    }
    return res.status(200).json({
        success: true,
        product,
    });
};
