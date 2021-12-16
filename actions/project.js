const Project = require('../models/Project')
const config = require('config')

// UPDATE
const updateProject = async (filter, update) => {
    await Project.updateOne(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    }).clone()
}

// FIND
const findProject = async (filter) => {
    return await Project.find(filter, { __v: 0 })
}

const findProjectsPage = async (pageNumber) => {
    let nPerPage = config.get('projectsPerPage')
    let prevPagesCount = (pageNumber - 1) * nPerPage
    return await Project.find({}, { __v: 0 })
        .sort({ title: 1 })
        .skip(pageNumber > 1 ? prevPagesCount : 0)
        .limit(nPerPage)
}


module.exports = { findProjectsPage, updateProject, findProject }