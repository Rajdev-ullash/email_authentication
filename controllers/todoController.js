const Todo = require("../models/todoModel");
const slugify = require("slugify");
const Users = require("../models/userModel");

exports.createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(404).json({ message: "All field are requires" });
  }

  try {
    const todo = new Todo({
      title: title,
      slug: slugify(title),
      description: description,
      posted_by: req.userId._id,
    });

    await todo.save();
    await Users.updateMany(
      { _id: req.userId._id },
      { $push: { post: todo._id } }
    );
    res.status(200).json({
      data: todo,
      message: "Todo created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Something went wrong",
    });
  }
};

exports.allTodo = async (req, res) => {
  try {
    const todo = await Todo.find({})
      .populate("posted_by", "-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      results: todo,
      message: "Todo was successfully found",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Todo not found",
    });
  }
};

exports.specificUserTodo = async (req, res) => {
  try {
    const users = await Users.find({
      _id: { $eq: req.userId._id },
      is_verified: "true",
    })
      .sort({ createdAt: -1 })
      .populate("post");
    console.log(users);
    res.send(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Todo not found",
    });
  }
};

exports.specificTodo = async (req, res) => {
  try {
    let specificTodo = await Todo.findOne({ slug: req.params.slug });
    res.status(200).json({
      data: specificTodo,
      message: "Todo found successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Todo not found",
    });
  }
};

exports.specificTodoUpdate = async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: req.body.name,
        slug: slugify(req.body.name),
        description: req.body.description,
      },
      { new: true }
    );
    await Users.findOneAndUpdate({ $push: { post: updated._id } });
    res.status(200).json({
      data: updated,
      message: "Todo updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Category not found",
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    let category = await Todo.findOneAndDelete({ slug: req.params.slug });
    res.status(200).json({
      data: category,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Category not found",
    });
  }
};

exports.likeTodo = async (req, res) => {
  try {
    const liked = await Todo.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { likes: req.userId._id } },
      { new: true }
    );
    res.status(200).json({
      data: liked,
      message: "liked",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Something went wrong",
    });
  }
};

exports.unLikeTodo = async (req, res) => {
  try {
    const unLiked = await Todo.findOneAndUpdate(
      { slug: req.params.slug },
      { $pull: { likes: req.userId._id } },
      { new: true }
    );
    res.status(200).json({
      data: unLiked,
      message: "unLiked",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Something went wrong",
    });
  }
};
