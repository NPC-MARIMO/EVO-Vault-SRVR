const express = require('express')
const { register, login, getUser } = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/user', authMiddleware, getUser)

module.exports = router