const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    title: { type: String, required: true },
    projectPicture: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: Array, required: true },
    devs: { type: Array, required: true },
    requests: { type: Array, required: true },
    needList: { type: Array, required: true },
})

module.exports = model('Project', schema)