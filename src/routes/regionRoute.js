const express = require("express");
const router = express.Router();

const regionController = require("../controllers/regionController");
const { validateBody } = require("../middlewares/validateMiddleware");
const {
  createRegionCountriesSchema,
  createOrUpdateRegionSchema,
} = require("../validatation/regionValidation");

router.get("/countries", regionController.getRegionsWithCountries);
// validation region
router.post(
  "/countries",
  validateBody(createRegionCountriesSchema),
  regionController.createCountries,
);

router.get("/", regionController.findAll);
router.get("/:id", regionController.findById);
router.post(
  "/",
  validateBody(createOrUpdateRegionSchema),
  regionController.create,
);
router.put(
  "/:id",
  validateBody(createOrUpdateRegionSchema),
  regionController.update,
);
router.delete("/:id", regionController.remove);

module.exports = router;
