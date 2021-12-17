const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({ extended: true }))

app.use('/api/login', require('./routes/auth.routes'))
app.use('/api/projects', require('./routes/project.routes'))
app.use('/api/users', require('./routes/users.routes'))

const PORT = config.get("PORT") || 5000

async function start() {
    try {
        await mongoose.connect(config.get("mongoUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => { console.log(`Started at PORT: ${PORT}...`) })
    } catch (error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}

start()