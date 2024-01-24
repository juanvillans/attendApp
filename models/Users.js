const mongoose = require("mongoose")

const studentsSchema = new mongoose.Schema([
    {
        _id: {
            type: Number,
            required:true,
        },
        name:{
            type: String,
            required: true,
            unique: true,
        },
        attendances: [Number],
        total: {
            type: Number,
            required: true,
        },
    }
])

const subjectsSchema = new mongoose.Schema([
    {
        _id: {
            type: String,
            required: true,
        },
        name:  {
            type: String,
            required: true,
        },
        nroClasses:  {
            type: Number,
            required: true,
        },
        lastIdStudent: Number,
        lastAttendedDay: Number,
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