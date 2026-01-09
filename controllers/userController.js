const { prisma } = require("../prismastep"); //get prisma client
const { create_token } = require("../fun/createToken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../fun/sendEmail");
const { generateRandomKey } = require("../fun/createotp");


// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

//registerfun
//post
// /register
const registerfun = async (req, res) => {
  try {
    const { name, email, pass, confirmpassword, phone } = req.body;

    if (!name || !email || !pass || !confirmpassword || !phone) {
      return res.status(400).json("err in input"); //check for input
    }

    //check if email and phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json("email or phone already exists");
    }

    if (pass != confirmpassword) {
      return res.status(400).json("password not match"); //check for password match
    }

    //hash password

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(pass, saltRounds);

    //generate otp
    const otp = generateRandomKey();

    //insert user in db
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        otp: otp
      },
    });

    //send verification email
    sendVerificationEmail(email, name, otp);

    //create token
    const token = await create_token(newUser.id, email);

    const { password, ...safeUser } = newUser;

    //send response
    res.status(201).json({ mes: "user created", data: safeUser, token: token });
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

//loginfun
//post
// /login

const loginfun = async (req, res) => {
  try {
    const { email, pass } = req.body; // get data form body

    if (!email || !pass) {
      return res.status(400).send("err in input"); //check for input
    }

    //find email in db
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        phone: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json("err in email or password");
    }

    //check if user is verified
    if(!user.isVerified){
      return res.status(403).json("Please verify your email to login");
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      return res.status(401).json("err in email or password");
    }

    //create token
    const token = await create_token(user.id, email);

    const { password, ...safeUser } = user;

    // send response
    res
      .status(200)
      .json({ mes: "login success", data: safeUser, token: token });
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

//update user function
//put
// /:id

const updateUerfun = async (req, res) => {
  try {
    //get user id from params
    const userId = req.params.id;

    //get update data from body
    const { name, phone, email } = req.body;

    //check if  he  owns the account
    if (req.user.id !== userId) {
      return res.status(403).json("you are not allowed to update this account");
    }

    //check if this user in db
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json("User not found");
    }

    //check if email or phone already exists for other users
    const existingUser = await prisma.user.findFirst({
      where: {
        id: { not: userId },
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json("email or phone already exists");
    }

    //update user in db
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
      },
    });

    const { password, ...safeUser } = updatedUser;

    //send response
    res.status(200).json({ mes: "user updated", data: safeUser });
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

//delete user function
//delete
// /:id

const deleteUserfun = async (req, res) => {
  try {
    //get user id from params
    const userId = req.params.id;

    //check if  he  owns the account
    if (req.user.id !== userId) {
      return res.status(403).json("you are not allowed to delete this account");
    }

    // check if this user in db
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json("User not found");
    }

    //delete user from db
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
     // omit password from response
    const { password, ...safeUser } = deletedUser;
    //send response
    res.status(200).json({ mes: "user deleted", data: safeUser });
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

//verify user function
//post
// /verify/:id

const verufyuserfun = async (req, res) => {
  
  try{

    const userId = req.params.id;
    const { otp } = req.body;


    //check if  he  owns the account
    if (req.user.id !== userId) {
      return res.status(403).json("you are not allowed to delete this account");
    }

    //find user in db
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

     //check if user is already verified
  if(user.isVerified){
    return res.status(400).json("User is already verified");
  }

    //check if otp is valid
    if (user.otp !== otp) {
      return res.status(400).json("Invalid OTP");
    }

    //update user to verified
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
        otp: null, //clear otp after verification
      },
    });

    const { password, ...safeUser } = updatedUser;

    //send response
    res.status(200).json({ mes: "user verified", data: safeUser });
  }
  catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}



//resnd email function
//post
// /resend-email/:id

const resendEmailfun = async (req, res) => {
 
 const userId = req.params.id;

 try{

  //check if  he  owns the account
    if (req.user.id !== userId) {
      return res.status(403).json("you are not allowed to delete this account");
    }

  // find user in db 
  const user = await prisma.user.findUnique({
    where:{
      id: userId
    }
  })

  if(!user){
    return res.status(404).json("User not found");
  }

  //check if user is already verified
  if(user.isVerified){
    return res.status(400).json("User is already verified");
  }

  //generate new otp
  const newOtp = generateRandomKey();

  //update user otp in db
  const updatedUser = await prisma.user.update({
    where:{
      id: userId
    },
    data:{
      otp: newOtp
    }
  })

  //send verification email
  sendVerificationEmail(user.email, user.name, newOtp);

  //safe user object
  const { password, ...safeUser } = updatedUser;

  //send response
  res.status(200).json({ mes: "verification email resent", data: safeUser } );

 }
  catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }

}






module.exports = { registerfun, loginfun, updateUerfun, deleteUserfun, verufyuserfun,resendEmailfun };
