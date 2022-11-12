const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    place: { type: String, require: true },
    phone: { type: Number, required: true },
    sellProduct: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
            },
        },
    ],
    waitingProduct: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
            },
        },
    ],
    biddingProduct: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
            },
        },
    ],
    boughtProduct: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
            },
        },
    ],
    joinedOn: { type: Date, default: Date.now },
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
module.exports = mongoose.model("User", userSchema);
