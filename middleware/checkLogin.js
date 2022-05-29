const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

exports.checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  try {
    const token = authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // const { email, userId } = decoded;
    // req.email = email;
    // req.userId = userId;
    req.userId = await Users.findById(decoded.userId);

    // console.log(req.userId);
    next();
  } catch (err) {
    console.error(err);
    next("authentication error");
  }
};
