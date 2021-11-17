const { Router } = require('express')
const Project = require('../models/Project')
const Projects = require('../models/Projects')
const router = Router()

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
        } = req.body

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

        await project.save()
        res.status(201).json({ message: 'Project created!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/all
router.get('/all', async (req, res) => {
    try {
        const projects = await Project.find()
        res.json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// api/projects/:id
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router