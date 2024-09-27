const asyncHanlder = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const Technology = require("../models/Technology")
const Social = require("../models/Social")
const { upload, projectUpload } = require("../utils/upload")
const cloudinary = require("../utils/cloudinary.config")
const Carousel = require("../models/Carousel")
const path = require("path")
const { error } = require("console")
// const { default: Projects } = require("../../client/src/pages/admin/Projects")
const { title } = require("process")
const Projects = require("../models/Projects")
const expressAsyncHandler = require("express-async-handler")
exports.addTechnology = asyncHanlder(async (req, res) => {
    const { name, category } = req.body
    const { isError, error } = checkEmpty({ name, category })
    if (isError) {
        return res.status(400).json({ message: "All Feild Required", error })
    }
    await Technology.create({ name, category })
    res.json({ message: "Technology Create Success" })
})
exports.getTechnology = asyncHanlder(async (req, res) => {
    const result = await Technology.find()
    res.json({ message: "Technology Fetch Success", result })
})
exports.updateTechnology = asyncHanlder(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndUpdate(id, req.body)
    res.json({ message: "Technology Update Success" })
})
exports.deleteTechnology = asyncHanlder(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndDelete(id)
    res.json({ message: "Technology Delete Success" })
})


exports.addSocial = asyncHanlder(async (req, res) => {
    const { name, link } = req.body
    const { isError, error } = checkEmpty({ name, link })
    if (isError) {
        return res.status(400).json({ message: "All Feild Required", error })
    }
    await Social.create({ name, link })
    res.json({ message: "Social Media Create Success" })
})
exports.getSocial = asyncHanlder(async (req, res) => {
    const result = await Social.find()
    res.json({ message: "Social Fetch Success", result })
})
exports.updateSocial = asyncHanlder(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndUpdate(id, req.body)
    res.json({ message: "Social Update Success" })
})
exports.deleteSocial = asyncHanlder(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndDelete(id)
    res.json({ message: "Social Delete Success" })
})


exports.addCarousel = asyncHanlder(async (req, res) => {
    upload(req, res, async err => {

        const { caption } = req.body
        const { isError, error } = checkEmpty({ caption })
        if (isError) {
            return res.status(400).json({ message: "All Feild Required", error })
        }
        if (!req.file) {
            return res.status(400).json({ message: "Hero Image Is Required" })
        }
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        await Carousel.create({ caption, hero: secure_url })
        res.json({ message: "Carousel Create Success" })
    })


})
exports.getCarousel = asyncHanlder(async (req, res) => {
    const result = await Carousel.find()
    res.json({ message: "Carousel Fetch Success", result })
})
exports.updateCarousel = asyncHanlder(async (req, res) => {
    upload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "Multer Error", error: err.message })
        }
        const { id } = req.params

        if (req.file) {
            const result = await Carousel.findById(id)
            await cloudinary.uploader.destroy(path.basename(result.hero))
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Carousel.findByIdAndUpdate(id, { caption: req.body.caption, hero: secure_url })
            res.json({ message: "Carousel Update Success" })
        } else {
            await Carousel.findByIdAndUpdate(id, { caption: req.body.caption })
            res.json({ message: "Carousel Update Success" })
        }
    })
})
exports.deleteCarousel = asyncHanlder(async (req, res) => {
    const { id } = req.params
    const result = await Carousel.findById(id)
    await cloudinary.uploader.destroy(path.basename(result.hero))
    await Carousel.findByIdAndDelete(id)
    res.json({ message: "Carousel Delete Success" })
})

exports.addProject = asyncHanlder(async (req, res) => {
    projectUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Multer Error" })
        }
        if (
            !req.files["hero"] ||
            !req.files["screenshots-web-main"] ||
            !req.files["screenshots-web-other"] ||
            !req.files["screenshots-mobile-main"] ||
            !req.files["screenshots-mobile-other"] ||
            !req.files["sections-web-hero"] ||
            !req.files["sections-mobile-hero"]
        ) {
            return res.status(400).json({ message: "All Images Required" })
        }
        let images = {}
        for (const key in req.files) {
            if (key === "screenshots-Web-other" || key === "screenshots-Mobile-other") {
                if (!images[key]) {
                    images[key] = []
                }
                const uploadALLImages = []
                for (const item of req.files[key]) {
                    uploadALLImages.push(cloudinary.uploader.upload(item.path))
                }
                const allData = await Promise.all(uploadALLImages)
                images[key] = allData.map(item => item.secure_url)
            } else {
                const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path)
                images[key] = secure_url
            }
        }
        await Projects.create({
            title: req.body.title,
            shortdesc: req.body.shortdesc,
            desc: req.body.desc,
            duration: req.body.duration,
            learning: req.body.learning,
            images: images.images,
            live: req.body.live,
            source: req.body.source,
            isMobileApp: req.body.isMobileApp,
            technologies: {
                frontend: req.body.FrontEnd,
                backend: req.body.BackEnd,
                mobile: req.body.Mobile,
                collabration: req.body.Collabration,
                hoisting: req.body.Hoisting,
            },
            sections: {
                web: [
                    {
                        title: req.body["sections-web-title"],
                        desc: req.body["sections-web-desc"],
                        images: images["sections-web-images"],
                    }
                ],
                mobile: [
                    {
                        title: req.body["sections-mobile-title"],
                        desc: req.body["sections-mobile-desc"],
                        images: images["sections-mobile-images"],
                    }
                ],
            },
            screenshots: {
                web: {
                    main: images["screenshots-Web-main"],
                    other: images["screenshots-Web-other"]
                },
                mobile: {
                    main: images["screenshots-Mobile-main"],
                    other: images["screenshots-Mobile-other"]
                }
            },
        })
        res.json({ message: "Project Add Success...!" })
    })
})



exports.getProject = asyncHanlder(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Project fetch Success", result })
})



exports.deleteProject = asyncHanlder(async (req, res) => {
    const { id } = req.params
    const result = await Projects.findById(id)
    const allImages = []
    allImages.push(cloudinary.uploader.destroy(path.basename(result.hero)))

    for (const item of result.sections.web) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
    }
    for (const item of result.sections.web) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item.hero)))
    }

    allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.web.main)))
    allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.mobile.main)))

    for (const item of result.screenshots.web.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    for (const item of result.screenshots.mobile.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    await Promise.all(allImages)
    await Projects.findByIdAndDelete(id)
    res.json({ message: "Project Delete Success" })
})

