const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    //  sent token to cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    res.status(statusCode).cookie("olxtoken", token, options).json({
        success: true,
        user,
        token,
    });
};
module.exports = sendToken;
