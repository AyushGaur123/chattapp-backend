import User from "../models/user.model.js";
import Message from "../models/message.models.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import cloudianry from "../lib/cloudinary.js"


export const sidebarUsers = async (req,res)=>{
try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password")

    res.status(200).json(filteredUsers)
} catch (error) {
    console.error("Error in sidebarUsers",error.message)
    res.status(500).json({message:"Internal server error"})
}
}


export const getMessage = async(req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const myId= req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ]
        })
         res.status(200).json(messages)
    } catch (error) {
         console.error("Error in getMessage",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const sendMessage = async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudianry.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        // else return //delete
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save()

        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("error in sendMessage",error.message)
        res.status(500).json({message:"internal server error"})
    }
}