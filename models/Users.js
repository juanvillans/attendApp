const mongoose = require("mongoose")

const studentsSchema = new mongoose.Schema([
    {
        name: String,
        attendances: [Number]
    }
])

const subjectsSchema = new mongoose.Schema([
    {
        name: String,
        nroClasses: Number,
        students: [studentsSchema]
    }
])

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    psw: String,
    subjects: [subjectsSchema]
})

module.exports = mongoose.model('Users', userSchema)