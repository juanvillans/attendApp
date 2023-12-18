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
        

      const user = await Users.findById("657f4771f724c33c44a14fea");
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });
module.exports = router