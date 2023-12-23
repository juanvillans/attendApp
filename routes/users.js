const express = require("express")
const router = express.Router()
const path = require("path")
const Users = require("../models/Users") 

router.get("/asistencias", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "../public/", "asistencia.html"))

    } catch (error) {
        console.log(error)
    }
})
router.get("/asistencias/:id", async (req, res) => {
    try {
        
      const user = await Users.findById("6585c9758e3d68f619be8207");
      res.json(user);
      console.log(user)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });
module.exports = router
