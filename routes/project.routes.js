const { Router } = require('express')
const router = Router()

const Project = require('../models/Project')

const cors = require('../middlewares/cors')
const { updateUser, updateUsers } = require('../actions/user')
const { updateProject, findProject, findProjectsPage } = require('../actions/project')

const methods = "PUT, POST, DELETE, OPTIONS"
router.use((req, res, next) => cors(req, res, next, methods));


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
        await updateUser({ _id: creatorId }, { $push: { projects: project._id.toString() } })

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

        updateProject({ _id }, { $set: project })
        res.status(200).json({ message: 'Project updated!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/delete
router.delete('/delete', async (req, res) => {
    try {
        const id = req.query.id

        const findResult = await findProject({ _id: id })
        if (!findResult.length) return res.status(400).json({ message: 'Project not found' })
        const project = findResult[0]

        const users = project.devs.map(dev => dev._id)
        await updateUsers({ _id: { $in: users } }, { $set: { $pull: { projects: id } } })

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
            projects = await findProject({ _id: { $in: idsArray } })
        }
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/all
router.get('/all', async (req, res) => {
    try {
        const projects = await findProjectsPage(1) // req.query.page
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/:id
router.get('/', async (req, res) => {
    try {
        const project = await findProject({ _id: req.query.id })
        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/apply
router.put('/apply', async (req, res) => {
    try {
        const { projectId, userId, forRole } = req.body.params.request

        const findResult = await findProject({ _id: projectId })
        if (!findResult.length) return res.status(400).json({ message: 'Project not found' })
        const project = findResult[0]

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

        const findResult = await findProject({ _id: projectId })
        if (!findResult.length) return res.status(400).json({ message: 'Project not found' })
        const project = findResult[0]

        const requestIndex = project.requests.findIndex(request => request.id === requestId)
        project.requests.splice(requestIndex, 1) //delete request

        const roleIndex = project.needList.findIndex(role => role === forRole)
        project.needList.splice(roleIndex, 1) //delete needed role

        const newDev = {
            _id: userId,
            role: forRole
        }
        project.devs.push(newDev)

        await updateUser({ _id: userId }, { $push: { projects: projectId } })
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

        const findResult = await findProject({ _id: projectId })
        if (!findResult.length) return res.status(400).json({ message: 'Project not found' })
        const project = findResult[0]

        const declineRequestId = project.requests.findIndex(request => request.id === requestId)
        project.requests.splice(declineRequestId, 1) //delete request

        await project.save()
        res.status(200).json({ message: 'Request declined!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router