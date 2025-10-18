import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "email already exist" })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Invalid User Data" })
        }
    } catch (error) {
        console.log("error in controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Email not registered" })

        const isPass = await bcrypt.compare(password, user.password)
        if (!isPass) return res.status(400).json({ message: "Incorrect password" })

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

        })

    } catch (error) {
        console.log("Error in login controller", error.message)
        return res.status(400).json({ message: "Internal server error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(400).json({ message: " error in logout" })
    }

}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) return res.status(400).json({ message: " profilepic is required" })
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const uploadUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(uploadUser)
    } catch (error) {
        console.log("Error in update controller", error.message)
        res.status(400).json({ message: " error in update" })
    }
}

export const checkauth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkauth controller", error.message)
        res.status(400).json({ message: " error in checkauth" })
    }
}