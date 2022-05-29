const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

exports.emailVerify = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
    console.log(decoded);
    const { email } = decoded;
    console.log(email);
    // req.email = email;
    // req.userId = userId;
    req.userEmailVerifyId = await Users.findOne({ email: email });
    console.log(req.userEmailVerifyId._id);

    next();
  } catch (err) {
    console.error(err);
    next("Token Invalid");
  }
};
