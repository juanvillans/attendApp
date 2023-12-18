require("dotenv").config();
const usersRouter = require("./routes/users")
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const path = require("path")

app.use(cors())
app.options('*', cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
// app.use("/images",  express.static(__dirname + '/public/images'));


app.use(express.urlencoded({extended:true}))
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("conecction to db"));

app.use(express.json())

// const usersRouter = require("./routes/users")
app.use(usersRouter)
app.listen(3000, () => console.log("server Starting"));
 