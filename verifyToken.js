const jwt = require("jsonwebtoken");
const apiResponse = require("./helpers/apiResponse");

function verify(req, res, next) {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
      if (err) apiResponse.unauthorizedResponse(res, "Invalid token.");
      req.user = user;
      next();
    });
  } else {
    return apiResponse.unauthorizedResponse(res, "You are not authenticated.");
  }
}

module.exports = verify;
