const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getAllUser,
  getAllVerifiedUser,
  verifyEmail,
} = require("../controllers/userController");

const { checkLogin } = require("../middleware/checkLogin");
const { emailVerify } = require("../middleware/emailVerify");

router.post("/register", register);
router.put("/verify", emailVerify, verifyEmail);
router.post("/login", login);
router.get("/getAllUser", checkLogin, getAllUser);
router.get("/getAllVerifiedUser", checkLogin, getAllVerifiedUser);

module.exports = router;
