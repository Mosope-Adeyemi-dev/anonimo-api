const User = require('../models/userModel')
const { responseHandler } = require('../utilities/responseHandler')
const { sendAnonMessage, updateMessagingStatus, getMessages } = require('../services/messageServices')
const { messageValidation, getMessagesValidation } = require('../utilities/validation')
const {encrypt, decrypt } = require('../utilities/encDec')
const { checkEmailOrUsername } = require('../services/userServices')

const sendMessage = async(req, res)=>{
    const { details } = await messageValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }

    const { emailOrUsername } = req.body

    const foundUser = await checkEmailOrUsername({emailOrUsername})

    if(foundUser.isReceivingMessages){
        const check = await sendAnonMessage(req.body) 
        if(check[0]){
            return  responseHandler(res, 'message succesfully sent', 201, '', false)
        }
    } else {
        return responseHandler(res, 'User is currently not taking responses', 400, '', true)
    }
    return responseHandler(res, 'Unable to send message', 400, '', true)
}

const messagingStatus = async(req, res)=>{
    const { status, id } = req.body
    if(status && id){
        await updateMessagingStatus(req.body)
        return responseHandler(res, 'Status successfully updated.', 200, '', false)
    }
    return responseHandler(res, 'Status is required', 400, '', true)
}

const getuserMessages = async(req, res)=>{
    const { details } = await getMessagesValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }

    const check = await getMessages(req.body)

    if(check[0]){
        return  responseHandler(res, 'message succesfully sent', 200, check[1], false)
    }

    return responseHandler(res, check[1], 403, '', true)
}
module.exports = {sendMessage, messagingStatus, getuserMessages}