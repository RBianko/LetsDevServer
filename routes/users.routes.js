const { Router } = require('express')
const User = require('../models/User')
const router = Router()

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// api/users/update
router.put('/update', (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            city,
            country,
            Bio,
            roles,
            skills,
            profilePicture,
            socials
        } = req.body

        const user = {
            firstName,
            lastName,
            city,
            country,
            Bio,
            roles,
            skills,
            profilePicture,
            socials
        }

        User.updateOne({ _id: userId }, { $set: user }, async (error) => {
            if (error) return await res.status(200).json({ message: 'Error in update User!' })
        })

        res.status(201).json({ message: 'User updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/all
router.get('/all', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/:id
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.query.id)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router