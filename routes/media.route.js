const express = require ("express")
const router = express.Router()

const {createMemory, getFamilyMemories} = require('../controllers/media.controller')


router.post('/create-memory', createMemory)
router.get('/get-memories/:familyId', getFamilyMemories)

module.exports = router