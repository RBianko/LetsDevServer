const { Router } = require('express')
const User = require('../models/User')
const router = Router()

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    next();
});

// api/users/update
router.put('/update', (req, res) => {
    try {
        const {
            _id,
            firstName,
            lastName,
            city,
            country,
            bio,
            roles,
            skills,
            follow,
            profilePicture,
            socials
        } = req.body.params.user

        const user = {
            firstName,
            lastName,
            city,
            country,
            bio,
            roles,
            skills,
            follow,
            profilePicture,
            socials
        }

        User.updateOne({ _id }, { $set: user }, async (error) => {
            if (error) return await res.status(200).json({ message: 'Error in User.updateOne!' })
        })

        res.status(201).json({ message: 'User updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/list
router.get('/list', async (req, res) => {
    try {
        let users = []
        if (req.query.ids) {
            const idsArray = req.query.ids
            users = await User.find({ _id: { $in: idsArray } }, { email: 0, password: 0, __v: 0 })
        } else {
            users = await User.find({}, { email: 0, password: 0, __v: 0 })
        }
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/:id
router.get('/', async (req, res) => {
    try {
        const user = await User.find({ _id: req.query.id }, { email: 0, password: 0, __v: 0 })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router