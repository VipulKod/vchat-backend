const User = require("../models/User");
const apiResponse = require("../helpers/apiResponse");
const verify = require("../verifyToken");

/**
 * Upload Image
 *
 * @returns {Object}
 */
exports.image = [
  verify,
  async (req, res) => {
    const user = await User.findById({ _id: req.body._id });
    try {
      if (user) {
        const savedUpdatedData = await user.updateOne({
          profilePic: req.body.imageUrl,
        });

        savedUpdatedData &&
          apiResponse.successResponseWithData(
            res,
            "Image updated successfully.",
            savedUpdatedData
          );
      } else {
        apiResponse.ErrorResponse(res, "User not found.")
      }
    } catch {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
