const config = require('config')
const jwt = require('jsonwebtoken')

const generateJwt = (id) => jwt.sign(
    { _id: id },
    config.get('jwtSecret'),
    { expiresIn: config.get('expiresIn') },
)

module.exports = generateJwt