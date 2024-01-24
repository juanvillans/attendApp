const bcrypt = require("bcryptjs"); // Importa la biblioteca bcryptjs
const Users = require("../models/Users");
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const signupController = async (req, res) => {
  try {
    const { name, email, psw } = req.body;

    const existUser = await Users.findOne({ email });

    if (existUser) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado" });
    } else {
      // Genera el hash de la contraseña
      const hashedPassword = await bcrypt.hash(psw, 10);
      const newId = uuidv4();
      const user = await Users.create({
        name,
        email,
        psw: hashedPassword, // Guarda el hash en lugar de la contraseña original
        subjects: [
          {
            _id: newId,
            name: "materia 1",
            nroClasses: 24,
            lastIdStudent: 0,
            students: [{
              _id: 1,
              name: "Primer Estudiante",
              total: 0,
              attendances: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }],
            lastAttendedDay: 0,

          },
        ],
      });
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Registro exitoso",
      });
    }
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = signupController;
