const express = require("express")

const router = express.Router()


const {createHouse,getHouseById,updatepinding,getpinding,createProperties_for_rent} = require("../controllers/Productcontroller")

const {veriy_Token} =require("../fun/verifyToken")

router.post("/subCategory/:id",veriy_Token,createHouse)

router.get("/house/:id",getHouseById)

router.get("/pinding",veriy_Token,getpinding)

router.put("/:id/pinding",veriy_Token,updatepinding)

router.post("/createProperties_for_rent/subCategory/:id",veriy_Token,createProperties_for_rent)

module.exports= router