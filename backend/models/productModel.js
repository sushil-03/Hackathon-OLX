const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    maxBidding: { type: Number },
    category: { type: String, required: true },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    description: { type: String, required: true },
    time: { type: Date },
    bidding: [
        {
            name: { type: String },
            amount: { type: Number },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        },
    ],
    soldTo: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    images: [
        {
            type: String,
        },
    ],
});
module.exports = mongoose.model("Product", productSchema);
