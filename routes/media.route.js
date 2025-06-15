const express = require ("express")
const router = express.Router()

const {createMemory} = require('../controllers/media.controller')


router.post('/create-memory', createMemory)

module.exports = router