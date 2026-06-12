const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/departmentController");

//import middleware validasi & schema
const {
  createDepartmentSchema,
  updateDepartmentSchema,
} = require("../validatation/departmentValidation");
const { validateBody } = require("../middlewares/validateMiddleware");

router.get("/employees", departmentController.getDepartmentWithCountries);
router.post("/employees", departmentController.createEmployees);

router.get("/", departmentController.findAll);
router.get("/:id", departmentController.findById);

//contoh validasi using schemaDeparmentValidation, penggunaan middleware
router.post(
  "/",
  validateBody(createDepartmentSchema),
  departmentController.create,
);

router.put(
  "/:id",
  validateBody(updateDepartmentSchema),
  departmentController.update,
);
router.delete("/:id", departmentController.remove);

module.exports = router;
