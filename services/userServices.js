const User = require('../models/userModel')
const {
    translateError
} = require("../utilities/mongo_helper");
const bcrypt = require('bcrypt')
const saltRounds = 15

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

const userLogin = async ({username, password})=>{
    try {
        const foundUser = await User.findOne({username})

        if(foundUser){
            if(await bcrypt.compare(password, foundUser.password)){
                return [true, foundUser]
            }
            return [false, 'Incorrect Password']
        } else {
            return [false, 'Account not found']
        }
    } catch (error) {
        return [false, translateError(error)]
    }
}

const sendAnonMessage = async({receiverUsername, message})=>{
    try {
      const result = await User.updateOne({ username: receiverUsername }, { $push: { anonMessages: message } }); 
      if(result.acknowledged){
          return [true, '']
      }
    } catch (error) {
       return [false, translateError(error)] 
    }
    
    
}
module.exports = {
    createUser,
    userLogin,
    sendAnonMessage
}