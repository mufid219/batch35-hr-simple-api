const express = require("express");
const router = express.Router();

const countryController = require("../controllers/countryController");
const { validateBody } = require("../middlewares/validateMiddleware");
const {
  createCountrySchema,
  updateCountrySchema,
} = require("../validatation/countryValidation");

router.get("/", countryController.findAll);
router.get("/:id", countryController.findById);
router.post("/", validateBody(createCountrySchema), countryController.create);
router.put("/:id", validateBody(updateCountrySchema), countryController.update);
router.delete("/:id", countryController.remove);

module.exports = router;
