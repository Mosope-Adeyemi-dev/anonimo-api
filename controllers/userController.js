const User = require('../models/userModel')
const { responseHandler } = require('../utilities/responseHandler')
const { createUser, userLogin, sendAnonMessage } = require('../services/userServices')
const { userValidation, messageValidation } = require('../utilities/validation')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { details } = await userValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }
    //check is an array returns [true, saved user] or [false, transalated error]
    const check = await createUser(req.body)
    if(check[0]){
        const registeredUser = check[1]

        const token = await jwt.sign({id: registeredUser.id,},process.env.SIGNED_SECRET,{expiresIn: "1d",})
        const data = {
            username: registeredUser.username,
            id: registeredUser.id,
            token
        }
        return  responseHandler(res, 'signup successful', 201, data, false)
    } else {
     return  responseHandler(res, check[1], 404, '', true)
    }
}

const login = async(req, res) => {
    const { details } = await userValidation(req.body)
    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }
    const check = await userLogin(req.body)
    if(check[0]){
        const registeredUser = check[1]

        const token = await jwt.sign({id: registeredUser.id,},process.env.SIGNED_SECRET,{expiresIn: "1d",})
        const data = {
            username: registeredUser.username,
            id: registeredUser.id,
            token
        }
        return  responseHandler(res, 'login successful', 200, data, false)
    } else {
     return  responseHandler(res, check[1], 404, '', true)
    }
}

const sendMessage = async(req, res)=>{
    const { details } = await messageValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }

    const check = await sendAnonMessage(req.body)

    if(check[0]){
        return  responseHandler(res, 'message succesfully sent', 201, '', false)
    }

   return responseHandler(res, 'message sent', 200, '', false)
}

module.exports = {signUp, login, sendMessage}