const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { CLIENT_URL } = process.env;
const { sendEmail } = require("./sendMail");

exports.register = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all this field" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    const user = await Users.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "Email already in use" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      name,
      email,
      passwordHash,
    };
    console.log(newUser);
    const activation_token = createActivationToken(newUser);
    try {
      await sendEmail(activation_token, email);
      const data = new Users({
        name: name,
        email: email,
        password: passwordHash,
        avatar: pic,
      });
      await data.save();
      res.status(200).json({
        data: data,
        e_token: activation_token,
        msg: "Please Activate your mail",
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5d",
  });
};

exports.verifyEmail = async (req, res) => {
  try {
    const verify = await Users.findByIdAndUpdate(
      req.userEmailVerifyId._id,
      {
        is_verified: "true",
      },
      { new: true }
    );
    res
      .status(200)
      .json({ email: verify, message: "Email verification successful" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Email not verified",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      if (user.is_verified == "true") {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        console.log(isValidPassword);
        if (isValidPassword) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET
          );
          console.log(token);
          res.status(200).json({
            data: {
              message: "Login successfully",
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.avatar,

              token: token,
            },
          });
        } else {
          res.status(401).json({
            error: "password invalid",
          });
        }
      } else {
        res.status(401).json({
          error: "Please Verify your email",
        });
      }
    } else {
      res.status(401).json({
        error: "Email and password invalid",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Authentication error",
    });
  }
};

// const createAccessToken = (payload) => {
//   return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });
// };

exports.getAllUser = async (req, res) => {
  // search query for all users

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          // { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // const users = await Users.find(keyword);

  const users = await Users.find(keyword).find({
    _id: { $ne: req.userId._id },
  });
  res.send(users);
};

exports.getAllVerifiedUser = async (req, res) => {
  // search query for all users

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          // { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // const users = await Users.find(keyword);

  const users = await Users.find(keyword).find({
    _id: { $ne: req.userId._id },
    is_verified: "true",
  });
  res.send(users);
};

// const createRefreshToken = (payload) => {
//   return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: "7m",
//   });
// };
