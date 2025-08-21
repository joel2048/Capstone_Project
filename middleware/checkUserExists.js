const User = require("../models/user");

const checkUserExists = async (req, res, next) => {
  const auth0_id = req.auth.sub;

  let user = await User.findOne({ where: { auth0_id } });
  if (!user) {
    user = await User.create({
      auth0_id,
      userName: req.auth.name || "",
      email: req.auth.email || "",
    });
  }
  next();
}

module.exports = checkUserExists;