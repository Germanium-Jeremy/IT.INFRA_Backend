const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  birthdate: String,
  location: String,
  corporate: String,
  nationalId: String
});

const User = mongoose.model("infra_users", userSchema);

module.exports = User;
