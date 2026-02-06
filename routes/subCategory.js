const express = require("express");

const router = express.Router()


const {createSubCategory ,updateSubCategoryKey,  upsertSubCategoryTranslation, deleteSubCategory, getSubCategoriesByCategoryOnly ,createAttribute , updateAttribute,deleteAttribute, getAttributesBySubCategory,
    addAttributeTranslation,updateAttributeTranslation, deleteAttributeTranslation ,addAttributeOption , updateAttributeOption,
    deleteAttributeOption, getAttributeOptions, addOptionTranslation , updateOptionTranslation ,deleteOptionTranslation,getallSubCategory,getOneSubCategory ,
    getAttributesGroupedBySubCategory , getAttributeById
} = require("../controllers/subController")


router.post("/", createSubCategory)

router.put("/:id/", updateSubCategoryKey)

router.put("/:id/Translation", upsertSubCategoryTranslation)

router.delete("/:id", deleteSubCategory)

router.get("/category/:categoryName", getSubCategoriesByCategoryOnly)

router.post("/:id/filter", createAttribute)

router.put("/filter/:id", updateAttribute)

router.delete("/filter/:id",deleteAttribute)

router.get("/:id/filter",getAttributesBySubCategory)

router.post("/filter/:id/translations",addAttributeTranslation)

router.put("/filter/translations/:id",updateAttributeTranslation)

router.delete("/filter/translations/:id",deleteAttributeTranslation)

router.post("/filter/:id/options",addAttributeOption)

router.put("/filter/options/:id",updateAttributeOption)

router.delete("/filter/options/:id",deleteAttributeOption)

router.get("/filter/:id/options",getAttributeOptions)

router.post("/filter/options/:id/translations",addOptionTranslation)

router.put("/filter/options/translations/:id",updateOptionTranslation)

router.delete("/filter/options/translations/:id",deleteOptionTranslation)

router.get("/all",getallSubCategory)

router.get("/:id",getOneSubCategory)

router.get("/filters/all",getAttributesGroupedBySubCategory)

router.get("/filters/:id",getAttributeById)
module.exports = router