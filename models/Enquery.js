const mongoose = require("mongoose")
const EnqerySchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    company: { type: String },
    message: { type: String },
    number: { type: String },
}, { timestamps: true })

module.exports = mongoose.model("enquery", EnqerySchema)