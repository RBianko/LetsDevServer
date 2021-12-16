const User = require('../models/User')

const findUser = async (filter, withCredentials = 0) => {
    return await User.find(filter, { email: withCredentials, password: withCredentials, __v: withCredentials })
}

module.exports = findUser