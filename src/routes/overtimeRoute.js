const express = require("express");
const overtimeController = require("../controllers/overtimeController");
const router = express.Router();

router.get("/users", overtimeController.findAllById);
router.post("/", overtimeController.createOvertime);
router.patch("/:id", overtimeController.updateOvertime);
router.delete("/:id", overtimeController.remove);

module.exports = router;
