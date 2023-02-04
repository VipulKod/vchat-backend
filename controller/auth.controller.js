const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/**
 * User registration
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 *
 * @returns {Object}
 */
exports.register = [
  //Validate fields
  body("username")
    .isLength({ min: 3 })
    .trim()
    .withMessage("Username must be specific")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters.")
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),

  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),

  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),

  // Process request after validation and sanitization.
  async (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
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

        const user = await newUser.save();

        const { username, email, profilePic, _id } = user;
        apiResponse.successResponseWithData(res, "Registration Success.", {
          username,
          email,
          bio,
          profilePic,
          _id,
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * User login.
 *
 * @param {string}  email
 * @param {string}  password
 *
 * @returns {Object}
 */
exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .isLength({ min: 6, max: 15 })
    .trim()
    .withMessage("Password must be minimum 6 and maximum 15 characters long."),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        const user = await User.findOne({ email: req.body.email });

        !user && apiResponse.ErrorResponse(res, "User not found");
        if (user) {
          console.log(user);
          // Decrypt
          const bytes = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
          );
          const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

          if (originalPassword != req.body.password) {
            apiResponse.ErrorResponse(res, "Wrong email or password");
          } else if (originalPassword === req.body.password) {
            const accessToken = await jwt.sign(
              {
                id: user._id,
              },
              process.env.SECRET_KEY,
              { expiresIn: "2d" }
            );
            const { username, email, bio, profilePic, _id } = await user._doc;

            apiResponse.successResponseWithData(res, "Logged in successfully", {
              user: { username, email, bio, profilePic, _id },
              accessToken,
            });
          }
        }
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
