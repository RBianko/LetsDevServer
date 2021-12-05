const { Router } = require('express')
const User = require('../models/User')
const router = Router()
const corsMiddleware = require('../meddlewares/corsMiddleware')


const methods = "PUT, OPTIONS"
router.use((req, res, next) => corsMiddleware(req, res, next, methods));

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
            if (error) return res.status(400).json({ message: 'Error in User.updateOne!' })
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
        if (req.query.ids?.length > 0) {
            const idsArray = req.query.ids
            users = await User.find({ _id: { $in: idsArray } }, { email: 0, password: 0, __v: 0 })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/all
router.get('/all', async (req, res) => {
    let pageNumber = 0
    let nPerPage = 20
    try {
        const users = await User.find({}, { email: 0, password: 0, __v: 0 })
            .sort({ firstName: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/:id
router.get('/', async (req, res) => {
    try {
        const user = await User.find({ _id: req.query.id }, { email: 0, password: 0, __v: 0 })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/follow
router.put('/follow', async (req, res) => {
    try {
        const {
            followerId,
            followingId,
        } = req.body.params.ids

        const follower = await User.find({ _id: followerId })
        const isFollowing = follower[0].follow.following.some(id => id === followingId)

        if (isFollowing) {
            await User.updateOne({ _id: followerId }, { $pull: { "follow.following": followingId } })
            await User.updateOne({ _id: followingId }, { $pull: { "follow.followers": followerId } })
        } else {
            await User.updateOne({ _id: followerId }, { $push: { "follow.following": followingId } })
            await User.updateOne({ _id: followingId }, { $push: { "follow.followers": followerId } })
        }

        res.status(200).json(followingId)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router