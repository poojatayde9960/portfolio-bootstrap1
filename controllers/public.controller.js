const asyncHanlder = require("express-async-handler")
const Carousel = require("../models/Carousel")
const Projects = require("../models/Projects")


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