const express = require("express");
const overtimeController = require("../controllers/overtimeController");
const { validateBody } = require("../middlewares/validateMiddleware");
const {
  findAllSchema,
  createOvertimeSchema,
  updateOvertimeSchema,
} = require("../validatation/overtimeValidation");
const router = express.Router();

// Employee

router.get("/users", overtimeController.findAllFromUser);

router.get(
  "/managers",
  validateBody(findAllSchema),
  overtimeController.findAllFromManager,
);

router.patch("/managers/:id/status", overtimeController.updateStatus);
router.patch("/managers/:id/rejected", overtimeController.rejectStatus);

router.get("/:id", overtimeController.findById);
router.post(
  "/",
  validateBody(createOvertimeSchema),
  overtimeController.createOvertime,
);
router.patch(
  "/:id",
  validateBody(updateOvertimeSchema),
  overtimeController.updateOvertime,
);
router.delete("/:id", overtimeController.remove);

module.exports = router;
