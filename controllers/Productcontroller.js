const { prisma } = require("../prismastep");

const {validateAttributes} = require("../validate/validateatter")

const createHouse = async (req, res) => {
  try {


    const subCategoryId = req.params.id

    const {
      title,
      price,
      location,
      display,
      dawarlyphone,
      tags,
      attributes,
      description
    } = req.body;

    const userId = req.user.id; // من auth middleware

    // 1️⃣ basic validation
    if (!title || !subCategoryId || typeof price !== "number" || !attributes) {
      return res.status(400).json({ mes: "invalid input data" });
    }

    // 2️⃣ check subcategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId }
    });

    if (!subCategory) {
      return res.status(404).json({ mes: "SubCategory not found" });
    }

    // 3️⃣ get attribute definitions
    const attributeDefs = await prisma.attributeDefinition.findMany({
      where: { subCategoryId },
      include: { options: true }
    });

    // 4️⃣ validate attributes
    validateAttributes(attributes, attributeDefs);

    // 5️⃣ create product
    const newHouse = await prisma.house.create({
      data: {
        title,
        subCategoryId,
        price,
        location,
        display: display ?? false,
        dawarlyphone,
        tags,
        attributes,
        description,
        userId
      }
    });

    res.status(201).json({
      mes: "House created successfully",
      data: newHouse
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(400).json({ mes: err.message });
  }
};


const getHouseById = async (req, res) => {
  try {
    const { id } = req.params;

    // جلب المنتج مع حقول محددة من اليوزر
    const house = await prisma.house.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        subCategoryId: true,
        display: true,
        price: true,
        location: true,
        tags: true,
        attributes: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!house) {
      return res.status(404).json({ mes: "House not found" });
    }

    return res.status(200).json({ mes: "House found", data: house });
  } catch (err) {
    console.log("=========>", err.message);
    return res.status(500).json({ mes: "Server error" });
  }
};

//get pinding data
// /get
// product/pinding


const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // جاي من auth middleware

    const {
      title,
      display,
      dawarlyphone,
      price,
      location,
      tags,
      attributes,
      description
    } = req.body;

    // 1️⃣ تأكد إن المنتج موجود وصاحبه نفس اليوزر
    const house = await prisma.house.findUnique({
      where: { id }
    });

    if (!house) {
      return res.status(404).json({ mes: "House not found" });
    }

    if (house.userId !== userId) {
      return res.status(403).json({ mes: "Not allowed to update this house" });
    }

    // 2️⃣ فالديشن display + phone
    if (display === true && !dawarlyphone) {
      return res.status(400).json({
        mes: "dawarlyphone is required when display is true"
      });
    }

    // 3️⃣ جهّز الداتا للتحديث (partial update)
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (display !== undefined) updateData.display = display;
    if (price !== undefined) updateData.price = price;
    if (location !== undefined) updateData.location = location;
    if (tags !== undefined) updateData.tags = tags;
    if (attributes !== undefined) updateData.attributes = attributes;
    if (description !== undefined) updateData.description = description;

    if (display === true) {
      updateData.dawarlyphone = dawarlyphone;
    }

    if (display === false) {
      updateData.dawarlyphone = null;
    }

    // 4️⃣ Update
    const updatedHouse = await prisma.house.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      mes: "House updated successfully",
      data: updatedHouse
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};


const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // من auth middleware

    // 1️⃣ تأكد إن البيت موجود
    const house = await prisma.house.findUnique({
      where: { id }
    });

    if (!house) {
      return res.status(404).json({ mes: "House not found" });
    }

    // 2️⃣ تأكد إن اليوزر هو صاحب الإعلان
    if (house.userId !== userId) {
      return res.status(403).json({ mes: "Not allowed to delete this house" });
    }

    // 3️⃣ حذف البيت
    await prisma.house.delete({
      where: { id }
    });

    res.status(200).json({
      mes: "House deleted successfully"
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};

const listHousesBySubCategory = async (req, res) => {
  try {
    const  subCategoryId  = req.params.id;

    if (!subCategoryId) {
      return res.status(400).json({
        mes: "subCategoryId is required"
      });
    }

    const houses = await prisma.house.findMany({
      where: {
        subCategoryId: subCategoryId
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        display: true,
        tags: true,
        attributes: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        id: "desc" // مؤقتًا، بعدين نخليها createdAt
      }
    });

    res.status(200).json({
      mes: "houses list",
      data: houses
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};


const getpinding = async(req,res)=>{
  try{
 
      if(req.user.isAdmin != true){

        return res.status(400).json({"mes":"only for admins"})
      }

      const pindingproduct = await prisma.house.findMany({where:{pinding:false}})

     res.status(200).json({mes:"pinding product",data:pindingproduct})

  }
  catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

// update pinding data
// put 
// product/:id/pinding

const updatepinding = async(req,res)=>{
  try{

      const id = req.params.id
    if(req.user.isAdmin != true){

        return res.status(400).json({"mes":"only for admins"})
      }

      const updatepinding = await prisma.house.update({where:{id:id},data:{pinding:true}})

      res.status(200).json({mes:"product updated", data:updatepinding})

  }
   catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
}

 
const createProperties_for_rent = async (req, res) => {
  try {
    const { title, display, dawarlyphone, attributes, price , tags ,location } = req.body;
    const id = req.params.id;

   
    
    if (!title || display == null || !attributes || !price || !tags || !location) {
      return res
        .status(400)
        .json({ mes: "title , display and attribtes is require " });
    }

    const Pdata = {
      title:title,
      display:display,
      attributes:attributes,
      userId:req.user.id,
      subCategoryId:id,
      price:price,
      tags:tags,
      location:location,
    }

    if (display == true) {
      if (dawarlyphone == null) {
     return   res
          .status(400)
          .json({ mes: "if  display = true  dawarlyphone is require " });
      }
      Pdata["dawarlyphone"] =dawarlyphone
    }

    // get filters

    const filters = await prisma.attributeDefinition.findMany({
      where: {
        subCategoryId: id,
      },
      select:{
        key:true,
        required:true
      }
    });

      for (const def of filters) {
        if (def.required && attributes[def.key] === undefined) {
          return res.status(400).json({mes:`${def.key} is required`})
        }
      }


  

    //insert product in db 
    const newproduct = await prisma.Properties_for_rent.create({

     data:Pdata  
    })

    res.status(200).json({mes:"newproduct created",data:newproduct})
  } catch (err) {
    console.log("=========>" + err);
    res.status(500).send("err");
  }
};

module.exports = {
  createHouse,
  getHouseById,
  updateHouse,
  deleteHouse,
  listHousesBySubCategory,
  getpinding,
  updatepinding,
  createProperties_for_rent
}