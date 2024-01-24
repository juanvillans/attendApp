const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    attendances: [Number],
    total: {
      type: Number,
      required: true,
    },
  });
  
  // Eliminar la propiedad 'unique' del campo 'name'
  const subjectsSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nroClasses: {
      type: Number,
      required: true,
    },
    lastIdStudent: Number,
    lastAttendedDay: Number,
    students: [studentSchema],
  });
  
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    psw: String,
    subjects: [subjectsSchema],
  });
  
  module.exports = mongoose.model('Users', userSchema);