const router = require('express').Router()
const {
    signUp,
    login,
    sendMessage
} = require('../controllers/userController')
const { verifyToken } = require('../utilities/verifyToken')

router.post('/sign-up', signUp)
router.post('/login', login)
router.put('/message', verifyToken, sendMessage)

module.exports = router