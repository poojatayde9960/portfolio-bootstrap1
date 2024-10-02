const asyncHanlder = require("express-async-handler")
const Carousel = require("../models/Carousel")
const Projects = require("../models/Projects")
const validator = require("validator")
const Enquery = require("../models/Enquery")
const { checkEmpty } = require("../utils/checkEmpty")


exports.getProjects = asyncHanlder(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "project fetch Success", result })
})
exports.getCarousel = asyncHanlder(async (req, res) => {
    const result = await Carousel.find()
    res.json({ message: "Carousel Fetch Success", result })
})
exports.getProjectDetails = asyncHanlder(async (req, res) => {
    const result = await Projects.findById(req.params.id)
    res.json({ message: "Carousel project details Success", result })
})

// Enquery
exports.addEnquiry = asyncHanlder(async (req, res) => {
    const { name, email, mobile, message, company } = req.body
    console.log(req.body);

    const { isError, error } = checkEmpty({ name, email, mobile, message, company })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({ message: "Invalid Mobile" })
    }
    await Enquery.create({ name, email, mobile, message, company })
    res.json({ message: "Enquery Message Added Success...!", })
})

exports.getEnquery = asyncHanlder(async (req, res) => {
    const result = await Enquery.find()
    res.json({ message: "Enquery fetch Success", result })
})

exports.updateEnquery = asyncHanlder(async (req, res) => {
    const result = await Enquery.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: "enquiry  updtae Success", result })
})
exports.deleteEnquery = asyncHanlder(async (req, res) => {
    const result = await Enquery.findByIdAndDelete(req.params.id)
    res.json({ message: "enquiry  delete Success", result })
})