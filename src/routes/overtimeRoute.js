const express = require("express");
const overtimeController = require("../controllers/overtimeController");
const router = express.Router();

router.get("/users", overtimeController.findAllFromUser);
router.get("/managers", overtimeController.findAllFromManager);
router.post("/", overtimeController.createOvertime);
router.patch("/:id", overtimeController.updateOvertime);
router.patch("/:id/status", overtimeController.updateStatus);
router.patch("/:id/rejected", overtimeController.rejectStatus);
router.delete("/:id", overtimeController.remove);

module.exports = router;
