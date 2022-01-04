const User = require('../models/userModel')
const {
    translateError
} = require("../utilities/mongo_helper");
const bcrypt = require('bcrypt');
const saltRounds = 15

const checkEmailOrUsername = async ({emailOrUsername}) => {
    const foundUser = (await User.findOne({email: emailOrUsername})) || (await User.findOne({username: emailOrUsername}));
    return foundUser   
}

const createUser = async ({
    username,
    password,
    email
}) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds)
        const newUser = new User({
            username,
            password: hash,
            email
        })
        const savedUser = await newUser.save()
        if (savedUser) {
            return [true, savedUser]
        }
    } catch (error) {
        return [false, translateError(error)]
    }
}

const userLogin = async ({emailOrUsername, password})=>{
    try {
        const foundUser = await checkEmailOrUsername({emailOrUsername})
        if(foundUser){
            if(await bcrypt.compare(password, foundUser.password)){
                return [true, foundUser]
            }
            return [false, 'Incorrect email or password']
        } else {
            return [false, 'Incorrect email or password']
        }
    } catch (error) {
        return [false, translateError(error)] 
    }
}

const updatePassword = async(password, id)=>{
    const hash = await bcrypt.hash(password, saltRounds)
    return await User.findOneAndUpdate({id}, {password: hash}, {new: true})
}

module.exports = {
    createUser,
    userLogin,
    checkEmailOrUsername,
    updatePassword,
}