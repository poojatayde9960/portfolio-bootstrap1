const router = require("express").Router()
// const Enquery = require("../models/Enquery")
const public = require("./../controllers/public.controller")


router
    .get("/get-carousel", public.getCarousel)
    .get("/get-projects", public.getProjects)
    .get("/get-project-details/:id", public.getProjectDetails)

    .get("/get-enquiry", public.getEnquery)
    .post("/add-enquiry", public.addEnquiry)
    .put("/update-enquiry/:id", public.updateEnquery)
    .delete("/delete-enquiry/:id", public.deleteEnquery)
module.exports = router