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
            projectPicture,
            requests,
            devs
        } = req.body.params.project

        const project = new Project({
            title,
            status,
            description,
            skills,
            needList,
            projectPicture,
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

module.exports = router