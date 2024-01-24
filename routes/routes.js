const express = require("express");
const router = express.Router();
const path = require("path");
const Users = require("../models/Users");
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const syncDataController = require("../controllers/syncDataController")

router.get("/", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../public/", "asistencia.html"));
  } catch (error) {
    console.log(error);
  }
});
router.get("/asistencias/:id", async (req, res) => {
  try {
    const user = await Users.findById("6585c9758e3d68f619be8207");
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/home", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../public/", "formularios.html"));
  } catch (error) {
    console.log(error);
  }
});



router.post('/signup', signupController);
router.post('/login', loginController);

router.put('/upload/:objectId', syncDataController);


module.exports = router;
