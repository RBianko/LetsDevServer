const { Router } = require('express')
const Project = require('../models/Project')
const router = Router()

router.post('/create', async (req, res) => {
    try {


        res.status(201).json({ message: 'Project created!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll()
        res.json(projects)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router