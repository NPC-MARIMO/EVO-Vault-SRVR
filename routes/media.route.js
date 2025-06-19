const express = require ("express")
const router = express.Router()

const {createMemory, getFamilyMemories, deleteMemory, updateMemoryDescription} = require('../controllers/media.controller')


router.post('/create-memory', createMemory)
router.get('/get-memories/:familyId', getFamilyMemories)
router.delete('/delete-memory/:memoryId/:userId', deleteMemory)
router.put('/update-memory/:memoryId', updateMemoryDescription)

module.exports = router