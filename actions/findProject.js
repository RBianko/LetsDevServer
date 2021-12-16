const Project = require('../models/Project')

const findProject = async (filter) => {
    return await Project.find(filter, { __v: 0 })
}

module.exports = findProject