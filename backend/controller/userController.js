const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/getJWTtoken");

const User = require("../models/userModel");
exports.getSingIn = async (req, res, next) => {
    const { name, email, password, phone, place } = req.body;
    const isEmailExisted = await User.findOne({ email });
    if (isEmailExisted) {
        res.status(404).json({
            success: "false",
            message: "user already Existed",
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        place,
    });

    console.log(newUser.joinedOn);
    sendToken(newUser, 201, res);
};

exports.getLogIn = async (req, res, next) => {
    console.log("called");
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        res.status(404).json({
            message: "No user  found",
        });
    } else {
        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordMatch) {
            return res.status(404).json({
                message: "Password didn't match",
            });
        }
        sendToken(existingUser, 201, res);
    }
};
exports.getLogOut = async (req, res) => {
    res.cookie("olxtoken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return res.status(200).json({
        success: true,
        message: "User logged out succesfully",
    });
};

exports.getUserInfo = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user: user,
    });
};
