const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");
const path = require("path");

const loginController = async (req, res) => {
  try {
    const { email, psw } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Compara la contraseña ingresada con el hash almacenado en la base de datos
    const isPasswordValid = await bcrypt.compare(psw, user.psw);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    } else {
      // localStorage.setItem("data", JSON.stringify(user))
      return res.status(200).json({ success: true, message: "Inicio de sesión exitoso", data: JSON.stringify(user) });

      // return res.sendFile(path.join(__dirname, "../public/", "asistencia.html"));

    }

  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = loginController;