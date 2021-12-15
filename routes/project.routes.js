const { Router } = require('express')
const Project = require('../models/Project')
const User = require('../models/User')
const router = Router()
const config = require('config')
const corsMiddleware = require('../meddlewares/corsMiddleware')
const updateUser = require('../actions/updateUser')
const updateProject = require('../actions/updateProject')

const methods = "PUT, POST, DELETE, OPTIONS"
router.use((req, res, next) => corsMiddleware(req, res, next, methods));


// api/projects/create
router.post('/create', async (req, res) => {
    try {
        const {
            title,
            status,
            description,
            link,
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
            link,
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
            link,
            skills,
            needList,
            picture
        } = req.body.params.project

        const project = {
            title,
            status,
            description,
            link,
            skills,
            needList,
            picture
        }

        Project.updateOne({ _id }, { $set: project }, async (error) => {
            if (error) return res.status(400).json({ message: 'Error in Project.updateOne!' })
        })

        res.status(200).json({ message: 'Project updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/delete
router.delete('/delete', async (req, res) => {
    try {
        const id = req.query.id
        const project = await Project.findById(id)

        const users = project.devs.map(dev => dev._id)
        await User.updateMany(
            { _id: { $in: users } },
            { $set: { $pull: { projects: id } } }
        )

        project.remove()
        res.status(200).json({ message: 'Project deleted!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/list
router.get('/list', async (req, res) => {
    try {
        let projects = []
        if (req.query.ids?.length > 0) {
            const idsArray = req.query.ids
            projects = await Project.find({ _id: { $in: idsArray } }, { __v: 0 })
        }
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/all
router.get('/all', async (req, res) => {
    let pageNumber = 1 // req.query.page
    let nPerPage = config.get('projectsPerPage')
    let prevPagesCount = (pageNumber - 1) * nPerPage

    try {
        const projects = await Project.find({}, { __v: 0 })
            .sort({ title: 1 })
            .skip(pageNumber > 1 ? prevPagesCount : 0)
            .limit(nPerPage)

        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/:id
router.get('/', async (req, res) => {
    try {
        const project = await Project.findById(req.query.id)
        res.status(200).json(project)
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

        res.status(200).json({ message: 'New request send!' })
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
        project.devs.push(newDev)

        await User.updateOne({ _id: userId }, { $push: { projects: projectId } })
        await project.save()

        res.status(200).json({ message: 'Request approved!' })
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

        res.status(200).json({ message: 'Request declined!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router