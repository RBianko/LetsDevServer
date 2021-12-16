const User = require('../models/User')

const updateUser = async (filter, update) => {
    await User.updateOne(filter, update, async (error) => {
        if (error) return res.status(400).json({ message: error.message })
    }).clone()
}

module.exports = updateUser