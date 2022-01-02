const jwt = require('jsonwebtoken')
const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    if (bearerHeader !== undefined) {
        const token = bearerHeader.split(' ')[1]
        try {
          const decode = jwt.verify(token, process.env.SIGNED_SECRET)
            next()   
        } catch (error) {
           res.status(403).json({
               error: true,
               message: 'Invalid authorization token'
           }) 
        }
    } else {
        res.status(403).json({
            error: true,
            message: 'No authorization token found'
        })
    }
    
}
module.exports = {
    verifyToken
}