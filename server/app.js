const express = require("express");
const app = express();

// required middlewares
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");

// mongoose
const mongoose = require("mongoose");

// routers
const routers = require("./routes");
const { landingRouter, userRouter, postRouter } = routers;
// port
var port = process.env.PORT || "8080";

// middleware use
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
dotenv.config();

app.use("/", landingRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/images", express.static(path.join(__dirname, "/public/images")));

app.listen(port, () => {
  console.log(`server on, port ${port}`);
});

const { mongoURL } = require("./config");
mongoose.connect(mongoURL).then(() => {
  console.log("MongoDB connected...");
});
