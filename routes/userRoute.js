const express = require("express");


const router = express.Router()

const { registerfun , loginfun , updateUerfun , deleteUserfun, verufyuserfun ,resendEmailfun ,repassFun} = require("../controllers/userController")

const {veriy_Token} =require("../fun/verifyToken")

router.post("/register", registerfun )

router.post("/login", loginfun )

router.put("/:id",veriy_Token, updateUerfun )

router.delete("/:id",veriy_Token, deleteUserfun)

router.post("/verify", verufyuserfun)

router.post("/resend-email", resendEmailfun)

router.post("/re-pass/:id",veriy_Token,repassFun)



module.exports = router