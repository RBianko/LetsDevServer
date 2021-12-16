const Project = require('../models/Project')
const config = require('config')

const findProjectsPage = async (pageNumber) => {
    let nPerPage = config.get('projectsPerPage')
    let prevPagesCount = (pageNumber - 1) * nPerPage
    return await Project.find({}, { __v: 0 })
        .sort({ title: 1 })
        .skip(pageNumber > 1 ? prevPagesCount : 0)
        .limit(nPerPage)
}

module.exports = findProjectsPage