require("dotenv").config();
const usersRouter = require("./routes/users");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Users = require("./models/Users");

app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/styles", express.static(__dirname + "/public/stylesheets"));
app.use("/scripts", express.static(__dirname + "/public/javascripts"));
// app.use("/images",  express.static(__dirname + '/public/images'));

app.use(express.urlencoded({ extended: true }));
// mongoose.connect(process.env.DATABASE_URL);
mongoose.connect(
  process.env.DATABASE_URL
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("conecction to db"));

async function run() {
  try {
    const user = await Users.create({
      name: "Juan",
      email: "juanvillans116@gmail.com",
      psw: "123",
      subjects: [
        // {
        //   name: "Lenguaje II",
        //   nroClasses: 16,
        //   students: [
        //     {
        //       total: 9,
        //       name: "Juan Pérez",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 8,
        //       name: "María López",
        //       attendances: [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Carlos Rodríguez",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Laura García",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 8,
        //       name: "Ana Martínez",
        //       attendances: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Pedro Sánchez",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Sofía Ramírez",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Javier Torres",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Carolina Gómez",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //     {
        //       total: 9,
        //       name: "Andrés Vargas",
        //       attendances: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //   ],
        // },
        {
          name: "BD avanzados",
          nroClasses: 24,
          lastIdStudent: 22,
          students: [
            {
              _id: 1,
              total: 8,
              name: "Douglas Socorro",
              attendances: [
                1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 2,
              total: 7,
              name: "Efraín Josue",
              attendances: [
                0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 3,
              total: 7,
              name: "Jennifer Mendez",
              attendances: [
                0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 4,
              total: 6,
              name: "Gionaiker Ch",
              attendances: [
                0, 1, 0, 1, 9, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 5,
              total: 6,
              name: "Gabriel Marmol",
              attendances: [
                0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 6,
              total: 7,
              name: "Guillermo Lopez",
              attendances: [
                0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 7,
              total: 8,
              name: "José Carrera",
              attendances: [
                1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 8,
              total: 8,
              name: "Josmer Trompiz",
              attendances: [
                1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 9,
              total: 4,
              name: "Nohel Flores",
              attendances: [
                0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 10,
              total: 8,
              name: "Gregory Suárez",
              attendances: [
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 11,
              total: 8,
              name: "Randyel Acosta",
              attendances: [
                1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 12,
              total: 8,
              name: "Cesar Colina",
              attendances: [
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 13,
              total: 8,
              name: "Alberto Gomez",
              attendances: [
                1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 14,
              total: 9,
              name: "Jorge Maldonado",
              attendances: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 15,
              total: 8,
              name: "Jesús Campo",
              attendances: [
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 16,
              total: 8,
              name: "Benjamín Alastre",
              attendances: [
                1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 17,
              total: 4,
              name: "Génesis Blanco",
              attendances: [
                0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 18,
              total: 8,
              name: "Fabian Vidál",
              attendances: [
                0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 19,
              total: 7,
              name: "Eduaro Lugo",
              attendances: [
                0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 20,
              total: 8,
              name: "Yhoxin Rosell",
              attendances: [
                1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 21,
              total: 8,
              name: "Iván Guipo",
              attendances: [
                1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
            {
              _id: 22,
              total: 7,
              name: "Juan Villasmil",
              attendances: [
                0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
              ],
            },
          ],
        },
      ],
    });
    await user.save();
    // console.log(user);
  } catch (error) {
    console.log(error.message);
  }
}
const collection = db.collection('users');
const result =  collection.deleteMany({}); 

run();
app.use(express.json());

// const usersRouter = require("./routes/users")
app.use(usersRouter);
app.listen(process.env.PORT, () => console.log("server Starting"));
