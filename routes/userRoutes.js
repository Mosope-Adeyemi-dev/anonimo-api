const router = require('express').Router()
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
} = require('../controllers/userController')
const { verifyToken } = require('../utilities/verifyToken')

router.post('/sign-up', signUp)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
router.put('/change-password',verifyToken, changePassword)

module.exports = router