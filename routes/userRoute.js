const express = require("express");


const router = express.Router()

const { registerfun , loginfun , updateUerfun , deleteUserfun, verufyuserfun ,resendEmailfun } = require("../controllers/userController")

const {veriy_Token} =require("../fun/verifyToken")

router.post("/register", registerfun )

router.post("/login", loginfun )

router.put("/:id",veriy_Token, updateUerfun )

router.delete("/:id",veriy_Token, deleteUserfun)

router.post("/verify/:id",veriy_Token, verufyuserfun)

router.post("/resend-email/:id", veriy_Token , resendEmailfun)

module.exports = router