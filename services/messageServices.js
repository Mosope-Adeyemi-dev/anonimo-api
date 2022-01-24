const User = require('../models/userModel')
const {
    translateError
} = require("../utilities/mongo_helper");
const crypto = require('crypto');
const { encrypt } = require('../utilities/encDec')

const sendAnonMessage = async({emailOrUsername, message})=>{

    const encryptedMessage = encrypt(message);
    let hashedMessage = encryptedMessage.iv.concat(encryptedMessage.content);

    try {
      const result = await User.updateOne({ username: emailOrUsername }, { $push: { anonMessages: {id: crypto.randomBytes(8).toString("hex"), message: hashedMessage, timeStamp: Date.now()} } }, {new: true}); 
      console.log(result)
      
      if(result.acknowledged){
          return [true, '']
      }
    } catch (error) {
       return [false, translateError(error)] 
    } 
}

const updateMessagingStatus = async ({status, id}) => {
    try {
        const result = await User.findByIdAndUpdate(id, {isReceivingMessages: status}, {new: true})
        if(result){
            return [true, result]
        }
    } catch (error) {
        return [false, translateError(error)]  
    }
}

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
const setCurrentTopic = async ({topic, id}) => {
    try {
        const result = await User.findByIdAndUpdate(id, {topic}, {new: true})
        if(result){
          return [true, 'Topic succesfully set']  
        } 
    } catch (error) {
        return [false, translateError(error)]
    }
}

module.exports = {
    sendAnonMessage,
    updateMessagingStatus,
    getMessages,
    setCurrentTopic
}