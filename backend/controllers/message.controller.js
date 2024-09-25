import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
export const sendMessage = async (req, res) => {
    try {
        const {message } = req.body
        const {id:recieverId} = req.params
        const senderId = req.user._id
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, recieverId]
            }
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, recieverId]
            })
        }
        const newMessage = new Message({
            senderId, recieverId, message
        })
        if(newMessage) {
            conversation.messages.push(newMessage._id)
        }

        /* SOCKETIO HERE */


        /*  await conversation.save()
        await newMessage.save()       */  
        /* 1st way to save the conversation and message simultaneously */
        await Promise.all([conversation.save(), newMessage.save()])
        res.status(201).json(newMessage)

    }
    catch (err) {
        console.log("error in sendMessage controller",err.message)
        res.status(500).json({error:"internal server error"})
    }
}
export const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id
        const {id:userToChatWith} = req.params
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, userToChatWith]
            }
        }).populate("messages")
        const messages = conversation.messages
        if(!conversation){
            return res.status(404).json({error:"Conversation not found"})
        }
        
        res.status(200).json(messages)  

    }
    catch (err) {
        console.log("error in getMessages controller",err.message)
        res.status(500).json({error:"internal server error"})
    }
}