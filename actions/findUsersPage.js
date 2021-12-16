const User = require('../models/User')
const config = require('config')

const findUsersPage = async (pageNumber) => {
    let nPerPage = config.get('usersPerPage')
    let prevPagesCount = (pageNumber - 1) * nPerPage
    return await User.find({}, { email: 0, password: 0, __v: 0 })
        .sort({ firstName: 1 })
        .skip(pageNumber > 1 ? prevPagesCount : 0)
        .limit(nPerPage)
}

module.exports = findUsersPage