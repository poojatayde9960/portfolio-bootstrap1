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
    const { name, email, number, message, company } = req.body
    console.log(req.body);

    const { isError, error } = checkEmpty({ name, email, number, message, company })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isMobilePhone(number, "en-IN")) {
        return res.status(400).json({ message: "Invalid number" })
    }
    await sendEmail({
        to: "poojatayde607@gmail.com",
        message: `company${company},email${email},mobile${mobile}message${message}`,
        subject: `new Enquery from ${company}`
    })
    await sendEmail({
        to: email,
        message: `thanku for enquery. i will get in touch with toy son`,
        subject: `thanku for your intrest`
    })
    await Enquery.create({ name, email, number, message, company })
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