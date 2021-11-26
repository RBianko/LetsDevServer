const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    title: { type: String, default: "New Project" },
    projectPicture: { type: String, default: "/static/media/project.6ff02d0d.svg" },
    status: { type: String, default: "Active" },
    description: { type: String, default: "" },
    skills: { type: Array, default: [] },
    devs: { type: Array, default: [] },
    requests: { type: Array, default: [] },
    needList: { type: Array, default: [] },
})

module.exports = model('Project', schema)