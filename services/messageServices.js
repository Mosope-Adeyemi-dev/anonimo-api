const User = require('../models/userModel')
const {
    translateError
} = require("../utilities/mongo_helper");
const crypto = require('crypto');
const { findById } = require('../models/userModel');

const sendAnonMessage = async({emailOrUsername, message})=>{
    try {
      const result = await User.updateOne({ username: emailOrUsername }, { $push: { anonMessages: {id: crypto.randomBytes(8).toString("hex"), message, timeStamp: Date.now()} } }); 
      if(result.acknowledged){
          return [true, '']
      }
    } catch (error) {
       return [false, translateError(error)] 
    } 
}

const updateMessagingStatus = async ({status, id}) => await User.findOneAndUpdate({id}, {isReceivingMessages: status}, {new: true})

const getMessages =  async({id})=>{
    try {
        const userDetails = await User.findById(id)
        if(userDetails){
            return [true, userDetails.anonMessages]
        } else {
           return [false, 'Unable to retrieve messages.'] 
        }
    } catch (error) {
       return [false, translateError(error)] 
    }
}

module.exports = {
    sendAnonMessage,
    updateMessagingStatus,
    getMessages
}