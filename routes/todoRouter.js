const express = require("express");

const router = express.Router();

const {
  createTodo,
  allTodo,
  specificUserTodo,
  specificTodo,
  deleteTodo,
  specificTodoUpdate,
  likeTodo,
  unLikeTodo,
} = require("../controllers/todoController");

const { checkLogin } = require("../middleware/checkLogin");

router.post("/createTodo", checkLogin, createTodo);
router.get("/getAllTodo", checkLogin, allTodo);
router.get("/specificUserTodo", checkLogin, specificUserTodo);
router.get("/specificTodo/:slug", checkLogin, specificTodo);
router.put("/specificTodoUpdate/:slug", checkLogin, specificTodoUpdate);
router.get("/deleteTodo/:slug", checkLogin, deleteTodo);
router.put("/likeTodo/:slug", checkLogin, likeTodo);
router.put("/unLikeTodo/:slug", checkLogin, unLikeTodo);

module.exports = router;
