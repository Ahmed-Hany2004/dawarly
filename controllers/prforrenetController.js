const { prisma } = require("../prismastep");

const {validateAttributes} = require("../validate/validateatter")


const createRentProperty = async (req, res) => {
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

    const userId = req.user.id;

    // 1️⃣ basic validation
    if (!title || !subCategoryId || !price || !location || !attributes) {
      return res.status(400).json({
        mes: "title, subCategoryId, price, location and attributes are required"
      });
    }

    if (display === true && !dawarlyphone) {
      return res.status(400).json({
        mes: "dawarlyphone is required when display is true"
      });
    }

    // 2️⃣ check subCategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId }
    });

    if (!subCategory) {
      return res.status(404).json({
        mes: "SubCategory not found"
      });
    }

    // 3️⃣ get attribute definitions
    const attributeDefs = await prisma.attributeDefinition.findMany({
      where: { subCategoryId },
      include: {
        options: true
      }
    });

    // 4️⃣ VALIDATE ATTRIBUTES 🔥
    try {
      validateAttributes(attributes, attributeDefs);
    } catch (err) {
      return res.status(400).json({
        mes: err.message
      });
    }

    // 5️⃣ create property
    const newProperty = await prisma.properties_for_rent.create({
      data: {
        title,
        subCategoryId,
        price,
        location,
        display: display ?? false,
        dawarlyphone: display ? dawarlyphone : null,
        tags,
        attributes,
        description,
        userId
      }
    });

    res.status(201).json({
      mes: "Property for rent created successfully",
      data: newProperty
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};


const getRentPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.properties_for_rent.findUnique({
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

    if (!property) {
      return res.status(404).json({ mes: "Property for rent not found" });
    }

    return res.status(200).json({
      mes: "Property for rent found",
      data: property
    });

  } catch (err) {
    console.log("=========>", err.message);
    return res.status(500).json({ mes: "Server error" });
  }
};


const updateRentProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // من auth middleware

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

    // 1️⃣ تأكد إن المنتج موجود
    const property = await prisma.properties_for_rent.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ mes: "Property for rent not found" });
    }

    // 2️⃣ تأكد إن اليوزر هو صاحب الإعلان
    if (property.userId !== userId) {
      return res.status(403).json({ mes: "Not allowed to update this property" });
    }

    // 3️⃣ فالديشن display + phone
    if (display === true && !dawarlyphone) {
      return res.status(400).json({
        mes: "dawarlyphone is required when display is true"
      });
    }

    // 4️⃣ تجهيز الداتا للتحديث (partial update)
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

    // 5️⃣ Update
    const updatedProperty = await prisma.properties_for_rent.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      mes: "Property for rent updated successfully",
      data: updatedProperty
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};


const deleteRentProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // من auth middleware

    // 1️⃣ تأكد إن العقار موجود
    const property = await prisma.properties_for_rent.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ mes: "Property for rent not found" });
    }

    // 2️⃣ تأكد إن اليوزر هو صاحب الإعلان
    if (property.userId !== userId) {
      return res.status(403).json({ mes: "Not allowed to delete this property" });
    }

    // 3️⃣ حذف العقار
    await prisma.properties_for_rent.delete({
      where: { id }
    });

    res.status(200).json({
      mes: "Property for rent deleted successfully"
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};

const listRentPropertiesBySubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;

    if (!subCategoryId) {
      return res.status(400).json({
        mes: "subCategoryId is required"
      });
    }

    const properties = await prisma.properties_for_rent.findMany({
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
      mes: "properties for rent list",
      data: properties
    });

  } catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
};

const getall = async(req,res)=>{

  try{

   const property = await prisma.properties_for_rent.findUnique({
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

    res.status(200).json({"mes":"all data",data:property})
  }
  catch (err) {
    console.log("=========>", err.message);
    res.status(500).json({ mes: "Server error" });
  }
}


module.exports= {createRentProperty,getRentPropertyById,updateRentProperty,deleteRentProperty,listRentPropertiesBySubCategory,getall}
