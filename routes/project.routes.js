const { Router } = require('express')
const Project = require('../models/Project')
const User = require('../models/User')
const router = Router()

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, OPTIONS");
    next();
});

// api/projects/create
router.post('/create', async (req, res) => {
    try {
        const {
            title,
            status,
            description,
            skills,
            needList,
            picture,
            requests,
            devs
        } = req.body.params.project

        const project = new Project({
            title,
            status,
            description,
            skills,
            needList,
            picture,
            requests,
            devs
        })
        const creatorId = devs[0]._id
        await User.updateOne({ _id: creatorId }, { $push: { projects: project._id.toString() } })
        await project.save()
        res.status(201).json({ message: 'Project created!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/update
router.put('/update', (req, res) => {
    try {
        const {
            _id,
            title,
            status,
            description,
            skills,
            needList,
            picture
        } = req.body.params.project

        const project = {
            title,
            status,
            description,
            skills,
            needList,
            picture
        }

        Project.updateOne({ _id }, { $set: project }, async (error) => {
            if (error) return res.status(400).json({ message: 'Error in Project.updateOne!' })
        })

        res.status(201).json({ message: 'Project updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/list
router.get('/list', async (req, res) => {
    try {
        let projects = []
        if (req.query.ids) {
            const idsArray = req.query.ids
            projects = await Project.find({ _id: { $in: idsArray } }, { __v: 0 })
        } else {
            projects = await Project.find({}, { __v: 0 })
        }
        res.json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/:id
router.get('/', async (req, res) => {
    try {
        const project = await Project.findById(req.query.id)
        res.json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/apply
router.put('/apply', async (req, res) => {
    try {
        const { projectId, userId, forRole } = req.body.params.request
        const project = await Project.findById(projectId)
        const newRequest = {
            requestId: project.requests.length.toString(),
            _id: userId,
            forRole
        }
        project.requests.push(newRequest)
        await project.save()

        res.json({ message: 'New request send!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/approve
router.put('/approve', async (req, res) => {
    try {
        const { projectId, requestId, forRole, userId } = req.body.params.request
        const project = await Project.findById(projectId)

        const requestIndex = project.requests.findIndex(request => request.id === requestId)
        project.requests.splice(requestIndex, 1) //delete request

        const roleIndex = project.needList.findIndex(role => role === forRole)
        project.needList.splice(roleIndex, 1) //delete needed role

        const newDev = {
            _id: userId,
            role: forRole
        }

        // TODO add project id to user.findOne

        project.devs.push(newDev)
        await project.save()

        res.json({ message: 'Request approved!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/decline
router.put('/decline', async (req, res) => {
    try {
        const { projectId, requestId } = req.body.params.request
        const project = await Project.findById(projectId)

        const declineRequestId = project.requests.findIndex(request => request.id === requestId)
        project.requests.splice(declineRequestId, 1) //delete request
        await project.save()

        res.json({ message: 'Request declined!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router