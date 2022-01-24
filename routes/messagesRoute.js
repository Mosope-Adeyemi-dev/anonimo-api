const router = require('express').Router()
const { messagingStatus, getuserMessages, sendMessage, setTopic } = require('../controllers/messageController')
const { verifyToken } = require('../utilities/verifyToken')

router.post('/message-status', verifyToken, messagingStatus)
router.get('/get-messages', verifyToken, getuserMessages)
router.put('/send-message', sendMessage)
router.post('/set-topic', verifyToken, setTopic)

module.exports = router;