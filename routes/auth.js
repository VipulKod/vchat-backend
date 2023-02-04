const router = require("express").Router();
const AuthController = require("../controller/auth.controller");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    profilePic: req.body.profilePic,
    bio: req.body.bio,
    isOnline: req.body.isOnline,
  });

  try {
    const user = await newUser.save();

    res.status(201).json({ success: true, message: "User registered!" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      const { MongoServerError, ...customError } = err;
      console.log(customError);
      res.status(422).json(err);
    } else {
      res.status(409).json(err);
    }
  }
});

//LOGIN Route
router.post("/login", AuthController.login);

module.exports = router;
