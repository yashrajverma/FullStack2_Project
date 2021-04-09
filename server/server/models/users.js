const mongoose = require("mongoose");
const { ObjectID } = mongoose.Schema.Types;

const userShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: ObjectID, ref: "User" }],
  following: [{ type: ObjectID, ref: "User" }],
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/yashraj28/image/upload/v1617879313/d02iyuzxaqusglqod1vc.jpg",
  }
});
module.exports = mongoose.model("User", userShema);
