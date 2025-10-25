// import jwt from "jsonwebtoken"


// export const generateToken = (userId,res)=>{
// const token = jwt.sign({userId},process.env.JWT_SECRET,)


// res.cookie("jwt", token, {
//     // maxAge: 7*24*60*60*1000,
//     // httpOnly: true,
//     secure: false,       // in dev, must be false (since you're not on https)
//     sameSite: "lax",     // or "none" if needed
// })


// return token;
// }


import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,                   // 🔒 prevents JS access
    secure: process.env.NODE_ENV === "production",  // ✅ true on Render
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ allow cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
