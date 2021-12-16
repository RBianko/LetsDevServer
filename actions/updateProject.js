const Project = require('../models/Project')

const updateProject = async (filter, update) => {
    await Project.updateOne(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    }).clone()
}

module.exports = updateProject