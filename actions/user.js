const User = require('../models/User')
const config = require('config')

// UPDATE
const updateUser = async (filter, update) => {
    await User.updateOne(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    }).clone()
}

const updateUsers = async (filter, update) => {
    await User.updateMany(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    })
}

// FIND
const findUser = async (filter, withCredentials = 0) => {
    return await User.find(filter, { email: withCredentials, password: withCredentials, __v: withCredentials })
}

const findUsersPage = async (pageNumber) => {
    let nPerPage = config.get('usersPerPage')
    let prevPagesCount = (pageNumber - 1) * nPerPage
    return await User.find({}, { email: 0, password: 0, __v: 0 })
        .sort({ firstName: 1 })
        .skip(pageNumber > 1 ? prevPagesCount : 0)
        .limit(nPerPage)
}


module.exports = { findUser, findUsersPage, updateUsers, updateUser }