const Users = require("../models/Users");

const updateController = async (req, res) => {
    try {
      console.log("se ejecutó");
      const objectId = req.params.objectId;
      const updatedObject = req.body;
  
      const updatedDocument = await Users.findByIdAndUpdate(
        objectId,
        updatedObject,
        { new: true }
      );
  
      if (!updatedDocument) {
        console.log("Object not found");
        return res.status(404).json({ error: "Object not found" });      
      }
  
      return res.status(200).json({ success: true, message: "Subido a la nube con exito" });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  module.exports = updateController;
