const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");
app.use(cors());

dotenv.config();
app.use(express.json());

const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const userRoute = require("./routes/user");
const apiVersion = process.env.API_VERSION;

app.use(`${apiVersion}/auth`, authRoute);
app.use(`${apiVersion}/chat`, chatRoute);
app.use(`${apiVersion}/message`, messageRoute);
app.use(`${apiVersion}/user`, userRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

app.listen(8000, () => {
  console.log("Backend is running at port:" + 8000);
});
