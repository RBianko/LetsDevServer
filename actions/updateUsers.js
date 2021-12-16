const User = require('../models/User')

const updateUsers = async (filter, update) => {
    await User.updateMany(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    })
}

module.exports = updateUsers