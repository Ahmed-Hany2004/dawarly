const express = require("express")

const router = express.Router()

const {createRentProperty,getRentPropertyById,updateRentProperty,deleteRentProperty,listRentPropertiesBySubCategory} = require("../controllers/prforrenetController")

const {veriy_Token} = require("../fun/verifyToken")



router.post("/subCategory/:id",veriy_Token,createRentProperty)

router.get("/:id",getRentPropertyById)


router.put("/:id",veriy_Token,updateRentProperty)

router.delete("/:id",veriy_Token,deleteRentProperty)

router.get("/subCategory/:id",listRentPropertiesBySubCategory)

module.exports= router