import jwt from "jsonwebtoken"


export const generateToken = (userId,res)=>{
const token = jwt.sign({userId},process.env.JWT_SECRET,)


res.cookie("jwt", token, {
    maxAge: 7*24*60*60*1000,
    // httpOnly: true,
    secure: false,       // in dev, must be false (since you're not on https)
    sameSite: "lax",     // or "none" if needed
})





return token;
}