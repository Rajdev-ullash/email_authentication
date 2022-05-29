require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//default error handler

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

const userRoutes = require("./routes/userRouter");
const todoRoutes = require("./routes/todoRouter");

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

//database connection

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => console.log("Database connection established"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
