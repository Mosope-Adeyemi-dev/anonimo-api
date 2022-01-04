const { responseHandler } = require('../utilities/responseHandler')
const { createUser, userLogin, checkEmailOrUsername, updatePassword } = require('../services/userServices')
const { userValidation, resetPasswordValidation, forgotPasswordValidation, userLoginValidation } = require('../utilities/validation')
const {encrypt, decrypt } = require('../utilities/encDec')
const createMail = require('../services/sendMail')
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

        const encryptedId = encrypt(registeredUser.id);
        let hashedId = encryptedId.iv.concat(encryptedId.content);

        const data = {
            username: registeredUser.username,
            id: registeredUser.id,
            isReceivingMessages: registeredUser.isReceivingMessages,
            token
        }
        
        await createMail('verify_account', registeredUser.username, hashedId, registeredUser.email)
        return  responseHandler(res, 'signup successful', 201, data, false)
    } else {
     return  responseHandler(res, check[1], 403, '', true)
    }
}

const login = async(req, res) => {
    const { details } = await userLoginValidation(req.body)
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
            isReceivingMessages: registeredUser.isReceivingMessages,
            token
        }
        return  responseHandler(res, 'login successful', 200, data, false)
    } else {
     return  responseHandler(res, check[1], 403, '', true)
    }
}

const forgotPassword = async (req, res) => {
    const { details } = await forgotPasswordValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }
    const foundUser = await checkEmailOrUsername(req.body)

    if(foundUser){
        const encryptedId = encrypt(foundUser.id);
        let hashedId = encryptedId.iv.concat(encryptedId.content);
        await createMail('forgot_password', foundUser.username, hashedId, foundUser.email)  
    }
    return responseHandler(res, 'Reset Link has been sent to email', 200, '', false)
}

const resetPassword = async (req, res) => {
    const { details } = await resetPasswordValidation(req.body)

    if(details){
        const allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }

    const { password, confirmPassword, id } = req.body;

    if (password !== confirmPassword) {
        return responseHandler(res, "Passwords do not match.", 400, '', true);
    }

    let decryptedId = decrypt({
        iv: id.substring(0, 32),
        content: id.substring(32, id.length),
    });
    
    if(await updatePassword(password, decryptedId)){
        return responseHandler(res, 'Password successfully updated.', 200, '', false)
    }
}

const changePassword = async (req, res) => {
    const { details } = await resetPasswordValidation(req.body)
    if(details){
        const allErrors = details.map((detail)=>detail.message.replace(/"/g, ""));
        return  responseHandler(res, allErrors, 400, '', true)
    }

    const {password, id } = req.body
    if(await updatePassword(password, id)){
        return responseHandler(res, 'Password successfully updated.', 200, '', false)
    }
}

module.exports = {signUp, login, forgotPassword, resetPassword, changePassword,}