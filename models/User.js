const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    token: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isLogedIn: { type: Boolean, required: false },

    firstName: { type: String, required: false, default: "New User" },
    lastName: { type: String, required: false, default: "" },
    city: { type: String, required: false, default: "City" },
    country: { type: String, required: false, default: "Country" },
    bio: { type: String, required: false, default: `Some personal information.` },
    profilePicture: { type: String, required: false, default: "/static/media/users.86cb98ab.svg" },
    roles: { type: Array, required: false, default: [] },
    skills: { type: Array, required: false, default: [] },
    projects: { type: Array, required: false, default: [] },
    follow: {
        type: Object, required: false, default: {
            followers: [],
            following: [],
        }
    },
    socials: {
        type: Object, required: false, default: {
            vk: null,
            facebook: null,
            linkedin: null,
            github: null,
        }
    },
})

module.exports = model('User', schema)