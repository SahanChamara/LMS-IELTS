const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

/*const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role || user.constructor.modelName.toLowerCase(),
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};*/

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn})
};

module.exports = generateToken;