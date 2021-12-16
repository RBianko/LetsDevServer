const { Router } = require('express')
const router = Router()

const corsMiddleware = require('../meddlewares/corsMiddleware')
const updateUser = require('../actions/updateUser')
const findUser = require('../actions/findUser')
const findUsersPage = require('../actions/findUsersPage')

const methods = "PUT, OPTIONS"
router.use((req, res, next) => corsMiddleware(req, res, next, methods));


// api/users/update
router.put('/update', async (req, res) => {
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

        await updateUser({ _id }, { $set: user })
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
            users = await findUser({ _id: { $in: idsArray } })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/all
router.get('/all', async (req, res) => {
    try {
        const users = await findUsersPage({}, { email: 0, password: 0, __v: 0 })  // req.query.page
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/users/:id
router.get('/', async (req, res) => {
    try {
        const user = await findUser({ _id: req.query.id })
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

        const follower = await findUser({ _id: followerId })
        const isFollowing = follower[0].follow.following.some(id => id === followingId)

        if (isFollowing) {
            await updateUser({ _id: followerId }, { $pull: { "follow.following": followingId } })
            await updateUser({ _id: followingId }, { $pull: { "follow.followers": followerId } })
        } else {
            await updateUser({ _id: followerId }, { $push: { "follow.following": followingId } })
            await updateUser({ _id: followingId }, { $push: { "follow.followers": followerId } })
        }

        res.status(200).json(followingId)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router