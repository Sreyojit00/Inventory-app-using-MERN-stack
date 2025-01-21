const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: 'String',
    lastName : 'String',
    email: 'String',
    password: 'String',
    phoneNumber: 'Number',
    role: { type: String, enum: ["general", "admin"], default: "general" },
    imageUrl: 'String',
});

const User = mongoose.model("users", UserSchema);
module.exports = User;