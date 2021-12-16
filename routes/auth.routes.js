const { Router } = require('express')
const router = Router()

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const corsMiddleware = require('../meddlewares/corsMiddleware')
const generateJwt = require('../helpers/generateJwt')
const findUser = require('../actions/findUser')

const methods = "POST, OPTIONS"
router.use((req, res, next) => corsMiddleware(req, res, next, methods));


// /api/login
router.post(
    '/registration',
    [
        check('email', 'Email is not correct').isEmail(),
        check('password', 'Password is not correct').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Registration failed!'
                })
            }

            const { email, password } = req.body
            const findResult = await findUser({ email })
            const candidate = findResult[0]

            if (candidate) {
                return res.status(400).json({ message: 'User already exists' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })

            await user.save()
            res.status(201).json({ message: 'User created!' })

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

// /api/login
router.post('/authorization',
    [
        check('email', 'Enter correct Email').normalizeEmail().isEmail(),
        check('password', 'Enter correct Password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Login fail!'
                })
            }

            const { email, password } = req.body

            const findResult = await findUser({ email }, 1)
            const user = findResult[0]

            if (!user) {
                return res.status(400).json({ message: 'User not found' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Password' })
            }

            const token = generateJwt(user.id)

            res.status(200).json({ token, _id: user.id })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

module.exports = router