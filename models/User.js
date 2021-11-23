const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    token: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    isLogedIn: { type: Boolean, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    bio: { type: String, required: false },
    profilePicture: { type: String, required: false },
    roles: { type: Array, required: false },
    follow: { type: Object, required: false },
    skills: { type: Array, required: false },
    projects: { type: Array, required: false },
    socials: { type: Object, required: false },
})

module.exports = model('User', schema)